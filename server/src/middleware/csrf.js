/**
 * Origin / Referer checks for cookie-authenticated mutating requests (M7).
 *
 * SameSite=Lax is the default CSRF baseline for same-origin Caddy deploys.
 * COOKIE_SAMESITE=none makes cross-site cookie sends practical — Origin checks
 * then become required. Bearer Authorization is not CSRF-relevant.
 *
 * Scheme / allowlist notes:
 * - Prefer X-Forwarded-Proto / req.secure; do not treat NODE_ENV=production alone
 *   as HTTPS (runtime image sets NODE_ENV=production while Compose may keep
 *   CRIME_TIPS_ENV=development on HTTP).
 * - Same Host:port as the request is allowed (scheme-flexible).
 * - When CRIME_TIPS_ENV is development, localhost / 127.0.0.1 origins are
 *   allowed (Vite :5173 → API :3000), matching CORS-style local fallbacks.
 */

import { sessionCookieName } from './cookies.js';
import { isProductionEnv } from '../security/secrets.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function envTruthy(name, env = process.env) {
  const v = (env[name] || '').toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

/**
 * Production gate for CSRF allowlist. Accepts an env bag for tests; when the
 * bag is process.env, delegates to isProductionEnv().
 */
export function csrfIsProduction(env = process.env) {
  if (env === process.env) return isProductionEnv();
  const mode = (env.CRIME_TIPS_ENV || '').trim().toLowerCase();
  if (mode === 'production') return true;
  if (mode === 'development' || mode === 'dev') return false;
  return env.NODE_ENV === 'production';
}

/** Origins explicitly allowed via PUBLIC_ORIGIN (comma-separated). */
export function configuredOrigins(env = process.env) {
  return (env.PUBLIC_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function requestHostHeader(req) {
  return (req.headers['x-forwarded-host'] || req.headers.host || '')
    .toString()
    .split(',')[0]
    .trim();
}

function forwardedProto(req) {
  return (req.headers['x-forwarded-proto'] || '')
    .toString()
    .split(',')[0]
    .trim()
    .toLowerCase();
}

/** Candidate schemes for reconstructing the public request origin. */
export function requestSchemes(req, env = process.env) {
  const schemes = new Set();
  const xf = forwardedProto(req);
  if (xf === 'http' || xf === 'https') {
    schemes.add(xf);
  } else if (req.secure) {
    schemes.add('https');
  } else if (csrfIsProduction(env)) {
    schemes.add('https');
  } else {
    schemes.add('http');
  }
  // Dev / non-prod: accept either scheme for the request Host (HTTP Compose
  // with NODE_ENV=production must not force https://localhost).
  if (!csrfIsProduction(env)) {
    schemes.add('http');
    schemes.add('https');
  }
  return [...schemes];
}

export function requestHostOrigins(req, env = process.env) {
  const host = requestHostHeader(req);
  if (!host) return [];
  const out = [];
  for (const scheme of requestSchemes(req, env)) {
    try {
      out.push(new URL(`${scheme}://${host}`).origin);
    } catch {
      /* ignore */
    }
  }
  return out;
}

function defaultPortForProtocol(protocol) {
  return protocol === 'https:' ? '443' : '80';
}

function originHostPort(url) {
  const port = url.port || defaultPortForProtocol(url.protocol);
  return `${url.hostname.toLowerCase()}:${port}`;
}

function hostHeaderHostPort(hostHeader, fallbackProtocol) {
  try {
    const u = new URL(`${fallbackProtocol}//${hostHeader}`);
    const port = u.port || defaultPortForProtocol(fallbackProtocol);
    return `${u.hostname.toLowerCase()}:${port}`;
  } catch {
    return null;
  }
}

export function isLocalDevOrigin(url) {
  const host = url.hostname.toLowerCase();
  if (host !== 'localhost' && host !== '127.0.0.1' && host !== '::1') {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
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

  const hostOrigins = requestHostOrigins(req, env);
  if (hostOrigins.includes(parsed.origin)) return true;

  // Same Host:port as this request (scheme-flexible) — covers HTTP deploys
  // where NODE_ENV=production would otherwise invent an https:// self origin.
  const host = requestHostHeader(req);
  if (host) {
    const hostKey = hostHeaderHostPort(host, parsed.protocol);
    if (hostKey && hostKey === originHostPort(parsed)) {
      return true;
    }
  }

  // Local Vite / tooling when not in CRIME_TIPS_ENV=production
  if (!csrfIsProduction(env) && isLocalDevOrigin(parsed)) {
    return true;
  }

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
