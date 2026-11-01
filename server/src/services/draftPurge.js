import fs from 'fs';
import path from 'path';
import { query } from '../db.js';
import { logActivity } from './activityLog.js';

export const DRAFT_PURGE_SETTINGS_KEY = 'draft_purge_last';

export function draftRetentionDays() {
  const raw = process.env.DRAFT_RETENTION_DAYS;
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return 30; // default on; set 0 to disable
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 30;
  return Math.floor(n);
}

export function draftPurgeIntervalMs() {
  const hours = Number(process.env.DRAFT_PURGE_INTERVAL_HOURS || 24);
  if (!Number.isFinite(hours) || hours <= 0) return 24 * 60 * 60 * 1000;
  return Math.max(1, hours) * 60 * 60 * 1000;
}

function uploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}

function rmTipUploadDir(tipId) {
  const dir = path.join(uploadRoot(), tipId);
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

export async function loadDraftPurgeStatus() {
  const retentionDays = draftRetentionDays();
  const { rows } = await query(`SELECT value, updated_at FROM app_settings WHERE key = $1`, [
    DRAFT_PURGE_SETTINGS_KEY,
  ]);
  const value = rows[0]?.value || {};
  return {
    enabled: retentionDays > 0,
    retentionDays,
    intervalHours: draftPurgeIntervalMs() / (60 * 60 * 1000),
    lastRunAt: value.lastRunAt || null,
    lastDryRun: Boolean(value.lastDryRun),
    lastCandidateCount: Number(value.lastCandidateCount || 0),
    lastDeletedCount: Number(value.lastDeletedCount || 0),
    lastError: value.lastError || null,
    updatedAt: rows[0]?.updated_at || null,
  };
}

async function saveDraftPurgeStatus(value) {
  await query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [DRAFT_PURGE_SETTINGS_KEY, JSON.stringify(value)],
  );
}

/**
 * Find / purge unsubmitted tips older than retention.
 * Age uses updated_at (last tipster edit), falling back to created_at.
 */
export async function runDraftPurge({ dryRun = false, userId = null } = {}) {
  const retentionDays = draftRetentionDays();
  if (retentionDays <= 0) {
    const status = {
      lastRunAt: new Date().toISOString(),
      lastDryRun: Boolean(dryRun),
      lastCandidateCount: 0,
      lastDeletedCount: 0,
      lastError: null,
      skipped: true,
      reason: 'DRAFT_RETENTION_DAYS is 0 (disabled)',
      retentionDays,
    };
    await saveDraftPurgeStatus(status);
    return status;
  }

  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const candidates = await query(
    `SELECT t.id,
            (SELECT COUNT(*)::int FROM tip_attachments a WHERE a.tip_id = t.id) AS attachment_count
     FROM tips t
     WHERE t.submitted = FALSE
       AND COALESCE(t.updated_at, t.created_at) < $1
     ORDER BY COALESCE(t.updated_at, t.created_at) ASC`,
    [cutoff.toISOString()],
  );

  const ids = candidates.rows.map((r) => r.id);
  let deletedCount = 0;
  let error = null;

  if (!dryRun && ids.length > 0) {
    try {
      for (const id of ids) {
        rmTipUploadDir(id);
      }
      const del = await query(
        `DELETE FROM tips WHERE id = ANY($1::uuid[]) AND submitted = FALSE RETURNING id`,
        [ids],
      );
      deletedCount = del.rows.length;
      await logActivity({
        userId,
        action: 'draftPurge',
        status: true,
      });
    } catch (err) {
      console.error('draft purge failed', err);
      error = err.message || 'purge failed';
    }
  }

  const status = {
    lastRunAt: new Date().toISOString(),
    lastDryRun: Boolean(dryRun),
    lastCandidateCount: ids.length,
    lastDeletedCount: dryRun ? 0 : deletedCount,
    lastError: error,
    retentionDays,
    cutoff: cutoff.toISOString(),
    candidateIds: dryRun ? ids.slice(0, 50) : undefined,
  };
  await saveDraftPurgeStatus({
    lastRunAt: status.lastRunAt,
    lastDryRun: status.lastDryRun,
    lastCandidateCount: status.lastCandidateCount,
    lastDeletedCount: status.lastDeletedCount,
    lastError: status.lastError,
    retentionDays,
  });
  return status;
}

let purgeTimer = null;

export function startDraftPurgeScheduler() {
  const retentionDays = draftRetentionDays();
  if (retentionDays <= 0) {
    console.log('[draft-purge] disabled (DRAFT_RETENTION_DAYS=0)');
    return;
  }
  const interval = draftPurgeIntervalMs();
  console.log(
    `[draft-purge] enabled: retention=${retentionDays}d, interval=${interval / 3600000}h`,
  );

  const tick = () => {
    runDraftPurge({ dryRun: false }).then((result) => {
      if (result.lastCandidateCount > 0 || result.lastError) {
        console.log(
          `[draft-purge] candidates=${result.lastCandidateCount} deleted=${result.lastDeletedCount}` +
            (result.lastError ? ` error=${result.lastError}` : ''),
        );
      }
    }).catch((err) => console.error('[draft-purge] tick failed', err));
  };

  // First run shortly after boot so deploys enforce policy without waiting a full interval.
  setTimeout(tick, 15_000);
  purgeTimer = setInterval(tick, interval);
  if (typeof purgeTimer.unref === 'function') purgeTimer.unref();
}

export function stopDraftPurgeScheduler() {
  if (purgeTimer) {
    clearInterval(purgeTimer);
    purgeTimer = null;
  }
}
