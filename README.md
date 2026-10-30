# Crime Tips

**Self-hosted crime-tip intake and officer dashboard for police / law-enforcement IT.**

Public tip form for your community; mailbox and case notes for sworn or civilian officers. You run it on your own VM with Docker — tip data stays in your Postgres and upload volumes.

**Status:** `v1.x` self-host package. Current release: **`v1.1.1`** (security patch on SMTP/branding/OIDC package). See [Version & features](#version--features).

## Is this for us?

**Good fit when**

- One department (or unit) wants a dedicated tip URL
- IT can run Ubuntu LTS (or similar) + Docker Compose
- You will terminate TLS (Let’s Encrypt via Caddy, or agency proxy)
- You accept **community / maintainer best-effort** support (GitHub Issues + maintainer email) — not a managed SaaS contract

**Not a fit / not claimed**

- Multi-tenant managed SaaS
- **CJIS certification** or any compliance attestation from this project ([SECURITY.md](SECURITY.md))
- High-availability multi-node out of the box
- SAML SSO (OIDC only), tipster email, password-reset email, built-in upload malware scanning

Evaluator one-pager: [docs/ops/pd-evaluation.md](docs/ops/pd-evaluation.md).

## Privacy / anonymity (honest)

Tipsters are not required to identify themselves, but anonymity is **not a guarantee**. Optional contact fields, attachments, officer access, reverse-proxy logs, and rate-limit IP handling can all reduce anonymity. The agency is the data controller. Full model: [docs/ops/privacy-model.md](docs/ops/privacy-model.md).

## Production self-host (start here)

Police-department path: TLS via Caddy, Postgres not published, strong secrets required at boot, rate limits + Helmet + CORS. Production **pulls a version-pinned image from GHCR** (no Node build on the PD host).

**Before go-live:** confirm anonymous pull works for your pin (GHCR packages often start private) — [docs/ops/ghcr.md](docs/ops/ghcr.md).

```bash
cp .env.example .env
./scripts/gen-secrets.sh
# set DOMAIN=tips.example.gov and PUBLIC_ORIGIN=https://tips.example.gov
# pin an image that matches the features you need (see Version & features)
# e.g. CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.1.1
chmod 600 .env
./scripts/preflight.sh prod
docker pull "${CRIME_TIPS_IMAGE:-ghcr.io/benjaminsingleton/crime-tips:1.1.1}"   # verify pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Full runbook (decision checklist, smoke test, admin password cleanup): [docs/ops/install.md](docs/ops/install.md).

| Mode | Command | Public ports |
|------|---------|--------------|
| **Prod** | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d` | Caddy `80`/`443` only |
| **Prod from source** | add `-f docker-compose.build.yml` and `--build` | same |
| **Dev** | `docker compose up --build` | App `8080`, Postgres `5432` |

**Image:** `ghcr.io/benjaminsingleton/crime-tips` — release tag `vX.Y.Z` → `:X.Y.Z` / `:X.Y` / `:latest`; branch CI also publishes `:master` and `:sha-…`.

Update: `./scripts/backup.sh && ./scripts/update.sh <tag>` — [docs/ops/update.md](docs/ops/update.md). Changelog: [CHANGELOG.md](CHANGELOG.md).

## Version & features

Do **not** mix checkout and image tags (e.g. `v1.1.1` docs with `:1.0.0`) and expect parity.

| Capability | Min image / checkout | Notes |
|------------|----------------------|--------|
| Safe Compose, httpOnly sessions, tip intake, officer dashboard | **`v1.0.0` / `:1.0.0`** | First PD release |
| Optional officer TOTP MFA | **`v1.0.0` / `:1.0.0`** | [auth-mfa.md](docs/ops/auth-mfa.md) |
| SMTP new-tip officer email | **`v1.1.0` / `:1.1.0`** | [email.md](docs/ops/email.md) |
| Department branding (`BRAND_*` / admin UI) | **`v1.1.0` / `:1.1.0`** | [branding.md](docs/ops/branding.md) |
| Optional OIDC SSO | **`v1.1.0` / `:1.1.0`** | [auth-mfa.md](docs/ops/auth-mfa.md) |
| PD-facing docs rewrite (privacy, SECURITY, MIT, eval) | **`v1.1.0` / `:1.1.0`** | Docs/tag package |
| Upload / branding / OIDC / draft mailbox hardening | **`v1.1.1` / `:1.1.1`** | [CHANGELOG](CHANGELOG.md) / [#16](https://github.com/benjaminsingleton/crime-tips/pull/16) |

**Recommended production pin:** `v1.1.1` / `:1.1.1`. Details: [install.md § Version alignment](docs/ops/install.md#version-alignment).

## Ops index

| Topic | Doc |
|-------|-----|
| Install | [docs/ops/install.md](docs/ops/install.md) |
| Update / rollback | [docs/ops/update.md](docs/ops/update.md) |
| GHCR visibility | [docs/ops/ghcr.md](docs/ops/ghcr.md) |
| TLS | [docs/ops/tls.md](docs/ops/tls.md) |
| Hardening | [docs/ops/hardening.md](docs/ops/hardening.md) |
| MFA + OIDC | [docs/ops/auth-mfa.md](docs/ops/auth-mfa.md) |
| Branding | [docs/ops/branding.md](docs/ops/branding.md) |
| Email (SMTP) | [docs/ops/email.md](docs/ops/email.md) |
| Backup & restore | [docs/ops/backup-restore.md](docs/ops/backup-restore.md) |
| Privacy / anonymity | [docs/ops/privacy-model.md](docs/ops/privacy-model.md) |
| User admin | [docs/ops/user-admin.md](docs/ops/user-admin.md) |
| Troubleshooting | [docs/ops/troubleshooting.md](docs/ops/troubleshooting.md) |
| PD evaluation | [docs/ops/pd-evaluation.md](docs/ops/pd-evaluation.md) |
| Security / vulns | [SECURITY.md](SECURITY.md) |
| License | [LICENSE](LICENSE) (MIT) |

Helpers: `scripts/gen-secrets.sh`, `scripts/preflight.sh`, `scripts/backup.sh`, `scripts/restore.sh`, `scripts/update.sh`.

## Configuration

See `.env.example`. Important variables:

| Variable | Purpose |
|----------|---------|
| `CRIME_TIPS_ENV` | `development` (local) or `production` (secret refusal + prod CORS) |
| `JWT_SECRET` | Signs officer session cookies (≥32 chars in prod) |
| `COOKIE_SECURE` / `COOKIE_SAMESITE` | Session cookie flags |
| `ADMIN_*` | Seeded on first boot when `users` is empty |
| `DATABASE_URL` | Postgres connection string |
| `PUBLIC_ORIGIN` | Allowed CORS origin(s); required when SPA and API differ |
| `DOMAIN` | Hostname for Caddy / Let’s Encrypt |
| `UPLOAD_DIR` | Tip file storage (volume in Compose) |
| `SMTP_*` | Optional new-tip email; unset `SMTP_HOST` → console stub ([email.md](docs/ops/email.md)) — `v1.1.0+` |
| `MFA_REQUIRED` / `MFA_ISSUER` | Optional TOTP policy |
| `OIDC_*` | Optional agency SSO ([auth-mfa.md](docs/ops/auth-mfa.md)) — `v1.1.0+` |
| `BRAND_*` | Department branding defaults — `v1.1.0+` |

## Architecture

```text
Tipster browser ──► Caddy (TLS) ──► app (Express + SPA)
                                      ├──► Postgres (tips, users, notes)
                                      └──► uploads volume (attachments)
Officer browser ──► same origin ──► cookie session and/or OIDC
```

Repo map:

- `client/` — Vite React app (tip wizard + officer UI)
- `server/` — Express API, httpOnly sessions, optional TOTP / OIDC, schema in `server/sql/schema.sql`
- `docker-compose.yml` — developer stack
- `docker-compose.prod.yml` — production overlay (Caddy, no Postgres publish, GHCR pull)
- `docker-compose.build.yml` — optional build-from-source

## Quick start (local / developer)

**Not for production.** Example secrets and published Postgres are allowed only when `CRIME_TIPS_ENV=development`.

```bash
cp .env.example .env
docker compose up --build
```

Open **http://localhost:8080** (or `APP_PORT`). Default admin: `admin@example.com` / `changeme`.

### Smoke check

1. Public tip form at `/` — crime type + tip text (≥20 chars), submit.
2. Officer login at `/login`.
3. Dashboard lists the tip; open for detail / notes.

### Without full Compose

Requires Node 20+ and Postgres (`DATABASE_URL`):

```bash
docker compose up db
cd server && npm install && npm start
cd client && npm install && npm run dev
```

## License

[MIT](LICENSE) — Copyright (c) 2017 Benjamin Singleton.
