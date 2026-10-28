import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import { resolveJwtSecret } from '../security/secrets.js';

const ISSUER = process.env.MFA_ISSUER || 'Crime Tips';
const PENDING_TTL_SEC = Number(process.env.MFA_PENDING_TTL_SEC || 300);

function deriveKey() {
  return crypto.createHash('sha256').update(resolveJwtSecret()).digest();
}

/** Encrypt TOTP secret for at-rest storage (AES-256-GCM). */
export function encryptSecret(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', deriveKey(), iv);
  const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString('base64url')}:${tag.toString('base64url')}:${enc.toString('base64url')}`;
}

export function decryptSecret(payload) {
  if (!payload || typeof payload !== 'string') {
    throw new Error('Missing MFA secret');
  }
  const parts = payload.split(':');
  if (parts.length !== 4 || parts[0] !== 'v1') {
    throw new Error('Invalid MFA secret encoding');
  }
  const [, ivB64, tagB64, dataB64] = parts;
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    deriveKey(),
    Buffer.from(ivB64, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ]);
  return plain.toString('utf8');
}

export function generateTotpSecret() {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

export function buildTotp(secretBase32, labelEmail) {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: labelEmail || 'officer',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });
}

export function verifyTotpCode(secretBase32, token) {
  const code = String(token || '').replace(/\s+/g, '');
  if (!/^\d{6}$/.test(code)) return false;
  const totp = buildTotp(secretBase32);
  const delta = totp.validate({ token: code, window: 1 });
  return delta !== null;
}

export async function otpauthQrDataUrl(secretBase32, email) {
  const totp = buildTotp(secretBase32, email);
  const uri = totp.toString();
  const dataUrl = await QRCode.toDataURL(uri, { margin: 1, width: 200 });
  return { uri, dataUrl };
}

/** Generate one-time backup codes; returns { plain, hashes }. */
export async function generateBackupCodes(count = 8) {
  const plain = [];
  const hashes = [];
  for (let i = 0; i < count; i += 1) {
    const code = crypto.randomBytes(5).toString('hex'); // 10 hex chars
    plain.push(code);
    hashes.push(await bcrypt.hash(code, 10));
  }
  return { plain, hashes };
}

export async function consumeBackupCode(hashesJson, code) {
  const hashes = Array.isArray(hashesJson) ? hashesJson : [];
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return { ok: false, remaining: hashes };
  for (let i = 0; i < hashes.length; i += 1) {
    const match = await bcrypt.compare(normalized, hashes[i]);
    if (match) {
      const remaining = hashes.filter((_, idx) => idx !== i);
      return { ok: true, remaining };
    }
  }
  return { ok: false, remaining: hashes };
}

export function mfaPendingTtlSec() {
  return Number.isFinite(PENDING_TTL_SEC) && PENDING_TTL_SEC > 30
    ? PENDING_TTL_SEC
    : 300;
}

export function mfaRequiredGlobally() {
  const v = (process.env.MFA_REQUIRED || '').toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}
