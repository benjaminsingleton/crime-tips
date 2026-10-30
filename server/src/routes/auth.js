import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../db.js';
import {
  signToken,
  signMfaPendingToken,
  verifyMfaPendingToken,
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
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
import {
  oidcConfigured,
  oidcAllowPassword,
  oidcAutoProvision,
  oidcRequireEmailVerified,
  publicOidcStatus,
  buildOidcAuthorization,
  exchangeOidcCallback,
  signOidcPending,
  verifyOidcPending,
  oidcPendingCookieName,
  setOidcPendingCookie,
  clearOidcPendingCookie,
  callbackUrlFromRequest,
  extractOidcIdentity,
} from '../services/oidc.js';

const router = Router();

async function issueSession(res, req, user, options = {}) {
  const token = signToken(user, options);
  setSessionCookie(res, req, token);
  return res.json({ user: publicUser(user) });
}

function loginRedirectBase(req) {
  const origin = (process.env.PUBLIC_ORIGIN || '')
    .split(',')[0]
    .trim()
    .replace(/\/$/, '');
  if (origin) return origin;
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http')
    .toString()
    .split(',')[0]
    .trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || 'localhost')
    .toString()
    .split(',')[0]
    .trim();
  return `${proto}://${host}`;
}

function redirectOidcError(res, req, message) {
  const url = new URL('/login', loginRedirectBase(req));
  url.searchParams.set('oidc_error', message);
  return res.redirect(url.toString());
}

/**
 * Resolve local officer from IdP claims: oidc_sub → email → optional auto-provision.
 * SSO does not prompt for local TOTP (IdP is the second factor); MFA_REQUIRED still
 * forces enrollment for defense-in-depth on password login paths.
 */
async function resolveOidcUser(identity) {
  const { sub, email, emailVerified, firstName, lastName } = identity;
  if (!sub) {
    return { error: 'Identity provider did not return a subject' };
  }

  let { rows } = await query(`SELECT * FROM users WHERE oidc_sub = $1`, [sub]);
  if (rows[0]) {
    if (!rows[0].account_active) {
      return { error: 'Account is inactive' };
    }
    return { user: rows[0] };
  }

  // Email link / auto-provision require a verified email claim (H4).
  // Prefer oidc_sub-only after the first successful link.
  if (email && oidcRequireEmailVerified() && !emailVerified) {
    return {
      error:
        'Identity provider email is not verified. Ask your IdP admin to assert email_verified, or link the account by SSO subject after an admin creates it.',
    };
  }

  if (email) {
    ({ rows } = await query(`SELECT * FROM users WHERE LOWER(email) = LOWER($1)`, [
      email,
    ]));
    if (rows[0]) {
      if (!rows[0].account_active) {
        return { error: 'Account is inactive' };
      }
      const linked = await query(
        `UPDATE users SET oidc_sub = $1, updated_at = NOW() WHERE id = $2
         RETURNING *`,
        [sub, rows[0].id],
      );
      return { user: linked.rows[0] };
    }
  }

  if (!oidcAutoProvision()) {
    return {
      error:
        'No Crime Tips account matches this SSO identity. Ask an admin to create your officer account (same email), or enable OIDC_AUTO_PROVISION.',
    };
  }

  if (!email) {
    return { error: 'Identity provider did not return an email claim required for provisioning' };
  }

  const randomPassword = crypto.randomBytes(32).toString('base64url');
  const hash = await bcrypt.hash(randomPassword, 12);
  const created = await query(
    `INSERT INTO users (email, password_hash, rank, first_name, last_name, admin, notifications, account_active, oidc_sub)
     VALUES ($1, $2, $3, $4, $5, FALSE, TRUE, TRUE, $6)
     RETURNING *`,
    [
      email,
      hash,
      process.env.OIDC_DEFAULT_RANK || 'Officer',
      firstName || 'Officer',
      lastName || 'User',
      sub,
    ],
  );
  return { user: created.rows[0], provisioned: true };
}

