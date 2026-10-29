# Changelog

All notable changes to Crime Tips are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

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

[1.0.0]: https://github.com/benjaminsingleton/crime-tips/releases/tag/v1.0.0
