import { Router } from 'express';
import { query } from '../db.js';
import {
  requireAuth,
  loadUser,
  requireAdmin,
  requireMfaIfEnforced,
} from '../middleware/auth.js';
import { actionLabel, activityToJson } from '../services/activityLog.js';

const router = Router();
const officerAuth = [requireAuth, loadUser, requireMfaIfEnforced];

function parsePaging(req) {
  const rawLimit = Number(req.query.limit);
  const rawOffset = Number(req.query.offset);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 500)
    : 50;
  const offset = Number.isFinite(rawOffset) ? Math.max(Math.floor(rawOffset), 0) : 0;
  return { limit, offset };
}

function buildAuditWhere(req) {
  const clauses = [];
  const params = [];

  if (req.query.userId) {
    params.push(String(req.query.userId));
    clauses.push(`a.user_id = $${params.length}`);
  }
  if (req.query.tipId) {
    params.push(String(req.query.tipId));
    clauses.push(`a.tip_id = $${params.length}`);
  }
  if (req.query.action) {
    params.push(String(req.query.action).slice(0, 120));
    clauses.push(`a.action = $${params.length}`);
  }
  if (req.query.from) {
    const from = new Date(req.query.from);
    if (!Number.isNaN(from.getTime())) {
      params.push(from.toISOString());
      clauses.push(`a.created_at >= $${params.length}`);
    }
  }
  if (req.query.to) {
    const to = new Date(req.query.to);
    if (!Number.isNaN(to.getTime())) {
      params.push(to.toISOString());
      clauses.push(`a.created_at <= $${params.length}`);
    }
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return { where, params };
}

/** Admin: filterable activity feed (no tip body). */
router.get('/', ...officerAuth, requireAdmin, async (req, res) => {
  const { limit, offset } = parsePaging(req);
  const { where, params } = buildAuditWhere(req);

  const countRes = await query(
    `SELECT COUNT(*)::int AS count FROM activity_logs a ${where}`,
    params,
  );

  const listParams = [...params, limit, offset];
  const { rows } = await query(
    `SELECT a.id, a.user_id, a.tip_id, a.action, a.status, a.created_at,
            u.email, u.rank, u.first_name, u.last_name
     FROM activity_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ${where}
     ORDER BY a.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    listParams,
  );

  const activities = rows.map((row) =>
    activityToJson(row, {
      user: row.user_id
        ? {
            id: row.user_id,
            email: row.email,
            rank: row.rank,
            first_name: row.first_name,
            last_name: row.last_name,
          }
        : null,
    }),
  );

  return res.json({
    activities,
    total: countRes.rows[0].count,
    limit,
    offset,
    labels: Object.fromEntries(
      [...new Set(rows.map((r) => r.action))].map((a) => [a, actionLabel(a)]),
    ),
  });
});

/** Admin: CSV/JSON export for SIEM handoff (metadata only). */
router.get('/export', ...officerAuth, requireAdmin, async (req, res) => {
  const format = String(req.query.format || 'json').toLowerCase();
  const { where, params } = buildAuditWhere(req);
  const rawLimit = Number(req.query.limit);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 10000)
    : 5000;

  const { rows } = await query(
    `SELECT a.id, a.user_id, a.tip_id, a.action, a.status, a.created_at,
            u.email
     FROM activity_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ${where}
     ORDER BY a.created_at DESC
     LIMIT $${params.length + 1}`,
    [...params, limit],
  );

  if (format === 'csv') {
    const header = ['id', 'created_at', 'action', 'status', 'user_id', 'email', 'tip_id'];
    const escape = (v) => {
      const s = v == null ? '' : String(v);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [header.join(',')];
    for (const row of rows) {
      lines.push(
        [
          row.id,
          row.created_at?.toISOString?.() || row.created_at,
          row.action,
          row.status,
          row.user_id,
          row.email,
          row.tip_id,
        ]
          .map(escape)
          .join(','),
      );
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-export.csv"');
    return res.send(lines.join('\n'));
  }

  return res.json({
    exportedAt: new Date().toISOString(),
    count: rows.length,
    activities: rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      action: row.action,
      actionLabel: actionLabel(row.action),
      status: row.status,
      userId: row.user_id,
      email: row.email || null,
      tipId: row.tip_id,
    })),
  });
});

export default router;
