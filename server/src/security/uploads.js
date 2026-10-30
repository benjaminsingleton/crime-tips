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

function bufStartsWith(buf, bytes) {
  if (!buf || buf.length < bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buf[i] !== bytes[i]) return false;
  }
  return true;
}

function asciiAt(buf, offset, str) {
  if (!buf || buf.length < offset + str.length) return false;
  for (let i = 0; i < str.length; i += 1) {
    if (buf[offset + i] !== str.charCodeAt(i)) return false;
  }
  return true;
}

/**
 * Sniff content type from magic bytes (M5). Returns a canonical MIME or null.
 * HEIC/HEIF are brand-based and optional; unknown buffers return null.
 */
export function sniffAttachmentMime(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return null;

  if (bufStartsWith(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (bufStartsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }
  if (asciiAt(buffer, 0, 'GIF87a') || asciiAt(buffer, 0, 'GIF89a')) return 'image/gif';
  if (asciiAt(buffer, 0, 'RIFF') && asciiAt(buffer, 8, 'WEBP')) return 'image/webp';
  if (asciiAt(buffer, 0, '%PDF')) return 'application/pdf';

  // ISO BMFF (mp4 / heic / heif / m4a): size(4) + 'ftyp' + brand
  if (buffer.length >= 12 && asciiAt(buffer, 4, 'ftyp')) {
    const brand = buffer.slice(8, 12).toString('ascii');
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) {
      return brand.startsWith('he') ? 'image/heic' : 'image/heif';
    }
    if (['isom', 'iso2', 'mp41', 'mp42', 'avc1', 'M4V ', 'M4A '].includes(brand)) {
      if (brand === 'M4A ') return 'audio/mp4';
      return 'video/mp4';
    }
    // Generic ftyp — treat as mp4 family when client claimed video/mp4
    return 'video/mp4';
  }

  // QuickTime often starts with ....ftypqt / wide / mdat — size + 'moov'/'mdat'/'free'/'wide'
  if (buffer.length >= 8) {
    const tag = buffer.slice(4, 8).toString('ascii');
    if (['moov', 'mdat', 'free', 'wide', 'pnot', 'skip'].includes(tag)) {
      return 'video/quicktime';
    }
  }

  // WebM / Matroska EBML
  if (bufStartsWith(buffer, [0x1a, 0x45, 0xdf, 0xa3])) return 'video/webm';

  // Ogg
  if (asciiAt(buffer, 0, 'OggS')) return 'audio/ogg';

  // WAV: RIFF....WAVE
  if (asciiAt(buffer, 0, 'RIFF') && asciiAt(buffer, 8, 'WAVE')) return 'audio/wav';

  // MP3: ID3 or frame sync
  if (asciiAt(buffer, 0, 'ID3')) return 'audio/mpeg';
  if (buffer.length >= 2 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
    return 'audio/mpeg';
  }

  return null;
}

/**
 * Client MIME must be allowlisted; sniffed type must match the same family
 * when sniffing succeeds. HEIC/HEIF/quicktime may not sniff on every file —
 * if sniff returns null, reject (do not trust client alone for known families
 * that we can detect). Unknown-only types that fail sniff are rejected.
 */
export function resolveAttachmentMime(clientMime, buffer) {
  const declared = (clientMime || '').split(';')[0].trim().toLowerCase();
  if (!isAllowedAttachmentMime(declared)) {
    return { ok: false, error: 'File type not allowed' };
  }

  const sniffed = sniffAttachmentMime(buffer);
  if (!sniffed) {
    return { ok: false, error: 'Unrecognized or disallowed file content' };
  }

  const compatible = mimeFamiliesMatch(declared, sniffed);
  if (!compatible) {
    return { ok: false, error: 'File content does not match declared type' };
  }

  // Prefer sniffed canonical type for storage.
  return { ok: true, mime: sniffed };
}

function mimeFamiliesMatch(declared, sniffed) {
  if (declared === sniffed) return true;
  const aliases = {
    'audio/x-wav': 'audio/wav',
    'audio/wav': 'audio/x-wav',
    'image/heif': 'image/heic',
    'image/heic': 'image/heif',
  };
  if (aliases[declared] === sniffed) return true;
  // mp4 container brands may sniff as video/mp4 vs audio/mp4
  if (
    (declared === 'video/mp4' || declared === 'audio/mp4') &&
    (sniffed === 'video/mp4' || sniffed === 'audio/mp4')
  ) {
    return true;
  }
  return false;
}

/** Raster logo magic-byte check (branding uploads). */
export function sniffLogoMime(buffer) {
  const mime = sniffAttachmentMime(buffer);
  if (mime && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mime)) {
    return mime;
  }
  return null;
}
