import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';
import { query, tipToJson } from '../db.js';
import { requireAuth, loadUser, requireMfaIfEnforced } from '../middleware/auth.js';

const officerAuth = [requireAuth, loadUser, requireMfaIfEnforced];
import { tipUploadLimiter, tipWriteLimiter } from '../middleware/rateLimit.js';
import {
  isAllowedAttachmentMime,
  maxAttachmentsPerTip,
} from '../security/uploads.js';
import {
  extractEditToken,
  generateEditToken,
  hashEditToken,
  verifyEditToken,
} from '../security/editToken.js';
import { notifyNewTip } from '../services/email.js';

const router = Router();
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

/** Tip ids are UUID v4; reject other path segments before any filesystem use. */
function isTipUuid(id) {
  return typeof id === 'string' && uuidValidate(id) && uuidVersion(id) === 4;
}

function unlinkQuiet(filePath) {
  try {
    if (filePath) fs.unlinkSync(filePath);
  } catch {
    /* ignore */
  }
}

// Memory first: authorize draft capability before any disk write (H1).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_UPLOAD_BYTES || 25 * 1024 * 1024) },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedAttachmentMime(file.mimetype)) {
      return cb(new Error('File type not allowed'));
    }
    return cb(null, true);
  },
});

/** Load tip + verify edit token before multer accepts the body. */
async function requireDraftUploadAuth(req, res, next) {
  if (!isTipUuid(req.params.id)) {
    return res.status(404).json({ error: 'Tip not found' });
  }
  try {
    const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });
    const gate = requireDraftCapability(req, rows[0]);
    if (!gate.ok) return res.status(gate.status).json({ error: gate.error });
    req.draftTip = rows[0];
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload authorization failed' });
  }
}

function requireSubmittedTip(tipRow) {
  if (!tipRow || !tipRow.submitted) {
    return { ok: false, status: 404, error: 'Tip not found' };
  }
  return { ok: true };
}

async function getAttachments(tipId) {
  const { rows } = await query(
    `SELECT id, filename, stored_name, mime_type, size_bytes, created_at
     FROM tip_attachments WHERE tip_id = $1 ORDER BY created_at`,
    [tipId],
  );
  const map = {};
  for (const row of rows) {
    map[row.id] = {
      id: row.id,
      filename: row.filename,
      storedName: row.stored_name,
      type: row.mime_type,
      size: Number(row.size_bytes || 0),
      createdAt: row.created_at,
    };
  }
  return map;
}

async function getNotes(tipId) {
  const { rows } = await query(
    `SELECT n.id, n.note, n.user_id, n.deleted, n.deleted_at, n.created_at,
            u.rank, u.first_name, u.last_name
     FROM tip_notes n
     JOIN users u ON u.id = n.user_id
     WHERE n.tip_id = $1
     ORDER BY n.created_at`,
    [tipId],
  );
  const map = {};
  for (const row of rows) {
    map[row.id] = {
      id: row.id,
      note: row.note,
      uid: row.user_id,
      deleted: row.deleted,
      deleted_timestamp: row.deleted_at ? Date.parse(row.deleted_at) : null,
      timestamp: Date.parse(row.created_at),
      authorName: `${row.rank} ${row.first_name} ${row.last_name}`.trim(),
    };
  }
  return map;
}

async function loadTip(id, { withExtras = false } = {}) {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [id]);
  if (!rows[0]) return null;
  const tip = tipToJson(rows[0]);
  if (withExtras) {
    tip.attachments = await getAttachments(id);
    tip.userNotes = await getNotes(id);
  }
  return tip;
}

function stripServerFields(body = {}) {
  const copy = { ...body };
  delete copy.id;
  delete copy.submitted;
  delete copy.read;
  delete copy.archived;
  delete copy.important;
  delete copy.attachments;
  delete copy.userNotes;
  delete copy.createdAt;
  delete copy.updatedAt;
  delete copy.editToken;
  delete copy.edit_token;
  delete copy.edit_token_hash;
  return copy;
}

