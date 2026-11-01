import { query } from '../db.js';

/**
 * Append an activity_logs row. Never store tip body / PII payloads here —
 * action names and boolean status only.
 */
export async function logActivity({ userId = null, tipId = null, action, status = null }) {
  if (!action || typeof action !== 'string') return null;
  const { rows } = await query(
    `INSERT INTO activity_logs (user_id, tip_id, action, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, tip_id, action, status, created_at`,
    [userId, tipId, action.slice(0, 120), typeof status === 'boolean' ? status : null],
  );
  return rows[0] || null;
}

export function activityToJson(row, { user } = {}) {
  if (!row) return null;
  const out = {
    id: row.id,
    tipId: row.tip_id || null,
    userId: row.user_id || null,
    action: row.action,
    status: row.status,
    timestamp: Date.parse(row.created_at),
    createdAt: row.created_at,
  };
  if (user) {
    out.user = {
      id: user.id,
      email: user.email,
      rank: user.rank,
      firstName: user.first_name,
      lastName: user.last_name,
      displayName: `${user.rank || ''} ${user.first_name || ''} ${user.last_name || ''}`.trim(),
    };
  }
  return out;
}

/** Human labels for officer-facing timelines (keep opaque keys in DB). */
export const ACTION_LABELS = {
  read: 'Marked read / unread',
  archived: 'Archived / unarchived',
  important: 'Marked important',
  tipOpen: 'Opened tip',
  tipAttachmentDownload: 'Downloaded attachment',
  tipNoteCreate: 'Added note',
  tipNoteDelete: 'Deleted note',
  changeEmail: 'Changed email',
  changePassword: 'Changed password',
  mfaEnable: 'Enabled MFA',
  mfaDisable: 'Disabled MFA',
  mfaAdminReset: 'Admin reset MFA',
  mfaLogin: 'MFA login',
  mfaBackupLogin: 'MFA backup-code login',
  oidcLogin: 'OIDC login',
  oidcProvisionLogin: 'OIDC login (provisioned)',
  oidcLink: 'Linked OIDC identity',
  userCreate: 'Created user',
  userDisable: 'Disabled user',
  userEnable: 'Enabled user',
  brandingUpdate: 'Updated branding',
  brandingReset: 'Reset branding',
  brandingLogoUpload: 'Uploaded branding logo',
  brandingLogoDelete: 'Removed branding logo',
  draftPurge: 'Draft retention purge',
};

export function actionLabel(action) {
  return ACTION_LABELS[action] || action;
}
