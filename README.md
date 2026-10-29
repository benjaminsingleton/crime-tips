# Crime Tips

Anonymous crime-tip intake for police departments, with an officer dashboard.

**Stack:** Vite + React frontend, Node/Express API, PostgreSQL, Docker Compose.

## Quick start (local / developer)

```bash
cp .env.example .env
docker compose up --build
```

Open **http://localhost:8080** (or `APP_PORT` from `.env`).

Example secrets are allowed when `CRIME_TIPS_ENV=development` (Compose default). Default admin: `admin@example.com` / `changeme`.

### Smoke check

1. Public tip form at `/` — enter crime type + tip text (≥20 chars), complete steps, submit.
2. Officer login at `/login` with the admin credentials.
3. Dashboard mailbox should list the tip; open it to view detail / add a note.

## Production self-host (Safe Compose)

Police-department path: TLS via Caddy, Postgres not published, strong secrets required at boot, rate limits + Helmet + CORS. Production **pulls a version-pinned image from GHCR** (no build on the PD host).

```bash
cp .env.example .env
./scripts/gen-secrets.sh
# set DOMAIN=tips.example.gov and PUBLIC_ORIGIN=https://tips.example.gov
# pin a release, e.g. CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.0.0
chmod 600 .env
./scripts/preflight.sh prod
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

| Mode | Command | Public ports |
|------|---------|--------------|
| **Dev** | `docker compose up --build` | App `8080`, Postgres `5432` |
| **Prod** | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d` (pull GHCR image) | Caddy `80`/`443` only |
| **Prod from source** | add `-f docker-compose.build.yml` and `--build` | same |

**Image:** `ghcr.io/benjaminsingleton/crime-tips` — first release **`v1.0.0`** → `:1.0.0` / `:1.0` / `:latest`; later `vX.Y.Z` tags follow the same pattern. Branch CI also publishes `:master` and `:sha-…`.

**Package visibility:** GHCR packages often start private. After the release image publishes, a maintainer must set the package to **Public** so departments can pull without login — see [GHCR](docs/ops/ghcr.md).

Update: `./scripts/backup.sh && ./scripts/update.sh v1.0.0` — see [Update](docs/ops/update.md). Changelog: [CHANGELOG.md](CHANGELOG.md).

Ops runbooks:

- [Install](docs/ops/install.md)
- [Update](docs/ops/update.md)
- [GHCR publish & visibility](docs/ops/ghcr.md)
- [TLS](docs/ops/tls.md)
- [Hardening checklist](docs/ops/hardening.md)
- [Officer MFA (TOTP)](docs/ops/auth-mfa.md)
- [Department branding](docs/ops/branding.md)
- [Email notifications (SMTP)](docs/ops/email.md)
- [Backup & restore](docs/ops/backup-restore.md)

Helpers: `scripts/gen-secrets.sh`, `scripts/preflight.sh`, `scripts/backup.sh`, `scripts/restore.sh`, `scripts/update.sh`.

## Local development (without full Compose)

Requires Node 20+ and a running Postgres (`DATABASE_URL`).

```bash
docker compose up db
cd server && npm install && npm start
cd client && npm install && npm run dev
```

## Configuration

See `.env.example`. Important variables:

| Variable | Purpose |
|----------|---------|
| `CRIME_TIPS_ENV` | `development` (local) or `production` (secret refusal + prod CORS) |
| `JWT_SECRET` | Signs officer session cookies (≥32 chars in prod) |
| `COOKIE_SECURE` / `COOKIE_SAMESITE` | Session cookie flags (Secure defaults on in prod/HTTPS; SameSite defaults to `lax`) |
| `ADMIN_*` | Seeded on first boot when `users` is empty |
| `DATABASE_URL` | Postgres connection string |
| `PUBLIC_ORIGIN` | Allowed CORS origin(s); required when the SPA and API are on different origins (`credentials: include`) |
| `DOMAIN` | Hostname for Caddy / Let’s Encrypt |
| `UPLOAD_DIR` | Tip file storage (volume in Compose) |
| `SMTP_*` | Optional new-tip email to officers with notifications on; unset `SMTP_HOST` → console stub ([email.md](docs/ops/email.md)) |
| `MFA_REQUIRED` | `true` to require TOTP enrollment for all officers (optional) |
| `MFA_ISSUER` | Authenticator app label (default `Crime Tips`) |
| `BRAND_NAME` / `BRAND_TAGLINE` / `BRAND_LOGO_URL` | Department branding defaults (admin UI can override) |
| `BRAND_PRIMARY_COLOR` / `BRAND_ACCENT_COLOR` | Navy / gold hex colors for the official theme |

## Architecture

- `client/` — Vite React app (tip wizard + officer UI)
- `server/` — Express API, httpOnly session cookies + bcrypt, optional TOTP MFA, draft tip edit tokens, Postgres schema in `server/sql/schema.sql`
- `docker-compose.yml` — developer stack (`db` + `app`; `docker compose up --build`)
- `docker-compose.prod.yml` — production overlay (Caddy, no Postgres publish, pull GHCR image)
- `docker-compose.build.yml` — optional: build app from source instead of pulling

## License

Copyright (c) 2017 Benjamin Singleton.