function requireDraftCapability(req, tipRow) {
  if (!tipRow || tipRow.submitted) {
    return { ok: false, status: 403, error: 'Submitted tips cannot be modified publicly' };
  }
  const token = extractEditToken(req);
  if (!verifyEditToken(token, tipRow.edit_token_hash)) {
    return { ok: false, status: 403, error: 'Valid edit token required' };
  }
  return { ok: true };
}

// Public: create draft tip (abandoned flow)
router.post('/', tipWriteLimiter, async (req, res) => {
  const body = stripServerFields(req.body || {});
  const submitted = Boolean(req.body?.submitted);
  const timestampStart = body.timestampStart || Date.now();
  const timestampSubmit = submitted ? (body.timestampSubmit || Date.now()) : null;

  const editToken = submitted ? null : generateEditToken();
  const editTokenHash = editToken ? hashEditToken(editToken) : null;

  const { rows } = await query(
    `INSERT INTO tips (
       payload, submitted, read, archived, important,
       timestamp_start, timestamp_submit, edit_token_hash
     )
     VALUES ($1::jsonb, $2, FALSE, FALSE, FALSE, $3, $4, $5)
     RETURNING *`,
    [JSON.stringify(body), submitted, timestampStart, timestampSubmit, editTokenHash],
  );

  const tip = tipToJson(rows[0]);
  tip.attachments = {};

  if (submitted) {
    notifyNewTip(tip.id).catch((err) => console.error('notify failed', err));
  }

  const payload = { tip };
  if (editToken) payload.editToken = editToken;
  res.status(201).json(payload);
});

// Public: update unsubmitted tip payload
router.patch('/:id', tipWriteLimiter, async (req, res) => {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });

  const gate = requireDraftCapability(req, rows[0]);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });

  const incoming = stripServerFields(req.body || {});
  const payload = { ...(rows[0].payload || {}), ...incoming };

  const updated = await query(
    `UPDATE tips SET payload = $1::jsonb, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [JSON.stringify(payload), req.params.id],
  );
  const tip = tipToJson(updated.rows[0]);
  tip.attachments = await getAttachments(req.params.id);
  return res.json({ tip });
});

// Public: submit tip
router.post('/:id/submit', tipWriteLimiter, async (req, res) => {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });
  if (rows[0].submitted) return res.status(400).json({ error: 'Already submitted' });

  const gate = requireDraftCapability(req, rows[0]);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });

  const incoming = stripServerFields(req.body || {});
  const payload = {
    ...(rows[0].payload || {}),
    ...incoming,
    submitted: true,
  };
  const timestampSubmit = Date.now();

  const updated = await query(
    `UPDATE tips
     SET payload = $1::jsonb, submitted = TRUE, read = FALSE, archived = FALSE, important = FALSE,
         timestamp_submit = $2, edit_token_hash = NULL, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [JSON.stringify(payload), timestampSubmit, req.params.id],
  );

  const tip = tipToJson(updated.rows[0]);
  tip.attachments = await getAttachments(req.params.id);
  notifyNewTip(tip.id).catch((err) => console.error('notify failed', err));
  return res.json({ tip });
});

