const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'crime_tips_session';

function isProduction() {
  return (
    process.env.CRIME_TIPS_ENV === 'production' ||
    process.env.NODE_ENV === 'production'
  );
}

/** Secure cookies when HTTPS / prod, or COOKIE_SECURE=true. Override with COOKIE_SECURE=false. */
export function cookieSecure(req) {
  const forced = (process.env.COOKIE_SECURE || '').toLowerCase();
  if (forced === 'true' || forced === '1') return true;
  if (forced === 'false' || forced === '0') return false;
  if (isProduction()) return true;
  if (req?.secure) return true;
  const proto = (req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  return proto === 'https';
}

export function sameSiteMode() {
  const raw = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
  if (raw === 'none' || raw === 'strict' || raw === 'lax') return raw;
  return 'lax';
}

export function sessionCookieOptions(req) {
  const secure = cookieSecure(req);
  let sameSite = sameSiteMode();
  // SameSite=None requires Secure
  if (sameSite === 'none' && !secure) {
    sameSite = 'lax';
  }
  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: cookieMaxAgeMs(),
  };
}

export function cookieMaxAgeMs() {
  const expires = process.env.JWT_EXPIRES_IN || '12h';
  const match = /^(\d+)([smhd])$/i.exec(String(expires).trim());
  if (!match) return 12 * 60 * 60 * 1000;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  const mult = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] || 3_600_000;
  return n * mult;
}

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function setSessionCookie(res, req, token) {
  res.cookie(COOKIE_NAME, token, sessionCookieOptions(req));
}

export function clearSessionCookie(res, req) {
  const opts = sessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: '/',
  });
}

export function readSessionToken(req) {
  const fromCookie = req.cookies?.[COOKIE_NAME];
  if (fromCookie) return fromCookie;
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}
