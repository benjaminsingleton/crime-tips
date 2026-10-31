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
else
  echo "NOTE: WITH_PROD is not set. For production overlay stacks use: WITH_PROD=1 $0" >&2
fi

BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DEST="$BACKUP_DIR/$STAMP"
WORKDIR="$BACKUP_DIR/.tmp-$STAMP-$$"

cleanup_incomplete() {
  rm -rf "$WORKDIR" 2>/dev/null || true
  # Never leave a partial stamp dir that looks like a successful backup
  if [[ -d "$DEST" ]]; then
    rm -rf "$DEST"
  fi
}
trap cleanup_incomplete EXIT

mkdir -p "$BACKUP_DIR" "$WORKDIR"

PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$ROOT")}"
UPLOADS_VOL="${UPLOADS_VOLUME:-${PROJECT_NAME}_uploads}"

echo "Backing up to $DEST (staging in $WORKDIR)"

"${COMPOSE[@]}" "${COMPOSE_FILES[@]}" exec -T db \
  pg_dump -U "${POSTGRES_USER:-crimetips}" -d "${POSTGRES_DB:-crimetips}" -Fc \
  >"$WORKDIR/postgres.dump"

if [[ ! -s "$WORKDIR/postgres.dump" ]]; then
  echo "ERROR: postgres.dump is missing or 0 bytes (is the db service running? Use WITH_PROD=1 for prod)." >&2
  exit 1
fi

"${DOCKER[@]}" run --rm \
  -v "${UPLOADS_VOL}:/data:ro" \
  -v "$WORKDIR:/backup" \
  alpine:3.20 \
  tar czf /backup/uploads.tar.gz -C /data .

if [[ ! -s "$WORKDIR/uploads.tar.gz" ]]; then
  echo "ERROR: uploads.tar.gz is missing or 0 bytes (check UPLOADS_VOLUME=$UPLOADS_VOL)." >&2
  exit 1
fi

{
  echo "stamp=$STAMP"
  echo "postgres.dump"
  echo "uploads.tar.gz"
  echo "uploads_volume=$UPLOADS_VOL"
  echo "postgres_dump_bytes=$(wc -c <"$WORKDIR/postgres.dump" | tr -d ' ')"
  echo "uploads_tar_bytes=$(wc -c <"$WORKDIR/uploads.tar.gz" | tr -d ' ')"
} >"$WORKDIR/MANIFEST.txt"

# Atomic publish: only create the stamp directory after a complete backup
mv "$WORKDIR" "$DEST"
trap - EXIT

echo "Backup complete: $DEST"
echo "Verify: non-zero postgres.dump + uploads.tar.gz, then copy off-box per agency policy."
echo "Do not sync unencrypted .env with backup archives."

KEEP_DAYS="${BACKUP_KEEP_DAYS:-}"
if [[ -n "$KEEP_DAYS" ]]; then
  find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime "+$KEEP_DAYS" -exec rm -rf {} +
  echo "Pruned backups older than $KEEP_DAYS days"
fi
