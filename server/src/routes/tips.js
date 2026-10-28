import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { query, tipToJson } from '../db.js';
import { requireAuth, loadUser } from '../middleware/auth.js';
import { tipUploadLimiter, tipWriteLimiter } from '../middleware/rateLimit.js';
import {
  isAllowedAttachmentMime,
  maxAttachmentsPerTip,
} from '../security/uploads.js';
import { notifyNewTip } from '../services/email.js';

const router = Router();
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(uploadDir, req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uuidv4()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_BYTES || 25 * 1024 * 1024) },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedAttachmentMime(file.mimetype)) {
      return cb(new Error('File type not allowed'));
    }
    return cb(null, true);
  },
});

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
  return copy;
}

// Public: create draft tip (abandoned flow)
router.post('/', tipWriteLimiter, async (req, res) => {
  const body = stripServerFields(req.body || {});
  const submitted = Boolean(req.body?.submitted);
  const timestampStart = body.timestampStart || Date.now();
  const timestampSubmit = submitted ? (body.timestampSubmit || Date.now()) : null;

  const { rows } = await query(
    `INSERT INTO tips (payload, submitted, read, archived, important, timestamp_start, timestamp_submit)
     VALUES ($1::jsonb, $2, FALSE, FALSE, FALSE, $3, $4)
     RETURNING *`,
    [JSON.stringify(body), submitted, timestampStart, timestampSubmit],
  );

  const tip = tipToJson(rows[0]);
  tip.attachments = {};

  if (submitted) {
    notifyNewTip(tip.id).catch((err) => console.error('notify failed', err));
  }

  res.status(201).json({ tip });
});

// Public: update unsubmitted tip payload
router.patch('/:id', tipWriteLimiter, async (req, res) => {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });
  if (rows[0].submitted) {
    return res.status(403).json({ error: 'Submitted tips cannot be updated publicly' });
  }

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
         timestamp_submit = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [JSON.stringify(payload), timestampSubmit, req.params.id],
  );

  const tip = tipToJson(updated.rows[0]);
  tip.attachments = await getAttachments(req.params.id);
  notifyNewTip(tip.id).catch((err) => console.error('notify failed', err));
  return res.json({ tip });
});

// Public: upload attachment to draft tip
router.post('/:id/attachments', tipUploadLimiter, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const message = err.message || 'Upload failed';
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ error: message });
    }
    return next();
  });
}, async (req, res) => {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });
  if (rows[0].submitted) {
    return res.status(403).json({ error: 'Cannot attach to submitted tip' });
  }
  if (!req.file) return res.status(400).json({ error: 'file required' });

  const countRes = await query(
    `SELECT COUNT(*)::int AS count FROM tip_attachments WHERE tip_id = $1`,
    [req.params.id],
  );
  if (countRes.rows[0].count >= maxAttachmentsPerTip()) {
    try {
      fs.unlinkSync(req.file.path);
    } catch {
      /* ignore */
    }
    return res.status(400).json({
      error: `Maximum of ${maxAttachmentsPerTip()} attachments per tip`,
    });
  }

  const inserted = await query(
    `INSERT INTO tip_attachments (tip_id, filename, stored_name, mime_type, size_bytes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      req.params.id,
      req.file.originalname,
      req.file.filename,
      req.file.mimetype,
      req.file.size,
    ],
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
});

// Public: list attachments for draft (or officer for any)
router.get('/:id/attachments', async (req, res) => {
  const { rows } = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Tip not found' });

  const authHeader = req.headers.authorization || '';
  if (rows[0].submitted && !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const attachments = await getAttachments(req.params.id);
  return res.json({ attachments });
});

router.delete('/:id/attachments/:attachmentId', async (req, res) => {
  const tipRes = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!tipRes.rows[0]) return res.status(404).json({ error: 'Tip not found' });
  if (tipRes.rows[0].submitted) {
    return res.status(403).json({ error: 'Cannot delete attachment on submitted tip' });
  }

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
router.get('/', requireAuth, loadUser, async (req, res) => {
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

router.get('/:id', requireAuth, loadUser, async (req, res) => {
  const tip = await loadTip(req.params.id, { withExtras: true });
  if (!tip || !tip.submitted) {
    // officers can still see submitted only for mailbox; allow any for admin debugging of drafts? Prefer submitted only.
    if (!tip) return res.status(404).json({ error: 'Tip not found' });
  }
  return res.json({ tip });
});

router.patch('/:id/flags', requireAuth, loadUser, async (req, res) => {
  const { read, archived, important } = req.body || {};
  const existing = await query(`SELECT * FROM tips WHERE id = $1`, [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ error: 'Tip not found' });

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

router.post('/:id/notes', requireAuth, loadUser, async (req, res) => {
  const note = (req.body?.note || '').trim();
  if (!note) return res.status(400).json({ error: 'note required' });

  const tip = await query(`SELECT id FROM tips WHERE id = $1`, [req.params.id]);
  if (!tip.rows[0]) return res.status(404).json({ error: 'Tip not found' });

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

router.delete('/:id/notes/:noteId', requireAuth, loadUser, async (req, res) => {
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

// Officer download
router.get('/:id/attachments/:attachmentId/download', requireAuth, loadUser, async (req, res) => {
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
