import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import {
  signToken,
  signMfaPendingToken,
  verifyMfaPendingToken,
  requireAuth,
  loadUser,
  publicUser,
} from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { setSessionCookie, clearSessionCookie } from '../middleware/cookies.js';
import {
  encryptSecret,
  decryptSecret,
  generateTotpSecret,
  verifyTotpCode,
  otpauthQrDataUrl,
  generateBackupCodes,
  consumeBackupCode,
  mfaPendingTtlSec,
  mfaRequiredGlobally,
} from '../services/mfa.js';

const router = Router();

async function issueSession(res, req, user) {
  const token = signToken(user);
  setSessionCookie(res, req, token);
  return res.json({ user: publicUser(user) });
}

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { rows } = await query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
    [email],
  );
  const user = rows[0];
  if (!user || !user.account_active) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.mfa_enabled && user.mfa_secret_enc) {
    const mfaToken = signMfaPendingToken(user, mfaPendingTtlSec());
    return res.json({
      mfaRequired: true,
      mfaToken,
      user: { id: user.id, email: user.email, mfaEnabled: true },
    });
  }

  if (mfaRequiredGlobally() && !user.mfa_enabled) {
    // Password OK but agency requires MFA — issue session so officer can enroll,
    // and flag the client that enrollment is mandatory.
    const token = signToken(user);
    setSessionCookie(res, req, token);
    return res.json({
      user: publicUser(user),
      mfaEnrollmentRequired: true,
    });
  }

  return issueSession(res, req, user);
});

router.post('/mfa/verify', loginLimiter, async (req, res) => {
  const { mfaToken, code } = req.body || {};
  if (!mfaToken || !code) {
    return res.status(400).json({ error: 'MFA token and code required' });
  }

  let pending;
  try {
    pending = verifyMfaPendingToken(mfaToken);
  } catch {
    return res.status(401).json({ error: 'MFA challenge expired or invalid' });
  }

  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [pending.sub]);
  const user = rows[0];
  if (!user || !user.account_active || !user.mfa_enabled || !user.mfa_secret_enc) {
    return res.status(401).json({ error: 'MFA challenge expired or invalid' });
  }

  let secret;
  try {
    secret = decryptSecret(user.mfa_secret_enc);
  } catch {
    return res.status(500).json({ error: 'MFA configuration error' });
  }

  if (verifyTotpCode(secret, code)) {
    await query(`INSERT INTO activity_logs (user_id, action) VALUES ($1, 'mfaLogin')`, [
      user.id,
    ]);
    return issueSession(res, req, user);
  }

  // Fallback: one-time backup code
  const consumed = await consumeBackupCode(user.mfa_backup_hashes, code);
  if (consumed.ok) {
    await query(
      `UPDATE users SET mfa_backup_hashes = $1::jsonb, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(consumed.remaining), user.id],
    );
    await query(
      `INSERT INTO activity_logs (user_id, action) VALUES ($1, 'mfaBackupLogin')`,
      [user.id],
    );
    return issueSession(res, req, user);
  }

  return res.status(401).json({ error: 'Invalid authentication code' });
});

router.get('/mfa/status', requireAuth, loadUser, async (req, res) => {
  res.json({
    mfaEnabled: Boolean(req.dbUser.mfa_enabled),
    mfaRequired: mfaRequiredGlobally(),
    backupCodesRemaining: undefined,
  });
});

/** Start enrollment: returns secret + QR; stores encrypted secret but leaves mfa_enabled false until confirm. */
router.post('/mfa/setup', requireAuth, loadUser, async (req, res) => {
  if (req.dbUser.mfa_enabled) {
    return res.status(400).json({ error: 'MFA is already enabled' });
  }

  const secret = generateTotpSecret();
  const enc = encryptSecret(secret);
  await query(
    `UPDATE users SET mfa_secret_enc = $1, mfa_backup_hashes = '[]'::jsonb, updated_at = NOW()
     WHERE id = $2`,
    [enc, req.user.sub],
  );

  const { uri, dataUrl } = await otpauthQrDataUrl(secret, req.dbUser.email);
  return res.json({
    secret,
    otpauthUrl: uri,
    qrDataUrl: dataUrl,
    issuer: process.env.MFA_ISSUER || 'Crime Tips',
  });
});

/** Confirm enrollment with first TOTP code; returns backup codes once. */
router.post('/mfa/confirm', requireAuth, loadUser, async (req, res) => {
  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Authentication code required' });
  }

  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  if (!user?.mfa_secret_enc) {
    return res.status(400).json({ error: 'Call MFA setup first' });
  }
  if (user.mfa_enabled) {
    return res.status(400).json({ error: 'MFA is already enabled' });
  }

  let secret;
  try {
    secret = decryptSecret(user.mfa_secret_enc);
  } catch {
    return res.status(500).json({ error: 'MFA configuration error' });
  }

  if (!verifyTotpCode(secret, code)) {
    return res.status(400).json({ error: 'Invalid authentication code' });
  }

  const { plain, hashes } = await generateBackupCodes(8);
  await query(
    `UPDATE users SET mfa_enabled = TRUE, mfa_backup_hashes = $1::jsonb, updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify(hashes), user.id],
  );
  await query(`INSERT INTO activity_logs (user_id, action) VALUES ($1, 'mfaEnable')`, [
    user.id,
  ]);

  return res.json({
    ok: true,
    user: publicUser({ ...user, mfa_enabled: true }),
    backupCodes: plain,
  });
});

