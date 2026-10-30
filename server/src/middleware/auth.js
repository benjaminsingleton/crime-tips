import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { resolveJwtSecret } from '../security/secrets.js';
import { readSessionToken } from './cookies.js';

const JWT_SECRET = () => resolveJwtSecret();

/**
 * @param {object} user
 * @param {{ authMethod?: 'password' | 'oidc' }} [options]
 *   authMethod is recorded for step-up reauth (SSO sessions can confirm without a local password).
 */
export function signToken(user, options = {}) {
  const authMethod = options.authMethod === 'oidc' ? 'oidc' : 'password';
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      admin: user.admin,
      auth: authMethod,
    },
    JWT_SECRET(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' },
  );
}

/** Short-lived token after password OK, before TOTP verify. */
export function signMfaPendingToken(user, ttlSec) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      purpose: 'mfa',
    },
    JWT_SECRET(),
    { expiresIn: ttlSec || 300 },
  );
}

export function verifyMfaPendingToken(token) {
  const payload = jwt.verify(token, JWT_SECRET());
  if (payload.purpose !== 'mfa' || !payload.sub) {
    throw new Error('Invalid MFA pending token');
  }
  return payload;
}

export function requireAuth(req, res, next) {
  const token = readSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET());
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Admin gate uses DB role after loadUser — not the JWT `admin` claim (M2). */
export function requireAdmin(req, res, next) {
  if (!req.dbUser?.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return next();
}

/**
 * When MFA_REQUIRED=true, block authenticated API use until the officer enrolls TOTP.
 * Allow /api/auth/* so setup/confirm/logout/me still work.
 */
export function requireMfaIfEnforced(req, res, next) {
  const v = (process.env.MFA_REQUIRED || '').toLowerCase();
  const enforced = v === 'true' || v === '1' || v === 'yes';
  if (!enforced) return next();
  if (!req.dbUser) return next();
  if (req.dbUser.mfa_enabled) return next();
  return res.status(403).json({
    error: 'Multi-factor authentication enrollment required',
    mfaEnrollmentRequired: true,
  });
}

export async function loadUser(req, res, next) {
  if (!req.user?.sub) return next();
  const { rows } = await query(
    `SELECT id, email, rank, first_name, last_name, admin, notifications, account_active,
            mfa_enabled, oidc_sub
     FROM users WHERE id = $1`,
    [req.user.sub],
  );
  if (!rows[0] || !rows[0].account_active) {
    return res.status(401).json({ error: 'Account inactive or not found' });
  }
  req.dbUser = rows[0];
  return next();
}

export function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    rank: row.rank,
    firstName: row.first_name,
    lastName: row.last_name,
    admin: row.admin,
    notifications: row.notifications,
    accountActive: row.account_active,
    mfaEnabled: Boolean(row.mfa_enabled),
    oidcLinked: Boolean(row.oidc_sub),
  };
}
