/** Allowed MIME types for tipster attachments (Phase 1 allowlist). */
export const ALLOWED_ATTACHMENT_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'application/pdf',
  'text/plain',
]);

export function maxAttachmentsPerTip() {
  const n = Number(process.env.MAX_ATTACHMENTS_PER_TIP || 10);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 10;
}

export function isAllowedAttachmentMime(mime) {
  if (!mime || typeof mime !== 'string') return false;
  const normalized = mime.split(';')[0].trim().toLowerCase();
  return ALLOWED_ATTACHMENT_MIMES.has(normalized);
}
