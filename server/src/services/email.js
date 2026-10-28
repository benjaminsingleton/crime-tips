import nodemailer from 'nodemailer';
import { query } from '../db.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;

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

export async function notifyNewTip(tipId) {
  const { rows } = await query(
    `SELECT email FROM users WHERE notifications = TRUE AND account_active = TRUE`,
  );
  const recipients = rows.map((r) => r.email).filter(Boolean);
  const subject = 'New Crime Tip!';
  const text = `A new crime tip was submitted (id: ${tipId}).`;

  const transport = getTransporter();
  if (!transport || recipients.length === 0) {
    console.log('[email stub]', { tipId, recipients, subject, text });
    return;
  }

  const from = process.env.SMTP_FROM || 'noreply@crimetips.local';
  await transport.sendMail({
    from,
    to: recipients.join(', '),
    subject,
    text,
  });
  console.log(`Crime tip email sent to ${recipients.length} recipient(s).`);
}
