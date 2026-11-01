# Changelog

All notable changes to Crime Tips are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

## [Unreleased]

## [1.1.3] - 2026-11-01

Ops / install patch on the `v1.1.2` PD package. Includes [#20](https://github.com/benjaminsingleton/crime-tips/pull/20) (PD install dry-run friction).

### Fixed

- Install runbook: Ubuntu Docker Engine + Compose apt path, `usermod`/re-login, lab vs public-DNS TLS branch, always-both-compose-files, password-manager cue, no `source .env` for image pin
- `.env.example`: drop default `CRIME_TIPS_ENV=development`; production-safe pin comments
- Preflight prod: warn on `CRIME_TIPS_ENV=development`, lingering `ADMIN_PASSWORD`, missing `ss`/`iproute2`; GHCR reachability via manifest inspect; refuse `:latest` / `:master`
- Backup/restore: atomic stamp dirs (no leftover 0-byte dumps); restore refuses empty dumps; verify notes

### Ops notes

- Pin production: `CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.1.3`
- Install / update: [docs/ops/install.md](docs/ops/install.md), [docs/ops/update.md](docs/ops/update.md)
- **GHCR package visibility:** packages often default to private. After this release publishes, a repo admin must keep (or set) the `crime-tips` package **Public** so departments can `docker pull` without a GitHub token. Steps: [docs/ops/ghcr.md](docs/ops/ghcr.md)

## [1.1.2] - 2026-10-30

Security patch on the `v1.1.1` PD package. Includes [#18](https://github.com/benjaminsingleton/crime-tips/pull/18) (Medium findings + Bugbot follow-ups).

### Security

- Medium findings: DB-backed `requireAdmin`; submitted attachment list uses full officer auth; edit tokens header/body only (no query); attachment/logo magic-byte sniff (drop `text/plain`); self password/email re-auth + MFA; admin MFA-reset gated; Origin CSRF checks (strict when `COOKIE_SAMESITE=none`); refuse `OIDC_ALLOW_INSECURE` in production; pin prod image default / preflight reject `:latest`; non-root container user + centralized error handler; password minimum 10

### Ops notes

- Pin production: `CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.1.2`
- Install / update: [docs/ops/install.md](docs/ops/install.md), [docs/ops/update.md](docs/ops/update.md)
- **GHCR package visibility:** packages often default to private. After this release publishes, a repo admin must keep (or set) the `crime-tips` package **Public** so departments can `docker pull` without a GitHub token. Steps: [docs/ops/ghcr.md](docs/ops/ghcr.md)

## [1.1.1] - 2026-10-30

Security patch on the `v1.1.0` PD package (SMTP, branding, OIDC, Safe Compose). Includes [#16](https://github.com/benjaminsingleton/crime-tips/pull/16).

### Security

- Tip attachment upload authorizes draft edit token before any disk write; reject non-UUID tip ids
- Branding: ban SVG logos; reject protocol-relative `logoUrl` (`//…`)
- OIDC: require `email_verified` before email account link / auto-provision (`OIDC_REQUIRE_EMAIL_VERIFIED`, default true)
- Officers get 404 for unsubmitted tip detail / flags / notes / download (mailbox submitted-only)
- Upgrade `nodemailer` past High advisories

### Ops notes

- Pin production: `CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.1.1`
- Install / update: [docs/ops/install.md](docs/ops/install.md), [docs/ops/update.md](docs/ops/update.md)
- **GHCR package visibility:** packages often default to private. After this release publishes, a repo admin must keep (or set) the `crime-tips` package **Public** so departments can `docker pull` without a GitHub token. Steps: [docs/ops/ghcr.md](docs/ops/ghcr.md)

## [1.1.0] - 2026-10-29

Second PD self-host release. Adds SMTP tip email, department branding, OIDC SSO, and PD-facing docs on top of the `v1.0.0` package (Safe Compose, httpOnly sessions, TOTP MFA, navy/gold UI, GHCR images).

### Added

- Optional SMTP new-tip email notifications to officers (`SMTP_*`; tip body never in email)
- Configurable department branding (`BRAND_*` env + admin UI) without forking
- Optional officer OIDC SSO (`OIDC_*`; SAML not included)
- PD-facing docs: evaluator README, privacy model, SECURITY.md, MIT LICENSE, troubleshooting, user-admin, evaluation one-pager

### Ops notes

- Pin production: `CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.1.0`
- Install / update: [docs/ops/install.md](docs/ops/install.md), [docs/ops/update.md](docs/ops/update.md)
- **GHCR package visibility:** packages often default to private. After this release publishes, a repo admin must keep (or set) the `crime-tips` package **Public** so departments can `docker pull` without a GitHub token. Steps: [docs/ops/ghcr.md](docs/ops/ghcr.md)

## [1.0.0] - 2026-10-29

First tagged release for police-department self-hosting. Production pulls a version-pinned image from GHCR; developers keep building locally with Compose.

### Added

- Postgres-backed API and schema (Firebase removed); Docker Compose for local and production
- Safe Compose production overlay: Caddy TLS, unpublished Postgres, strong-secret boot checks, rate limits, Helmet, CORS
- httpOnly officer session cookies and draft tip edit tokens
- Optional officer TOTP MFA (`MFA_REQUIRED`, enrollment under My Settings)
- GHCR publish workflow: `vX.Y.Z` → `:X.Y.Z` / `:X.Y` / `:latest`; `master` → `:master` / `:sha-…`
- PD update path: `scripts/update.sh`, backup/restore helpers, ops runbooks under `docs/ops/`
- Official navy/gold department UI (Semantic UI removed)

### Ops notes

- Pin production: `CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.0.0`
- Install / update: [docs/ops/install.md](docs/ops/install.md), [docs/ops/update.md](docs/ops/update.md)
- **GHCR package visibility:** new packages default to private. After this release publishes, a repo admin must set the `crime-tips` package to **Public** so departments can `docker pull` without a GitHub token. Steps: [docs/ops/ghcr.md](docs/ops/ghcr.md)
- SMTP, branding, and OIDC are **not** in this tag — use **`v1.1.0` / `:1.1.0`** (or later)

[Unreleased]: https://github.com/benjaminsingleton/crime-tips/compare/v1.1.3...HEAD
[1.1.3]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.1.3
[1.1.2]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.1.2
[1.1.1]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.1.1
[1.1.0]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.1.0
[1.0.0]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.0.0