// Public: upload attachment to draft tip (auth before disk write)
router.post(
  '/:id/attachments',
  tipUploadLimiter,
  requireDraftUploadAuth,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        const message = err.message || 'Upload failed';
        const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        return res.status(status).json({ error: message });
      }
      return next();
    });
  },
  async (req, res) => {
    if (!req.file?.buffer) return res.status(400).json({ error: 'file required' });

    const tipId = req.params.id;
    let writtenPath = null;

    try {
      const countRes = await query(
        `SELECT COUNT(*)::int AS count FROM tip_attachments WHERE tip_id = $1`,
        [tipId],
      );
      if (countRes.rows[0].count >= maxAttachmentsPerTip()) {
        return res.status(400).json({
          error: `Maximum of ${maxAttachmentsPerTip()} attachments per tip`,
        });
      }

      const safe = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storedName = `${uuidv4()}-${safe}`;
      const dir = path.join(uploadDir, tipId);
      fs.mkdirSync(dir, { recursive: true });
      writtenPath = path.join(dir, storedName);
      fs.writeFileSync(writtenPath, req.file.buffer);

      const inserted = await query(
        `INSERT INTO tip_attachments (tip_id, filename, stored_name, mime_type, size_bytes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [tipId, req.file.originalname, storedName, req.file.mimetype, req.file.size],
      );

      const row = inserted.rows[0];
      return res.status(201).json({
        attachment: {
          id: row.id,
          filename: row.filename,
          storedName: row.stored_name,
          type: row.mime_type,
          size: Number(row.size_bytes),
        },
      });
    } catch (err) {
      unlinkQuiet(writtenPath);
      console.error(err);
      return res.status(500).json({ error: 'Upload failed' });
    }
  },
);

// Public draft (edit token) or officer (session): list attachments
router.get('/:id/attachments', async (req, res) => {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });

  if (rows[0].submitted) {
    return requireAuth(req, res, async () => {
      const attachments = await getAttachments(req.params.id);
      return res.json({ attachments });
    });
  }

  const gate = requireDraftCapability(req, rows[0]);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });

  const attachments = await getAttachments(req.params.id);
  return res.json({ attachments });
});

router.delete('/:id/attachments/:attachmentId', async (req, res) => {
  const tipRes = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!tipRes.rows[0]) return res.status(404).json({ error: 'Tip not found' });

  const gate = requireDraftCapability(req, tipRes.rows[0]);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });

  const att = await query(
    `SELECT * FROM tip_attachments WHERE id = $1 AND tip_id = $2`,
    [req.params.attachmentId, req.params.id],
  );
  if (!att.rows[0]) return res.status(404).json({ error: 'Attachment not found' });

  const filePath = path.join(uploadDir, req.params.id, att.rows[0].stored_name);
  try {
    fs.unlinkSync(filePath);
  } catch {
    /* ignore missing file */
  }
  await query(`DELETE FROM tip_attachments WHERE id = $1`, [req.params.attachmentId]);
  return res.json({ ok: true });
});

// Officer: list tips
router.get('/', ...officerAuth, async (req, res) => {
  const criteria = req.query.criteria || 'archived';
  const rawValue = req.query.value;
  let value = rawValue === 'true' ? true : rawValue === 'false' ? false : rawValue;

  const allowed = ['archived', 'important', 'read', 'submitted'];
  if (!allowed.includes(criteria)) {
    return res.status(400).json({ error: 'Invalid filter criteria' });
  }

  // Default mailbox: submitted + not archived
  let sql = `SELECT * FROM tips WHERE submitted = TRUE`;
  const params = [];

  if (criteria === 'archived') {
    params.push(value === undefined ? false : Boolean(value));
    sql += ` AND archived = $${params.length}`;
  } else if (criteria === 'important') {
    params.push(Boolean(value));
    sql += ` AND important = $${params.length} AND archived = FALSE`;
  } else if (criteria === 'read') {
    params.push(Boolean(value));
    sql += ` AND read = $${params.length} AND archived = FALSE`;
  }

  sql += ` ORDER BY COALESCE(timestamp_submit, timestamp_start, EXTRACT(EPOCH FROM created_at)*1000) DESC LIMIT 1000`;

  const { rows } = await query(sql, params);
  const tips = {};
  for (const row of rows) {
    tips[row.id] = tipToJson(row);
  }
  return res.json({ tips });
});

router.get('/:id', ...officerAuth, async (req, res) => {
  const tip = await loadTip(req.params.id, { withExtras: true });
  // Mailbox is submitted-only; do not expose unsubmitted drafts by UUID (M1).
  if (!tip || !tip.submitted) {
    return res.status(404).json({ error: 'Tip not found' });
  }
  return res.json({ tip });
});

router.patch('/:id/flags', ...officerAuth, async (req, res) => {
  const { read, archived, important } = req.body || {};
  const existing = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  const gate = requireSubmittedTip(existing.rows[0]);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });

  const next = {
    read: typeof read === 'boolean' ? read : existing.rows[0].read,
    archived: typeof archived === 'boolean' ? archived : existing.rows[0].archived,
    important: typeof important === 'boolean' ? important : existing.rows[0].important,
  };
  if (next.archived) next.important = false;

  const updated = await query(
    `UPDATE tips SET read = $1, archived = $2, important = $3, updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [next.read, next.archived, next.important, req.params.id],
  );

  // activity log for changed flags
  for (const action of ['read', 'archived', 'important']) {
    if (typeof req.body?.[action] === 'boolean') {
      await query(
        `INSERT INTO activity_logs (user_id, tip_id, action, status) VALUES ($1, $2, $3, $4)`,
        [req.user.sub, req.params.id, action, req.body[action]],
      );
    }
  }

  return res.json({ tip: tipToJson(updated.rows[0]) });
});

