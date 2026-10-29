import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../db.js';
import {
  requireAuth,
  requireAdmin,
  loadUser,
  requireMfaIfEnforced,
} from '../middleware/auth.js';
import {
  BRANDING_KEY,
  resolveBranding,
  sanitizeBrandingPatch,
  publicBrandingPayload,
  ensureBrandingUploadDir,
  clearStoredLogoFiles,
  findStoredLogoPath,
} from '../services/branding.js';

const router = Router();

const LOGO_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);

const LOGO_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/gif': '.gif',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      try {
        cb(null, ensureBrandingUploadDir());
      } catch (err) {
        cb(err);
      }
    },
    filename: (_req, file, cb) => {
      const ext = LOGO_EXT[file.mimetype] || path.extname(file.originalname) || '.png';
      cb(null, `logo${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!LOGO_MIMES.has(file.mimetype)) {
      return cb(new Error('Logo must be PNG, JPEG, WebP, GIF, or SVG'));
    }
    return cb(null, true);
  },
});

async function loadDbBranding() {
  const { rows } = await query(`SELECT value FROM app_settings WHERE key = $1`, [BRANDING_KEY]);
  return rows[0]?.value || {};
}

async function saveDbBranding(value) {
  await query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [BRANDING_KEY, JSON.stringify(value)],
  );
}

/** Public: resolved branding for tip site + officer shell. */
router.get('/', async (_req, res) => {
  try {
    const db = await loadDbBranding();
    const resolved = resolveBranding(db);
    res.json({ branding: publicBrandingPayload(resolved) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load branding' });
  }
});

/** Public: streamed uploaded logo (same-origin). */
router.get('/logo', (req, res) => {
  const filePath = findStoredLogoPath();
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'No logo uploaded' });
  }
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.sendFile(path.resolve(filePath));
});

/** Admin: current resolved branding + raw DB overrides + env layer. */
router.get(
  '/admin',
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
  requireAdmin,
  async (_req, res) => {
    try {
      const db = await loadDbBranding();
      const resolved = resolveBranding(db);
      res.json({
        branding: publicBrandingPayload(resolved),
        overrides: db,
        env: resolved.source.env,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load branding' });
    }
  },
);

/** Admin: merge partial overrides into DB settings. */
router.put(
  '/',
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
  requireAdmin,
  async (req, res) => {
    try {
      const patch = sanitizeBrandingPatch(req.body || {});
      const current = await loadDbBranding();
      const next = { ...current, ...patch };
      // Drop null keys so resolve falls back to env/defaults
      for (const [k, v] of Object.entries(next)) {
        if (v === null) delete next[k];
      }
      await saveDbBranding(next);
      const resolved = resolveBranding(next);
      res.json({
        branding: publicBrandingPayload(resolved),
        overrides: next,
      });
    } catch (err) {
      const status = err.status || 400;
      res.status(status).json({ error: err.message || 'Invalid branding' });
    }
  },
);

/** Admin: reset DB overrides (env/defaults apply again). */
router.delete(
  '/',
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
  requireAdmin,
  async (_req, res) => {
    try {
      await query(`DELETE FROM app_settings WHERE key = $1`, [BRANDING_KEY]);
      clearStoredLogoFiles();
      const resolved = resolveBranding({});
      res.json({ branding: publicBrandingPayload(resolved), overrides: {} });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to reset branding' });
    }
  },
);

/** Admin: upload logo file → stored under uploads/branding, logoUrl set. */
router.post(
  '/logo',
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
  requireAdmin,
  (req, res) => {
    upload.single('logo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || 'Upload failed' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'logo file required' });
      }
      try {
        // Remove other extensions left from a previous upload
        const dir = ensureBrandingUploadDir();
        for (const f of fs.readdirSync(dir)) {
          if (f.startsWith('logo.') && f !== req.file.filename) {
            fs.unlinkSync(path.join(dir, f));
          }
        }
        const logoUrl = '/api/branding/logo';
        const current = await loadDbBranding();
        const next = { ...current, logoUrl };
        await saveDbBranding(next);
        const resolved = resolveBranding(next);
        return res.json({
          branding: publicBrandingPayload(resolved),
          overrides: next,
        });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Failed to save logo' });
      }
    });
  },
);

/** Admin: clear uploaded/custom logo (falls back to env or default mark). */
router.delete(
  '/logo',
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
  requireAdmin,
  async (_req, res) => {
    try {
      clearStoredLogoFiles();
      const current = await loadDbBranding();
      const next = { ...current };
      delete next.logoUrl;
      await saveDbBranding(next);
      const resolved = resolveBranding(next);
      res.json({
        branding: publicBrandingPayload(resolved),
        overrides: next,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove logo' });
    }
  },
);

export default router;