/** Public: whether SSO button should show (no secrets). */
router.get('/oidc/status', (_req, res) => {
  res.json(publicOidcStatus());
});

/** Begin OIDC authorization code + PKCE flow. */
router.get('/oidc/start', loginLimiter, async (req, res) => {
  if (!oidcConfigured()) {
    return res.status(404).json({ error: 'OIDC SSO is not enabled' });
  }
  try {
    const { redirectTo, pending } = await buildOidcAuthorization();
    const token = signOidcPending(pending);
    setOidcPendingCookie(res, req, token);
    return res.redirect(redirectTo);
  } catch (err) {
    console.error('OIDC start failed:', err.message);
    return redirectOidcError(
      res,
      req,
      'Could not start agency SSO. Check OIDC configuration.',
    );
  }
});

/** OIDC redirect_uri callback — exchange code, set session cookie, go to dashboard. */
router.get('/oidc/callback', loginLimiter, async (req, res) => {
  if (!oidcConfigured()) {
    return redirectOidcError(res, req, 'OIDC SSO is not enabled');
  }

  if (req.query.error) {
    clearOidcPendingCookie(res, req);
    const desc =
      typeof req.query.error_description === 'string'
        ? req.query.error_description
        : String(req.query.error);
    return redirectOidcError(res, req, desc);
  }

  const pendingToken = req.cookies?.[oidcPendingCookieName()];
  if (!pendingToken) {
    return redirectOidcError(res, req, 'SSO session expired. Try again.');
  }

  let pending;
  try {
    pending = verifyOidcPending(pendingToken);
  } catch {
    clearOidcPendingCookie(res, req);
    return redirectOidcError(res, req, 'SSO session expired. Try again.');
  }

  try {
    const currentUrl = callbackUrlFromRequest(req);
    const { claims } = await exchangeOidcCallback(currentUrl, pending);
    clearOidcPendingCookie(res, req);

    const identity = extractOidcIdentity(claims);
    const resolved = await resolveOidcUser(identity);
    if (resolved.error) {
      return redirectOidcError(res, req, resolved.error);
    }

    const user = resolved.user;
    const sessionJwt = signToken(user, { authMethod: 'oidc' });
    setSessionCookie(res, req, sessionJwt);

    await query(`INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)`, [
      user.id,
      resolved.provisioned ? 'oidcProvisionLogin' : 'oidcLogin',
    ]);

    const dest = new URL('/dashboard', loginRedirectBase(req));
    if (mfaRequiredGlobally() && !user.mfa_enabled) {
      dest.pathname = '/settings';
      dest.searchParams.set('mfa_enroll', '1');
    }
    return res.redirect(dest.toString());
  } catch (err) {
    console.error('OIDC callback failed:', err.message);
    clearOidcPendingCookie(res, req);
    return redirectOidcError(
      res,
      req,
      'Agency SSO sign-in failed. Try again or use email and password.',
    );
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  if (!oidcAllowPassword() && oidcConfigured()) {
    return res.status(403).json({
      error: 'Password login is disabled. Use agency SSO.',
      oidcRequired: true,
    });
  }

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
    const token = signToken(user, { authMethod: 'password' });
    setSessionCookie(res, req, token);
    return res.json({
      user: publicUser(user),
      mfaEnrollmentRequired: true,
    });
  }

  return issueSession(res, req, user, { authMethod: 'password' });
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
    return issueSession(res, req, user, { authMethod: 'password' });
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
    return issueSession(res, req, user, { authMethod: 'password' });
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
router.post(
  '/mfa/admin-reset/:userId',
  requireAuth,
  loadUser,
  requireMfaIfEnforced,
  async (req, res) => {
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
  },
);

router.get('/me', requireAuth, loadUser, (req, res) => {
  res.json({
    user: publicUser(req.dbUser),
    mfaRequired: mfaRequiredGlobally(),
    oidc: publicOidcStatus(),
  });
});

router.post('/logout', (req, res) => {
  clearSessionCookie(res, req);
  res.json({ ok: true });
});

export default router;
