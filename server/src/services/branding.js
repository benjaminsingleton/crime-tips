import fs from 'fs';
import path from 'path';

export const BRANDING_KEY = 'branding';

export const BRANDING_DEFAULTS = {
  name: 'Gotham Crime Tips',
  tagline: 'Police tip line',
  logoUrl: null,
  primaryColor: '#102033',
  accentColor: '#b8974a',
};

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(value) {
  return typeof value === 'string' && HEX_RE.test(value.trim());
}

export function normalizeHex(value) {
  if (!isValidHexColor(value)) return null;
  let hex = value.trim().toLowerCase();
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

function trimOrNull(value) {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

/** Env provides deploy-time defaults (Compose / .env). Empty means unset. */
export function brandingFromEnv() {
  return {
    name: trimOrNull(process.env.BRAND_NAME || process.env.DEPARTMENT_NAME),
    tagline: trimOrNull(process.env.BRAND_TAGLINE),
    logoUrl: trimOrNull(process.env.BRAND_LOGO_URL),
    primaryColor: normalizeHex(process.env.BRAND_PRIMARY_COLOR || '') || null,
    accentColor: normalizeHex(process.env.BRAND_ACCENT_COLOR || '') || null,
  };
}

/**
 * Resolve public branding: code defaults ← env ← DB overrides.
 * DB fields that are null/undefined leave the previous layer in place.
 * Empty string in DB clears a field back toward env/defaults for text/url;
 * colors must be valid hex or are ignored.
 */
export function resolveBranding(dbValue = {}) {
  const env = brandingFromEnv();
  const db = dbValue && typeof dbValue === 'object' ? dbValue : {};

  const pickText = (key) => {
    if (Object.prototype.hasOwnProperty.call(db, key)) {
      const v = db[key];
      if (v === null || v === '') return env[key] || BRANDING_DEFAULTS[key];
      if (typeof v === 'string') return v.trim() || env[key] || BRANDING_DEFAULTS[key];
    }
    return env[key] || BRANDING_DEFAULTS[key];
  };

  const pickColor = (key) => {
    if (Object.prototype.hasOwnProperty.call(db, key)) {
      const normalized = normalizeHex(db[key] || '');
      if (normalized) return normalized;
      if (db[key] === null || db[key] === '') {
        return env[key] || BRANDING_DEFAULTS[key];
      }
    }
    return env[key] || BRANDING_DEFAULTS[key];
  };

  const pickLogo = () => {
    if (Object.prototype.hasOwnProperty.call(db, 'logoUrl')) {
      const v = db.logoUrl;
      if (v === null || v === '') return env.logoUrl || BRANDING_DEFAULTS.logoUrl;
      if (typeof v === 'string') return v.trim() || env.logoUrl || BRANDING_DEFAULTS.logoUrl;
    }
    return env.logoUrl || BRANDING_DEFAULTS.logoUrl;
  };

  return {
    name: pickText('name'),
    tagline: pickText('tagline'),
    logoUrl: pickLogo(),
    primaryColor: pickColor('primaryColor'),
    accentColor: pickColor('accentColor'),
    source: {
      env: Object.fromEntries(
        Object.entries(env).filter(([, v]) => v != null),
      ),
      hasDbOverrides: Object.keys(db).length > 0,
    },
  };
}

/** Sanitize admin PATCH body into a partial settings object. */
export function sanitizeBrandingPatch(body = {}) {
  const out = {};
  if (Object.prototype.hasOwnProperty.call(body, 'name')) {
    out.name = body.name == null ? null : String(body.name).trim().slice(0, 120);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'tagline')) {
    out.tagline = body.tagline == null ? null : String(body.tagline).trim().slice(0, 80);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'logoUrl')) {
    if (body.logoUrl == null || body.logoUrl === '') {
      out.logoUrl = null;
    } else {
      const url = String(body.logoUrl).trim().slice(0, 2048);
      // Allow same-origin paths and https URLs only (no javascript:).
      if (url.startsWith('/') || /^https:\/\//i.test(url)) {
        out.logoUrl = url;
      } else {
        const err = new Error('logoUrl must be a same-origin path or https URL');
        err.status = 400;
        throw err;
      }
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'primaryColor')) {
    if (body.primaryColor == null || body.primaryColor === '') {
      out.primaryColor = null;
    } else {
      const c = normalizeHex(body.primaryColor);
      if (!c) {
        const err = new Error('primaryColor must be a hex color like #102033');
        err.status = 400;
        throw err;
      }
      out.primaryColor = c;
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'accentColor')) {
    if (body.accentColor == null || body.accentColor === '') {
      out.accentColor = null;
    } else {
      const c = normalizeHex(body.accentColor);
      if (!c) {
        const err = new Error('accentColor must be a hex color like #b8974a');
        err.status = 400;
        throw err;
      }
      out.accentColor = c;
    }
  }
  return out;
}

export function brandingUploadDir() {
  const root = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  return path.join(root, 'branding');
}

export function ensureBrandingUploadDir() {
  const dir = brandingUploadDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function findStoredLogoPath() {
  const dir = brandingUploadDir();
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.startsWith('logo.'));
  if (!files.length) return null;
  return path.join(dir, files[0]);
}

export function clearStoredLogoFiles() {
  const dir = brandingUploadDir();
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith('logo.')) {
      fs.unlinkSync(path.join(dir, f));
    }
  }
}

/** Public payload without internal source metadata (admin gets full). */
export function publicBrandingPayload(resolved) {
  return {
    name: resolved.name,
    tagline: resolved.tagline,
    logoUrl: resolved.logoUrl,
    primaryColor: resolved.primaryColor,
    accentColor: resolved.accentColor,
  };
}
