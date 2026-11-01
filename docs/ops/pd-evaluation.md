# PD evaluation one-pager

Printable summary for a commander / IT lead deciding on a pilot.

## What it is

**Crime Tips** — self-hosted public tip intake + officer dashboard (mailbox, notes, attachments). One department per deployment (not multi-tenant SaaS).

## Stack & data residency

- Vite/React SPA, Node/Express API, PostgreSQL, Docker Compose (+ Caddy TLS in production).
- **All tip data stays on your VM**: Postgres volume + uploads volume (+ your backups). Maintainers do not host your tips.

## Auth options

- Email/password sessions (httpOnly cookie).
- Optional officer **TOTP MFA**.
- Optional agency **OIDC SSO** (SAML not included).
- Tipsters do not log in.

## Threat basics (self-host)

Public form abuse (rate limits help), draft-token theft, officer account takeover, backup confidentiality, and proxy/IP logs that may reduce tipster anonymity. See [privacy-model.md](./privacy-model.md) and [hardening.md](./hardening.md).

## Install effort

Roughly under an hour for Docker-comfortable IT with DNS ready: pin image, gen secrets, compose up, smoke tip + login. Runbook: [install.md](./install.md).

## You must operate

Backups and restore drills, updates (pinned GHCR tags), TLS/DNS, optional IdP and SMTP, officer lifecycle, retention/FOIA policy.

## You do **not** get

- Managed support or a support SLA (community / maintainer best-effort — [SECURITY.md](../../SECURITY.md))
- **CJIS certification** or any compliance stamp from this project
- HA / multi-node Compose out of the box
- Built-in malware scanning, SAML, or password-reset email

## Version note

Tagged **`v1.1.3`** is the current PD package (install/ops patch on Medium-hardened SMTP/branding/OIDC). **`v1.0.0`** remains the first release without those features. Match checkout ↔ image via [version alignment](./install.md#version-alignment).

## License

[MIT](../../LICENSE) — suitable for most agency legal reviews of OSS tooling.
