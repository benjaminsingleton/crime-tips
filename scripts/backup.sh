#!/usr/bin/env bash
# Backup Postgres (custom format) + uploads volume into BACKUP_DIR.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if docker info >/dev/null 2>&1; then
  DOCKER=(docker)
  COMPOSE=(docker compose)
else
  DOCKER=(sudo docker)
  COMPOSE=(sudo docker compose)
fi

COMPOSE_FILES=(-f docker-compose.yml)
if [[ "${WITH_PROD:-0}" == "1" ]]; then
  COMPOSE_FILES+=(-f docker-compose.prod.yml)
fi

BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DEST="$BACKUP_DIR/$STAMP"
mkdir -p "$DEST"

PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$ROOT")}"
UPLOADS_VOL="${UPLOADS_VOLUME:-${PROJECT_NAME}_uploads}"

echo "Backing up to $DEST"

"${COMPOSE[@]}" "${COMPOSE_FILES[@]}" exec -T db \
  pg_dump -U "${POSTGRES_USER:-crimetips}" -d "${POSTGRES_DB:-crimetips}" -Fc \
  >"$DEST/postgres.dump"

"${DOCKER[@]}" run --rm \
  -v "${UPLOADS_VOL}:/data:ro" \
  -v "$DEST:/backup" \
  alpine:3.20 \
  tar czf /backup/uploads.tar.gz -C /data .

{
  echo "stamp=$STAMP"
  echo "postgres.dump"
  echo "uploads.tar.gz"
  echo "uploads_volume=$UPLOADS_VOL"
} >"$DEST/MANIFEST.txt"

echo "Backup complete: $DEST"
echo "Copy this directory off-box per agency policy."

KEEP_DAYS="${BACKUP_KEEP_DAYS:-}"
if [[ -n "$KEEP_DAYS" ]]; then
  find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime "+$KEEP_DAYS" -exec rm -rf {} +
  echo "Pruned backups older than $KEEP_DAYS days"
fi