/** Disable MFA (self): require current password + TOTP (or backup code). */
router.post('/mfa/disable', requireAuth, loadUser, async (req, res) => {
  if (mfaRequiredGlobally()) {
    return res.status(403).json({
      error: 'MFA is required by this deployment (MFA_REQUIRED=true) and cannot be disabled',
    });
  }

  const { password, code } = req.body || {};
  if (!password || !code) {
    return res.status(400).json({ error: 'Password and authentication code required' });
  }

  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [req.user.sub]);
  const user = rows[0];
  if (!user?.mfa_enabled) {
    return res.status(400).json({ error: 'MFA is not enabled' });
  }

  const pwOk = await bcrypt.compare(password, user.password_hash);
  if (!pwOk) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  let secret;
  try {
    secret = decryptSecret(user.mfa_secret_enc);
  } catch {
    return res.status(500).json({ error: 'MFA configuration error' });
  }

  let ok = verifyTotpCode(secret, code);
  if (!ok) {
    const consumed = await consumeBackupCode(user.mfa_backup_hashes, code);
    ok = consumed.ok;
  }
  if (!ok) {
    return res.status(401).json({ error: 'Invalid authentication code' });
  }

  await query(
    `UPDATE users SET mfa_enabled = FALSE, mfa_secret_enc = NULL,
       mfa_backup_hashes = '[]'::jsonb, updated_at = NOW()
     WHERE id = $1`,
    [user.id],
  );
  await query(`INSERT INTO activity_logs (user_id, action) VALUES ($1, 'mfaDisable')`, [
    user.id,
  ]);

  return res.json({ ok: true, user: publicUser({ ...user, mfa_enabled: false }) });
});

/** Admin: clear MFA for another officer (lost authenticator). */
router.post('/mfa/admin-reset/:userId', requireAuth, loadUser, async (req, res) => {
  if (!req.dbUser.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const targetId = req.params.userId;
  const { rows } = await query(`SELECT id, email FROM users WHERE id = $1`, [targetId]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });

  await query(
    `UPDATE users SET mfa_enabled = FALSE, mfa_secret_enc = NULL,
       mfa_backup_hashes = '[]'::jsonb, updated_at = NOW()
     WHERE id = $1`,
    [targetId],
  );
  await query(
    `INSERT INTO activity_logs (user_id, action) VALUES ($1, 'mfaAdminReset')`,
    [req.user.sub],
  );

  return res.json({ ok: true });
});

router.get('/me', requireAuth, loadUser, (req, res) => {
  res.json({
    user: publicUser(req.dbUser),
    mfaRequired: mfaRequiredGlobally(),
  });
});

router.post('/logout', (req, res) => {
  clearSessionCookie(res, req);
  res.json({ ok: true });
});

export default router;
