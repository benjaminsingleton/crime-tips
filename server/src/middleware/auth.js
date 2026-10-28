import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { resolveJwtSecret } from '../security/secrets.js';
import { readSessionToken } from './cookies.js';

const JWT_SECRET = () => resolveJwtSecret();

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      admin: user.admin,
    },
    JWT_SECRET(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' },
  );
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

export function requireAdmin(req, res, next) {
  if (!req.user?.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return next();
}

export async function loadUser(req, res, next) {
  if (!req.user?.sub) return next();
  const { rows } = await query(
    `SELECT id, email, rank, first_name, last_name, admin, notifications, account_active
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
  };
}
