#!/usr/bin/env bash
# Update a production Crime Tips deploy to a new GHCR image tag (or rebuild).
#
# Usage:
#   ./scripts/update.sh v1.2.3          # pin to release → image :1.2.3
#   ./scripts/update.sh 1.2.3           # same (v prefix optional)
#   CRIME_TIPS_IMAGE=ghcr.io/...:1.2.3 ./scripts/update.sh
#   CRIME_TIPS_BUILD=1 ./scripts/update.sh   # build from local source instead
#
# Always back up first (see docs/ops/backup-restore.md and docs/ops/update.md).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${ENV_FILE:-$ROOT/.env}"
REGISTRY_IMAGE="${CRIME_TIPS_REGISTRY:-ghcr.io/benjaminsingleton/crime-tips}"
REQUESTED="${1:-}"
BUILD_FROM_SOURCE="${CRIME_TIPS_BUILD:-0}"

COMPOSE_BASE=(docker compose -f docker-compose.yml -f docker-compose.prod.yml)
if [[ "$BUILD_FROM_SOURCE" == "1" ]]; then
  COMPOSE=("${COMPOSE_BASE[@]}" -f docker-compose.build.yml)
else
  COMPOSE=("${COMPOSE_BASE[@]}")
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy .env.example and configure before updating." >&2
  exit 1
fi

upsert_env() {
  local key="$1" value="$2"
  if grep -qE "^${key}=" "$ENV_FILE"; then
    local tmp
    tmp="$(mktemp)"
    awk -v k="$key" -v v="$value" '
      BEGIN { done=0 }
      $0 ~ "^" k "=" {
        if (!done) { print k "=" v; done=1; next }
      }
      { print }
      END { if (!done) print k "=" v }
    ' "$ENV_FILE" >"$tmp"
    mv "$tmp" "$ENV_FILE"
  else
    printf '\n%s=%s\n' "$key" "$value" >>"$ENV_FILE"
  fi
}

normalize_tag() {
  local t="$1"
  t="${t#v}"
  echo "$t"
}

if [[ "$BUILD_FROM_SOURCE" == "1" ]]; then
  echo "Building app image from local source (CRIME_TIPS_BUILD=1)…"
  upsert_env CRIME_TIPS_IMAGE "crime-tips:local"
  "${COMPOSE[@]}" build app
  "${COMPOSE[@]}" up -d
else
  if [[ -n "$REQUESTED" ]]; then
    TAG="$(normalize_tag "$REQUESTED")"
    IMAGE="${REGISTRY_IMAGE}:${TAG}"
    upsert_env CRIME_TIPS_IMAGE "$IMAGE"
    echo "Pinned CRIME_TIPS_IMAGE=$IMAGE in .env"
  else
    IMAGE="$(grep -E '^CRIME_TIPS_IMAGE=' "$ENV_FILE" | head -n1 | cut -d= -f2- || true)"
    if [[ -z "$IMAGE" ]]; then
      echo "No version argument and CRIME_TIPS_IMAGE unset in .env." >&2
      echo "Usage: ./scripts/update.sh v1.2.3" >&2
      exit 1
    fi
    echo "Using existing CRIME_TIPS_IMAGE=$IMAGE"
  fi

  echo "Pulling image…"
  "${COMPOSE[@]}" pull app
  echo "Recreating services…"
  "${COMPOSE[@]}" up -d
fi

echo "Waiting for /api/health …"
ok=0
for _ in $(seq 1 30); do
  if "${COMPOSE[@]}" exec -T app node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    ok=1
    break
  fi
  sleep 2
done

if [[ "$ok" -ne 1 ]]; then
  echo "Health check did not pass in time. Check: ${COMPOSE[*]} logs app" >&2
  exit 1
fi

echo "Update complete. App is healthy."
if [[ "$BUILD_FROM_SOURCE" != "1" ]]; then
  echo "Running image: $(grep -E '^CRIME_TIPS_IMAGE=' "$ENV_FILE" | head -n1 | cut -d= -f2-)"
fi
