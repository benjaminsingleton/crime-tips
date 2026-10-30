#!/bin/sh
# Drop root after ensuring the uploads volume is writable by the app user.
set -eu

APP_UID="${APP_UID:-10001}"
APP_GID="${APP_GID:-10001}"
UPLOAD_DIR="${UPLOAD_DIR:-/data/uploads}"

if [ "$(id -u)" = "0" ]; then
  mkdir -p "$UPLOAD_DIR"
  chown -R "${APP_UID}:${APP_GID}" "$UPLOAD_DIR" 2>/dev/null || true
  if command -v setpriv >/dev/null 2>&1; then
    exec setpriv --reuid="$APP_UID" --regid="$APP_GID" --clear-groups -- "$@"
  fi
  if command -v runuser >/dev/null 2>&1; then
    exec runuser -u crimetips -- "$@"
  fi
  echo "WARNING: could not drop privileges; running as root" >&2
fi

exec "$@"
