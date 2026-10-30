#!/usr/bin/env bash
# Pre-flight checks before a production (or careful local) deploy.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT/.env}"
MODE="${1:-prod}"
failures=0

ok() { echo "  OK  $*"; }
fail() { echo " FAIL $*"; failures=$((failures + 1)); }
warn() { echo " WARN $*"; }

echo "Crime Tips preflight (${MODE})"

if command -v docker >/dev/null 2>&1; then
  if docker info >/dev/null 2>&1 || sudo docker info >/dev/null 2>&1; then
    ok "Docker daemon reachable"
  else
    fail "Docker installed but daemon not reachable"
  fi
else
  fail "docker not found on PATH"
fi

if [[ ! -f "$ENV_FILE" ]]; then
  fail ".env missing at $ENV_FILE (cp .env.example .env && ./scripts/gen-secrets.sh)"
else
  ok ".env present"
  if [[ "$(stat -c %a "$ENV_FILE" 2>/dev/null || echo '?')" != "600" ]]; then
    warn ".env permissions are not 600 (recommend: chmod 600 .env)"
  else
    ok ".env mode 600"
  fi
fi

get_val() {
  local key="$1"
  [[ -f "$ENV_FILE" ]] || { echo ""; return; }
  grep -E "^${key}=" "$ENV_FILE" | head -n1 | cut -d= -f2- || true
}

jwt="$(get_val JWT_SECRET)"
dbpass="$(get_val POSTGRES_PASSWORD)"
admin="$(get_val ADMIN_PASSWORD)"
domain="$(get_val DOMAIN)"
origin="$(get_val PUBLIC_ORIGIN)"

if [[ "$MODE" == "prod" ]]; then
  if [[ -z "$jwt" || ${#jwt} -lt 32 || "$jwt" == "change-me-in-production" || "$jwt" == "replace-with-a-long-random-string" ]]; then
    fail "JWT_SECRET weak or missing (run ./scripts/gen-secrets.sh)"
  else
    ok "JWT_SECRET length looks acceptable"
  fi
  if [[ -z "$dbpass" || "$dbpass" == "crimetips" ]]; then
    fail "POSTGRES_PASSWORD is missing or still the example default"
  else
    ok "POSTGRES_PASSWORD not an example default"
  fi
  if [[ "$admin" == "changeme" || "$admin" == "change-me" ]]; then
    fail "ADMIN_PASSWORD still an example default"
  else
    ok "ADMIN_PASSWORD not an example default (remove from .env after first seed)"
  fi
  if [[ -z "$domain" ]]; then
    warn "DOMAIN unset — Caddy will default to localhost"
  else
    ok "DOMAIN=$domain"
  fi
  if [[ -z "$origin" ]]; then
    warn "PUBLIC_ORIGIN unset — production CORS will deny cross-origin API calls (same-origin via Caddy is fine)"
  else
    ok "PUBLIC_ORIGIN=$origin"
  fi

  oidc_insecure="$(get_val OIDC_ALLOW_INSECURE)"
  oidc_insecure_l="$(echo "$oidc_insecure" | tr '[:upper:]' '[:lower:]')"
  if [[ "$oidc_insecure_l" == "true" || "$oidc_insecure_l" == "1" || "$oidc_insecure_l" == "yes" ]]; then
    fail "OIDC_ALLOW_INSECURE must not be enabled in production"
  else
    ok "OIDC_ALLOW_INSECURE not enabled"
  fi

  samesite="$(get_val COOKIE_SAMESITE)"
  samesite_l="$(echo "$samesite" | tr '[:upper:]' '[:lower:]')"
  if [[ "$samesite_l" == "none" ]]; then
    warn "COOKIE_SAMESITE=none — Origin CSRF checks are strict; prefer same-origin Caddy + lax (see docs/ops/hardening.md)"
  fi

  image="${CRIME_TIPS_IMAGE:-$(get_val CRIME_TIPS_IMAGE)}"
  if [[ -z "$image" ]]; then
    # Compose prod default when unset
    image="ghcr.io/benjaminsingleton/crime-tips:1.1.2"
  fi
  if [[ "$image" == *:latest || "$image" == *:latest@* ]]; then
    fail "CRIME_TIPS_IMAGE must not use floating :latest in production (pin a release tag, e.g. :1.1.2)"
  else
    ok "CRIME_TIPS_IMAGE is pinned ($image)"
  fi

  for port in "${HTTP_PORT:-80}" "${HTTPS_PORT:-443}"; do
    if command -v ss >/dev/null 2>&1; then
      if ss -ltn "( sport = :$port )" 2>/dev/null | grep -q ":$port"; then
        warn "Port $port appears in use on this host"
      else
        ok "Port $port looks free"
      fi
    fi
  done
else
  ok "Dev mode — skipping strict secret checks"
fi

# Disk space heuristic
if command -v df >/dev/null 2>&1; then
  avail_kb="$(df -Pk "$ROOT" | awk 'NR==2 {print $4}')"
  if [[ -n "$avail_kb" && "$avail_kb" -lt 1048576 ]]; then
    warn "Less than ~1GiB free on the install filesystem"
  else
    ok "Disk space looks sufficient for a small deploy"
  fi
fi

if [[ "$failures" -gt 0 ]]; then
  echo "Preflight failed with $failures error(s)."
  exit 1
fi
echo "Preflight passed."
