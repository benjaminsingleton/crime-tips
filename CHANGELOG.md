# Changelog

All notable changes to Crime Tips are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

## [Unreleased]

Features on `master` **after** the `v1.0.0` tag. They are available via image `:master` / `:sha-…` (or a forthcoming release tag). Do **not** expect them on `:1.0.0`. See [docs/ops/install.md § Version alignment](docs/ops/install.md#version-alignment).

### Added

- Optional SMTP new-tip email notifications to officers (`SMTP_*`; tip body never in email)
- Configurable department branding (`BRAND_*` env + admin UI) without forking
- Optional officer OIDC SSO (`OIDC_*`; SAML not included)
- PD-facing docs: evaluator README, privacy model, SECURITY.md, MIT LICENSE, troubleshooting, user-admin, evaluation one-pager

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
- SMTP, branding, and OIDC are **not** in this tag — see [Unreleased](#unreleased)

[Unreleased]: https://github.com/benjaminsingleton/crime-tips/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.0.0
