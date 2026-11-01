import { query } from '../db.js';

const MAX_SEARCH_TEXT = 32000;

/** Flatten payload string/number leaves for officer search (no nested dumps). */
export function collectPayloadSearchParts(payload, out = []) {
  if (payload == null) return out;
  if (typeof payload === 'string' || typeof payload === 'number' || typeof payload === 'boolean') {
    const s = String(payload).trim();
    if (s) out.push(s);
    return out;
  }
  if (Array.isArray(payload)) {
    for (const item of payload) collectPayloadSearchParts(item, out);
    return out;
  }
  if (typeof payload === 'object') {
    for (const value of Object.values(payload)) {
      collectPayloadSearchParts(value, out);
    }
  }
  return out;
}

export function buildSearchText({ id, payload, filenames = [] }) {
  const parts = [String(id || '')];
  collectPayloadSearchParts(payload, parts);
  for (const name of filenames) {
    if (name) parts.push(String(name));
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim().slice(0, MAX_SEARCH_TEXT);
}

/**
 * Rebuild tips.search_text from payload + attachment filenames.
 * Pass touchUpdatedAt on attachment upload/delete so draft retention ages from
 * last file activity (do not use during boot backfill).
 */
export async function refreshTipSearchText(tipId, { touchUpdatedAt = false } = {}) {
  const tipRes = await query(`SELECT id, payload FROM tips WHERE id = $1`, [tipId]);
  if (!tipRes.rows[0]) return null;
  const att = await query(`SELECT filename FROM tip_attachments WHERE tip_id = $1`, [tipId]);
  const searchText = buildSearchText({
    id: tipRes.rows[0].id,
    payload: tipRes.rows[0].payload,
    filenames: att.rows.map((r) => r.filename),
  });
  if (touchUpdatedAt) {
    await query(`UPDATE tips SET search_text = $1, updated_at = NOW() WHERE id = $2`, [
      searchText,
      tipId,
    ]);
  } else {
    await query(`UPDATE tips SET search_text = $1 WHERE id = $2`, [searchText, tipId]);
  }
  return searchText;
}

export async function backfillTipSearchText({ limit = 500 } = {}) {
  let updated = 0;
  // Process in batches until none left with empty search_text and a payload/id.
  for (;;) {
    const { rows } = await query(
      `SELECT id FROM tips
       WHERE search_text IS NULL OR search_text = ''
       ORDER BY created_at
       LIMIT $1`,
      [limit],
    );
    if (rows.length === 0) break;
    for (const row of rows) {
      await refreshTipSearchText(row.id);
      updated += 1;
    }
    if (rows.length < limit) break;
  }
  return updated;
}

export function parseListPagination(queryParams = {}) {
  const rawLimit = Number(queryParams.limit);
  const rawOffset = Number(queryParams.offset);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 200)
    : 50;
  const offset = Number.isFinite(rawOffset) ? Math.max(Math.floor(rawOffset), 0) : 0;
  return { limit, offset };
}

/**
 * Normalize officer mailbox `q` for ILIKE with ESCAPE '\'.
 * Keeps underscores (filename matches); escapes \, %, _ as literals.
 */
export function normalizeSearchQuery(q) {
  if (q == null) return '';
  const s = String(q).trim().slice(0, 200);
  if (!s) return '';
  return s
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}