router.post('/:id/notes', ...officerAuth, async (req, res) => {
  const note = (req.body?.note || '').trim();
  if (!note) return res.status(400).json({ error: 'note required' });

  const tip = await query(`SELECT id, submitted FROM tips WHERE id = $1`, [req.params.id]);
  const gate = requireSubmittedTip(tip.rows[0]);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });

  const inserted = await query(
    `INSERT INTO tip_notes (tip_id, user_id, note) VALUES ($1, $2, $3) RETURNING *`,
    [req.params.id, req.user.sub, note],
  );
  const row = inserted.rows[0];
  return res.status(201).json({
    note: {
      id: row.id,
      note: row.note,
      uid: row.user_id,
      deleted: false,
      timestamp: Date.parse(row.created_at),
      authorName: `${req.dbUser.rank} ${req.dbUser.first_name} ${req.dbUser.last_name}`.trim(),
    },
  });
});

router.delete('/:id/notes/:noteId', ...officerAuth, async (req, res) => {
  const tipRes = await query(`SELECT id, submitted FROM tips WHERE id = $1`, [req.params.id]);
  const tipGate = requireSubmittedTip(tipRes.rows[0]);
  if (!tipGate.ok) return res.status(tipGate.status).json({ error: tipGate.error });

  const { rows } = await query(
    `SELECT * FROM tip_notes WHERE id = $1 AND tip_id = $2`,
    [req.params.noteId, req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Note not found' });
  if (rows[0].user_id !== req.user.sub && !req.dbUser.admin) {
    return res.status(403).json({ error: 'Cannot delete another officer\'s note' });
  }

  await query(
    `UPDATE tip_notes SET deleted = TRUE, deleted_at = NOW() WHERE id = $1`,
    [req.params.noteId],
  );
  return res.json({ ok: true });
});

// Officer download (submitted tips only)
router.get('/:id/attachments/:attachmentId/download', ...officerAuth, async (req, res) => {
  const tipRes = await query(`SELECT id, submitted FROM tips WHERE id = $1`, [req.params.id]);
  const tipGate = requireSubmittedTip(tipRes.rows[0]);
  if (!tipGate.ok) return res.status(tipGate.status).json({ error: tipGate.error });

  const att = await query(
    `SELECT * FROM tip_attachments WHERE id = $1 AND tip_id = $2`,
    [req.params.attachmentId, req.params.id],
  );
  if (!att.rows[0]) return res.status(404).json({ error: 'Attachment not found' });
  const filePath = path.join(uploadDir, req.params.id, att.rows[0].stored_name);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing' });
  return res.download(filePath, att.rows[0].filename);
});

export default router;
