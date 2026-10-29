# Hardening checklist

Use this before putting a tip site on the public internet.

## Network

- [ ] Production Compose overlay in use (`docker-compose.prod.yml`)
- [ ] Postgres **not** published to the host or internet
- [ ] App container not published publicly (only Caddy on 80/443, or loopback for BYO proxy)
- [ ] Host firewall: allow 80/443; restrict SSH; deny 5432/3000 from non-localhost

## Secrets

- [ ] Ran `./scripts/gen-secrets.sh` (or pasted secrets from a password manager)
- [ ] `JWT_SECRET` ≥ 32 characters and not an example string
- [ ] `POSTGRES_PASSWORD` not `crimetips` / other defaults
- [ ] Seeded admin password changed in the UI; `ADMIN_PASSWORD` removed from `.env`
- [ ] `.env` is `chmod 600` and not committed to git

Production boots **refuse** weak JWT / DB / admin example secrets when `CRIME_TIPS_ENV=production`.

## TLS and headers

- [ ] HTTPS works; HTTP redirects to HTTPS (Caddy)
- [ ] HSTS enabled once HTTPS is stable (Caddyfile default)
- [ ] App Helmet headers present (CSP, frame denial, etc.)

## Auth and tip privacy

- [ ] Officer session uses httpOnly cookie (not JWT in `localStorage`); Secure cookie over HTTPS
- [ ] `PUBLIC_ORIGIN` matches the browser origin when API is cross-origin (CORS + `credentials`)
- [ ] Unsubmitted tip PATCH / upload / delete require the draft **edit token** (UUID alone is not enough)
- [ ] Officers enrolled in TOTP MFA (or `MFA_REQUIRED=true`); see [auth-mfa.md](./auth-mfa.md)
- [ ] Seeded admin MFA enrolled; backup codes stored in the agency password manager
- [ ] If using OIDC SSO: redirect URI matches IdP; `OIDC_CLIENT_SECRET` in `.env` (`chmod 600`); prefer `OIDC_AUTO_PROVISION=false` and create officers explicitly; keep a break-glass password admin unless policy forbids it

## Abuse controls

- [ ] Login rate limit active (`POST /api/auth/login`)
- [ ] Tip write / upload rate limits active
- [ ] Attachment MIME allowlist + per-tip count cap (`MAX_ATTACHMENTS_PER_TIP`)

## Ops

- [ ] `CRIME_TIPS_IMAGE` pinned to a release tag (not floating `:latest` long-term)
- [ ] Update runbook followed: backup → `./scripts/update.sh vX.Y.Z` ([update.md](./update.md))
- [ ] Backup script scheduled; off-box copy verified
- [ ] Restore drill performed at least once on a staging clone
- [ ] Admin accounts are named officers; unused accounts disabled

## Incident starters

- Suspected session theft: rotate `JWT_SECRET` and restart `app` (invalidates session cookies)
- Suspected DB exposure: rotate `POSTGRES_PASSWORD`, update `DATABASE_URL`, restart stack, preserve logs
