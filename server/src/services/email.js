import nodemailer from 'nodemailer';
import { query } from '../db.js';

let transporter = null;
let smtpLogged = false;

/** True when SMTP_HOST is set (real delivery); otherwise notify uses the console stub. */
export function isSmtpConfigured() {
  return Boolean((process.env.SMTP_HOST || '').trim());
}

function publicOrigin() {
  const raw = (process.env.PUBLIC_ORIGIN || '').trim();
  if (!raw) return '';
  // First origin if comma-separated (CORS allowlist form).
  return raw.split(',')[0].trim().replace(/\/$/, '');
}

function tipOfficerUrl(tipId) {
  const origin = publicOrigin();
  if (!origin) return null;
  return `${origin}/tip/${tipId}`;
}

function getTransporter() {
  if (!isSmtpConfigured()) return null;
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST.trim();
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
  return transporter;
}

export function logEmailConfig() {
  if (smtpLogged) return;
  smtpLogged = true;
  if (isSmtpConfigured()) {
    console.log(
      `Email notifications: SMTP enabled (${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587})`,
    );
  } else {
    console.log(
      'Email notifications: SMTP_HOST unset — new-tip mail will be logged as a stub (see docs/ops/email.md)',
    );
  }
}

/**
 * Notify active officers with notifications enabled that a tip was submitted.
 * Does not include tip content (privacy). Stub-logs when SMTP is unset.
 */
export async function notifyNewTip(tipId) {
  const { rows } = await query(
    `SELECT email FROM users
     WHERE notifications = TRUE AND account_active = TRUE
       AND email IS NOT NULL AND BTRIM(email) <> ''`,
  );
  const recipients = [...new Set(rows.map((r) => r.email.trim()).filter(Boolean))];
  const subject = 'New Crime Tip';
  const link = tipOfficerUrl(tipId);
  const text = [
    'A new crime tip was submitted.',
    `Tip id: ${tipId}`,
    link ? `Open in dashboard: ${link}` : 'Sign in to the Crime Tips dashboard to review it.',
    '',
    'You are receiving this because email notifications are enabled on your officer account.',
  ].join('\n');

  const transport = getTransporter();
  if (!transport) {
    console.log('[email stub] SMTP unset; would notify', {
      tipId,
      recipientCount: recipients.length,
      recipients,
      subject,
      text,
    });
    return { mode: 'stub', recipientCount: recipients.length };
  }

  if (recipients.length === 0) {
    console.log('[email] no active officers with notifications enabled; skipping send', {
      tipId,
    });
    return { mode: 'skipped', recipientCount: 0 };
  }

  const from = process.env.SMTP_FROM || 'noreply@crimetips.local';
  // One message per recipient so addresses stay private between officers.
  const results = await Promise.allSettled(
    recipients.map((to) =>
      transport.sendMail({
        from,
        to,
        subject,
        text,
      }),
    ),
  );

  const failed = results.filter((r) => r.status === 'rejected');
  const sent = results.length - failed.length;
  if (failed.length) {
    for (const f of failed) {
      console.error('[email] send failed', f.reason?.message || f.reason);
    }
  }
  console.log(`Crime tip email: sent=${sent} failed=${failed.length} tipId=${tipId}`);
  return { mode: 'smtp', recipientCount: recipients.length, sent, failed: failed.length };
}
