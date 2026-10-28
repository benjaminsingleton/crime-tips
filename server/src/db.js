import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function migrate() {
  const schemaPath = path.join(__dirname, '../sql/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
}

export async function seedAdmin() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  if (rows[0].count > 0) return;

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO users (email, password_hash, rank, first_name, last_name, admin, notifications, account_active)
     VALUES ($1, $2, $3, $4, $5, TRUE, TRUE, TRUE)`,
    [
      email,
      hash,
      process.env.ADMIN_RANK || 'Admin',
      process.env.ADMIN_FIRST_NAME || 'System',
      process.env.ADMIN_LAST_NAME || 'Administrator',
    ],
  );
  console.log(`Seeded admin user: ${email}`);
}

export function tipToJson(row) {
  if (!row) return null;
  const payload = row.payload || {};
  return {
    id: row.id,
    ...payload,
    submitted: row.submitted,
    read: row.read,
    archived: row.archived,
    important: row.important,
    timestampStart: row.timestamp_start,
    timestampSubmit: row.timestamp_submit,
    dateTime: row.timestamp_submit || row.timestamp_start || Date.parse(row.created_at),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    attachments: row.attachments || undefined,
    userNotes: row.userNotes || undefined,
  };
}
