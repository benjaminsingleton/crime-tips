CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT '',
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  notifications BOOLEAN NOT NULL DEFAULT TRUE,
  account_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted BOOLEAN NOT NULL DEFAULT FALSE,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  important BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp_start BIGINT,
  timestamp_submit BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tips_submitted_idx ON tips (submitted);
CREATE INDEX IF NOT EXISTS tips_archived_idx ON tips (archived);
CREATE INDEX IF NOT EXISTS tips_important_idx ON tips (important);
CREATE INDEX IF NOT EXISTS tips_read_idx ON tips (read);
CREATE INDEX IF NOT EXISTS tips_created_at_idx ON tips (created_at DESC);

CREATE TABLE IF NOT EXISTS tip_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id UUID NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tip_attachments_tip_id_idx ON tip_attachments (tip_id);

CREATE TABLE IF NOT EXISTS tip_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id UUID NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tip_notes_tip_id_idx ON tip_notes (tip_id);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tip_id UUID REFERENCES tips(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  status BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON activity_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS activity_logs_tip_id_idx ON activity_logs (tip_id);
