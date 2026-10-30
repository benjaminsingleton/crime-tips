/**
 * Origin / Referer checks for cookie-authenticated mutating requests (M7).
 *
 * SameSite=Lax is the default CSRF baseline for same-origin Caddy deploys.
 * COOKIE_SAMESITE=none makes cross-site cookie sends practical — Origin checks
 * then become required. Bearer Authorization is not CSRF-relevant.
 */

import { sessionCookieName } from './cookies.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function envTruthy(name) {
  const v = (process.env[name] || '').toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

/** Origins explicitly allowed via PUBLIC_ORIGIN (comma-separated). */
export function configuredOrigins(env = process.env) {
  return (env.PUBLIC_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function requestHostOrigin(req) {
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '')
    .toString()
    .split(',')[0]
    .trim();
  if (!host) return null;
  const protoHeader = (req.headers['x-forwarded-proto'] || '')
    .toString()
    .split(',')[0]
    .trim();
  const proto =
    protoHeader ||
    (req.secure ? 'https' : null) ||
    (process.env.CRIME_TIPS_ENV === 'production' || process.env.NODE_ENV === 'production'
      ? 'https'
      : 'http');
  try {
    return new URL(`${proto}://${host}`).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(origin, req, env = process.env) {
  if (!origin) return false;
  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

  const allowed = configuredOrigins(env);
  if (allowed.includes(parsed.origin)) return true;

  const self = requestHostOrigin(req);
  if (self && parsed.origin === self) return true;

  return false;
}

function extractOriginCandidate(req) {
  const origin = (req.headers.origin || '').trim();
  if (origin && origin !== 'null') return origin;

  const referer = (req.headers.referer || req.headers.referrer || '').trim();
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function hasSessionCookie(req) {
  const name = sessionCookieName();
  return Boolean(req.cookies?.[name]);
}

/**
 * Express middleware: reject cross-site cookie mutations when Origin/Referer
 * is present and not allowed. When COOKIE_SAMESITE=none (or CSRF_STRICT=true),
 * missing Origin/Referer on cookie-auth mutations is also rejected.
 */
export function csrfOriginCheck(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  if (!hasSessionCookie(req)) return next();

  const candidate = extractOriginCandidate(req);
  const strict =
    envTruthy('CSRF_STRICT') ||
    (process.env.COOKIE_SAMESITE || 'lax').toLowerCase() === 'none';

  if (!candidate) {
    if (strict) {
      return res.status(403).json({
        error: 'Missing Origin for cookie-authenticated request',
      });
    }
    return next();
  }

  if (!isAllowedOrigin(candidate, req)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  return next();
}
