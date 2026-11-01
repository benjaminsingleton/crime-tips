import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, loadUser, requireMfaIfEnforced } from '../middleware/auth.js';
import { loadDraftPurgeStatus } from '../services/draftPurge.js';

const router = Router();

router.get('/', requireAuth, loadUser, requireMfaIfEnforced, async (req, res) => {
  const unreadTips = await query(
    `SELECT COUNT(*)::int AS count FROM tips WHERE submitted = TRUE AND read = FALSE AND archived = FALSE`,
  );
  const unreadAbandoned = await query(
    `SELECT COUNT(*)::int AS count FROM tips WHERE submitted = FALSE`,
  );
  const last24 = await query(
    `SELECT COUNT(*)::int AS count FROM tips
     WHERE submitted = TRUE
       AND COALESCE(timestamp_submit, EXTRACT(EPOCH FROM created_at)*1000) >= $1`,
    [Date.now() - 24 * 60 * 60 * 1000],
  );
  const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
  const ytd = await query(
    `SELECT COUNT(*)::int AS count FROM tips
     WHERE submitted = TRUE
       AND COALESCE(timestamp_submit, EXTRACT(EPOCH FROM created_at)*1000) >= $1`,
    [yearStart],
  );

  const metrics = {
    unreadTips: unreadTips.rows[0].count,
    unreadAbandonedTips: unreadAbandoned.rows[0].count,
    tipsReceivedLast24Hours: last24.rows[0].count,
    tipsReceivedYTD: ytd.rows[0].count,
  };

  if (req.dbUser?.admin) {
    metrics.draftPurge = await loadDraftPurgeStatus();
  }

  res.json({ metrics });
});

export default router;
