import { Router } from 'express';
import {
  requireAuth,
  loadUser,
  requireAdmin,
  requireMfaIfEnforced,
} from '../middleware/auth.js';
import {
  loadDraftPurgeStatus,
  runDraftPurge,
  draftRetentionDays,
} from '../services/draftPurge.js';

const router = Router();
const adminAuth = [requireAuth, loadUser, requireMfaIfEnforced, requireAdmin];

/** Draft retention status (last run + config). */
router.get('/draft-purge', ...adminAuth, async (_req, res) => {
  const status = await loadDraftPurgeStatus();
  return res.json({ draftPurge: status });
});

/**
 * Run or dry-run abandoned-draft purge.
 * Body/query: dryRun=true (default true for safety on POST without body).
 */
router.post('/draft-purge', ...adminAuth, async (req, res) => {
  const raw =
    req.body?.dryRun !== undefined ? req.body.dryRun : req.query.dryRun;
  // Default dry-run unless explicitly false
  const dryRun = !(raw === false || raw === 'false' || raw === 0 || raw === '0');
  if (draftRetentionDays() <= 0 && !dryRun) {
    return res.status(400).json({
      error: 'Draft purge disabled (set DRAFT_RETENTION_DAYS > 0)',
    });
  }
  const result = await runDraftPurge({ dryRun, userId: req.user.sub });
  return res.json({ draftPurge: result });
});

export default router;
