#!/usr/bin/env bash
# Generate strong JWT_SECRET / POSTGRES_PASSWORD (and optional ADMIN_PASSWORD)
# into .env if missing or still set to example defaults.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT/.env}"
EXAMPLE="$ROOT/.env.example"

rand() {
  openssl rand -base64 48 | tr -d '\n'
}

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$EXAMPLE" ]]; then
    cp "$EXAMPLE" "$ENV_FILE"
    echo "Created $ENV_FILE from .env.example"
  else
    touch "$ENV_FILE"
    echo "Created empty $ENV_FILE"
  fi
fi

upsert() {
  local key="$1"
  local value="$2"
  if grep -qE "^${key}=" "$ENV_FILE"; then
    # Portable in-place edit without requiring GNU sed
    local tmp
    tmp="$(mktemp)"
    awk -v k="$key" -v v="$value" '
      BEGIN { done=0 }
      $0 ~ "^"k"=" { print k"="v; done=1; next }
      { print }
      END { if (!done) print k"="v }
    ' "$ENV_FILE" >"$tmp"
    mv "$tmp" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >>"$ENV_FILE"
  fi
}

get_val() {
  local key="$1"
  grep -E "^${key}=" "$ENV_FILE" | head -n1 | cut -d= -f2- || true
}

WEAK_JWT='change-me-in-production|replace-with-a-long-random-string|dev-insecure-secret-change-me|secret|'
WEAK_DB='crimetips|postgres|password|changeme|'
WEAK_ADMIN='changeme|change-me|password|admin|admin123|'

jwt="$(get_val JWT_SECRET)"
if [[ -z "$jwt" || "$jwt" =~ ^($WEAK_JWT)$ || ${#jwt} -lt 32 ]]; then
  upsert JWT_SECRET "$(rand)"
  echo "Set JWT_SECRET"
else
  echo "JWT_SECRET already looks strong — left unchanged"
fi

dbpass="$(get_val POSTGRES_PASSWORD)"
if [[ -z "$dbpass" || "$dbpass" =~ ^($WEAK_DB)$ ]]; then
  new_db="$(rand)"
  upsert POSTGRES_PASSWORD "$new_db"
  # Keep DATABASE_URL password in sync when using the default host form
  dburl="$(get_val DATABASE_URL)"
  user="$(get_val POSTGRES_USER)"
  db="$(get_val POSTGRES_DB)"
  user="${user:-crimetips}"
  db="${db:-crimetips}"
  if [[ -z "$dburl" || "$dburl" == *"@db:5432/"* || "$dburl" == *"@host.docker.internal:5432/"* ]]; then
    host="db"
    if [[ "$dburl" == *"@host.docker.internal:5432/"* ]]; then
      host="host.docker.internal"
    fi
    # URL-encode is skipped; gen-secrets uses URL-safe base64 (no +/ may appear — openssl base64 can).
    # Prefer percent-encoding minimal set for DATABASE_URL.
    enc="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$new_db")"
    upsert DATABASE_URL "postgres://${user}:${enc}@${host}:5432/${db}"
  fi
  echo "Set POSTGRES_PASSWORD (and DATABASE_URL password when applicable)"
else
  echo "POSTGRES_PASSWORD already looks strong — left unchanged"
fi

if [[ "${GEN_ADMIN_PASSWORD:-1}" == "1" ]]; then
  admin="$(get_val ADMIN_PASSWORD)"
  if [[ -z "$admin" || "$admin" =~ ^($WEAK_ADMIN)$ ]]; then
    upsert ADMIN_PASSWORD "$(rand)"
    echo "Set ADMIN_PASSWORD (change after first login; then remove from .env)"
  else
    echo "ADMIN_PASSWORD already looks strong — left unchanged"
  fi
fi

chmod 600 "$ENV_FILE" 2>/dev/null || true
echo "Done. Review $ENV_FILE and set DOMAIN / PUBLIC_ORIGIN / CRIME_TIPS_IMAGE for production."
echo "Copy ADMIN_EMAIL and ADMIN_PASSWORD into the agency password manager now."
echo "After first UI login and password change, remove ADMIN_PASSWORD from .env."
echo "Leave CRIME_TIPS_ENV unset (or production) — do not keep development for prod."
