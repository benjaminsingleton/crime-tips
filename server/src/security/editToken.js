import crypto from 'crypto';

export function generateEditToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashEditToken(token) {
  return crypto.createHash('sha256').update(String(token), 'utf8').digest('hex');
}

export function extractEditToken(req) {
  const header = req.headers['x-tip-edit-token'];
  if (header && typeof header === 'string' && header.trim()) {
    return header.trim();
  }
  if (req.query?.editToken && typeof req.query.editToken === 'string') {
    return req.query.editToken.trim();
  }
  if (req.body?.editToken && typeof req.body.editToken === 'string') {
    return req.body.editToken.trim();
  }
  return null;
}

export function verifyEditToken(provided, storedHash) {
  if (!provided || !storedHash) return false;
  const hashed = hashEditToken(provided);
  const a = Buffer.from(hashed, 'utf8');
  const b = Buffer.from(String(storedHash), 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
