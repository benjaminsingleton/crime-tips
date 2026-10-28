#!/usr/bin/env bash
# Restore Postgres + uploads from a backup directory created by backup.sh.
# Usage: ./scripts/restore.sh backups/YYYYMMDDTHHMMSSZ
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SRC="${1:-}"
if [[ -z "$SRC" || ! -d "$SRC" ]]; then
  echo "Usage: $0 <backup-directory>" >&2
  exit 1
fi
SRC="$(cd "$SRC" && pwd)"

if [[ ! -f "$SRC/postgres.dump" ]]; then
  echo "Missing $SRC/postgres.dump" >&2
  exit 1
fi
if [[ ! -f "$SRC/uploads.tar.gz" ]]; then
  echo "Missing $SRC/uploads.tar.gz" >&2
  exit 1
fi

COMPOSE=(docker compose)
if ! docker info >/dev/null 2>&1; then
  COMPOSE=(sudo docker compose)
fi

COMPOSE_FILES=(-f docker-compose.yml)
if [[ "${WITH_PROD:-0}" == "1" ]]; then
  COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.prod.yml)
fi

PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$ROOT")}"
UPLOADS_VOL="${UPLOADS_VOLUME:-${PROJECT_NAME}_uploads}"

echo "WARNING: This replaces database contents and uploads volume data."
echo "Backup source: $SRC"
read -r -p "Type 'restore' to continue: " confirm
if [[ "$confirm" != "restore" ]]; then
  echo "Aborted."
  exit 1
fi

echo "Stopping app (and proxy if present)..."
"${COMPOSE[@]}" "${COMPOSE_FILES[@]}" stop app proxy 2>/dev/null || \
  "${COMPOSE[@]}" "${COMPOSE_FILES[@]}" stop app || true

echo "Restoring Postgres..."
# Drop/recreate public schema objects via pg_restore --clean
"${COMPOSE[@]}" "${COMPOSE_FILES[@]}" exec -T db \
  pg_restore -U "${POSTGRES_USER:-crimetips}" -d "${POSTGRES_DB:-crimetips}" --clean --if-exists \
  <"$SRC/postgres.dump" || true
# pg_restore returns non-zero on some benign warnings; verify with a simple query
"${COMPOSE[@]}" "${COMPOSE_FILES[@]}" exec -T db \
  psql -U "${POSTGRES_USER:-crimetips}" -d "${POSTGRES_DB:-crimetips}" -c 'SELECT COUNT(*) FROM tips;' >/dev/null

echo "Restoring uploads volume ($UPLOADS_VOL)..."
RUNNER=(docker)
if ! docker info >/dev/null 2>&1; then
  RUNNER=(sudo docker)
fi
"${RUNNER[@]}" run --rm \
  -v "${UPLOADS_VOL}:/data" \
  -v "$SRC:/backup:ro" \
  alpine:3.20 \
  sh -c 'rm -rf /data/* /data/.[!.]* /data/..?* 2>/dev/null; tar xzf /backup/uploads.tar.gz -C /data'

echo "Starting stack..."
"${COMPOSE[@]}" "${COMPOSE_FILES[@]}" up -d

echo "Restore finished. Verify a tip and an attachment in the officer dashboard."
