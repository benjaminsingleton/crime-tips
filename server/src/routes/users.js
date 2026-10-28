import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import {
  requireAuth,
  requireAdmin,
  loadUser,
  requireMfaIfEnforced,
  publicUser,
} from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, loadUser);

// Admin account ops require MFA when MFA_REQUIRED=true; self settings stay available for enroll.
router.get('/', requireMfaIfEnforced, requireAdmin, async (_req, res) => {
  const { rows } = await query(
    `SELECT id, email, rank, first_name, last_name, admin, notifications, account_active,
            mfa_enabled, created_at
     FROM users ORDER BY last_name, first_name`,
  );
  const users = {};
  for (const row of rows) {
    users[row.id] = publicUser(row);
  }
  res.json({ users });
});

router.post('/', requireMfaIfEnforced, requireAdmin, async (req, res) => {
  const {
    email,
    password,
    rank = '',
    firstName = '',
    lastName = '',
    admin = false,
  } = req.body || {};

  if (!email || !password || !rank || !firstName || !lastName) {
    return res.status(400).json({
      error:
        'None of the following fields can be blank: Rank, First Name, Last Name, Email and Password.',
    });
  }

  const existing = await query(`SELECT id FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
  if (existing.rows[0]) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, rank, first_name, last_name, admin, notifications, account_active)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE, TRUE)
     RETURNING id, email, rank, first_name, last_name, admin, notifications, account_active, mfa_enabled`,
    [email, hash, rank, firstName, lastName, Boolean(admin)],
  );

  return res.status(201).json({ user: publicUser(rows[0]) });
});

router.patch('/:id', async (req, res) => {
  const targetId = req.params.id;
  const isSelf = targetId === req.user.sub;
  if (!isSelf && !req.dbUser.admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [targetId]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });

  const body = req.body || {};
  const next = {
    rank: body.rank !== undefined ? body.rank : rows[0].rank,
    firstName: body.firstName !== undefined ? body.firstName : rows[0].first_name,
    lastName: body.lastName !== undefined ? body.lastName : rows[0].last_name,
    email: body.email !== undefined ? body.email : rows[0].email,
    notifications:
      body.notifications !== undefined ? Boolean(body.notifications) : rows[0].notifications,
    accountActive: rows[0].account_active,
    admin: rows[0].admin,
  };

  if (req.dbUser.admin) {
    if (body.accountActive !== undefined) next.accountActive = Boolean(body.accountActive);
    if (body.admin !== undefined) next.admin = Boolean(body.admin);
  } else {
    // non-admins may only change their own notifications/password (password has own route)
    // and optionally email via settings
    next.rank = rows[0].rank;
    next.firstName = rows[0].first_name;
    next.lastName = rows[0].last_name;
    if (body.email === undefined) next.email = rows[0].email;
  }

  try {
    const updated = await query(
      `UPDATE users SET
         rank = $1, first_name = $2, last_name = $3, email = $4,
         notifications = $5, account_active = $6, admin = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING id, email, rank, first_name, last_name, admin, notifications, account_active, mfa_enabled`,
      [
        next.rank,
        next.firstName,
        next.lastName,
        next.email,
        next.notifications,
        next.accountActive,
        next.admin,
        targetId,
      ],
    );

    if (body.email && body.email !== rows[0].email) {
      await query(
        `INSERT INTO activity_logs (user_id, action) VALUES ($1, 'changeEmail')`,
        [targetId],
      );
    }

    return res.json({ user: publicUser(updated.rows[0]) });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    throw err;
  }
});

router.post('/:id/password', async (req, res) => {
  const targetId = req.params.id;
  const isSelf = targetId === req.user.sub;
  if (!isSelf && !req.dbUser.admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { password } = req.body || {};
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const hash = await bcrypt.hash(password, 12);
  await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [
    hash,
    targetId,
  ]);
  await query(`INSERT INTO activity_logs (user_id, action) VALUES ($1, 'changePassword')`, [
    targetId,
  ]);
  return res.json({ ok: true });
});

router.get('/:id/activity', async (req, res) => {
  const targetId = req.params.id;
  if (targetId !== req.user.sub && !req.dbUser.admin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { rows } = await query(
    `SELECT id, tip_id, action, status, created_at
     FROM activity_logs WHERE user_id = $1
     ORDER BY created_at DESC LIMIT 20`,
    [targetId],
  );

  const activity = {};
  for (const row of rows) {
    activity[row.id] = {
      tip: row.tip_id,
      action: row.action,
      status: row.status,
      timestamp: Date.parse(row.created_at),
    };
  }
  return res.json({ activity });
});

export default router;
