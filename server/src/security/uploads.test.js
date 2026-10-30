import assert from 'node:assert/strict';
import { sniffAttachmentMime, resolveAttachmentMime, isAllowedAttachmentMime } from './uploads.js';

// Minimal JPEG (SOI + APP0-ish)
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
const pdf = Buffer.from('%PDF-1.4 mock');
const plain = Buffer.from('hello tip text');

assert.equal(sniffAttachmentMime(jpeg), 'image/jpeg');
assert.equal(sniffAttachmentMime(png), 'image/png');
assert.equal(sniffAttachmentMime(pdf), 'application/pdf');
assert.equal(sniffAttachmentMime(plain), null);

assert.equal(isAllowedAttachmentMime('text/plain'), false);

const ok = resolveAttachmentMime('image/jpeg', jpeg);
assert.equal(ok.ok, true);
assert.equal(ok.mime, 'image/jpeg');

const mismatch = resolveAttachmentMime('image/png', jpeg);
assert.equal(mismatch.ok, false);

const spoof = resolveAttachmentMime('image/jpeg', plain);
assert.equal(spoof.ok, false);

// iPhone .mov: ftyp + brand "qt  " — must accept as video/quicktime
const qtMov = Buffer.alloc(16, 0);
qtMov.writeUInt32BE(16, 0);
qtMov.write('ftyp', 4, 4, 'ascii');
qtMov.write('qt  ', 8, 4, 'ascii');
assert.equal(sniffAttachmentMime(qtMov), 'video/quicktime');
const qtOk = resolveAttachmentMime('video/quicktime', qtMov);
assert.equal(qtOk.ok, true);
assert.equal(qtOk.mime, 'video/quicktime');

// Declared quicktime with generic mp4 brand still compatible
const mp4Buf = Buffer.alloc(16, 0);
mp4Buf.writeUInt32BE(16, 0);
mp4Buf.write('ftyp', 4, 4, 'ascii');
mp4Buf.write('isom', 8, 4, 'ascii');
assert.equal(sniffAttachmentMime(mp4Buf), 'video/mp4');
const qtVsMp4 = resolveAttachmentMime('video/quicktime', mp4Buf);
assert.equal(qtVsMp4.ok, true);
assert.equal(qtVsMp4.mime, 'video/quicktime');

console.log('uploads.test.js: ok');
