# Install (police department IT)

Target: one Ubuntu LTS (or similar) VM with Docker Engine + Compose plugin. Time-to-first-tip goal: under one hour if you already know Docker.

## Decision checklist

Before you start, decide:

| Decision | Options |
|----------|---------|
| **Release pin** | Stable **`v1.0.0` / `:1.0.0`** (core tip intake + MFA), **or** `master` / `:master` (adds SMTP, branding, OIDC — pre-release), **or** wait for the next GitHub Release tag |
| **DNS / TLS** | Public hostname + Let’s Encrypt via Caddy, or agency TLS / BYO proxy ([tls.md](./tls.md)) |
| **IdP?** | Skip, or OIDC later ([auth-mfa.md](./auth-mfa.md)) — requires post-`v1.0.0` image |
| **SMTP?** | Agency relay for new-tip mail, or stub/log only ([email.md](./email.md)) — requires post-`v1.0.0` image |
| **Sizing** | Small dept starter: 2 vCPU, 4 GiB RAM, 40+ GiB disk (uploads grow with media) |

Windows Server / non-Ubuntu: best-effort if Docker Engine + Compose work the same way; runbooks assume Linux paths under `/opt/crime-tips`.

## Version alignment

| You want | Git checkout | `CRIME_TIPS_IMAGE` |
|----------|--------------|--------------------|
| Documented **v1.0.0** package (Safe Compose, tips, MFA) | `git checkout v1.0.0` | `ghcr.io/benjaminsingleton/crime-tips:1.0.0` |
| SMTP + branding + OIDC **before** the next release | `git checkout master` | `ghcr.io/benjaminsingleton/crime-tips:master` (or a `:sha-…`) |
| After the next semver release ships those features | that `vX.Y.Z` tag | matching `:X.Y.Z` |

**Do not** check out `master` docs/scripts while pinning `:1.0.0` and expect SMTP/branding/OIDC to work. Feature matrix: [README § Version & features](../../README.md#version--features).

## 1. Prerequisites

- Docker Engine + Compose plugin (`docker compose version`)
- DNS A/AAAA for your tip hostname (for Let’s Encrypt), or plan agency TLS / internal CA
- Host firewall: allow **80/443** (and SSH from jump hosts only). Do **not** expose 5432 or 3000 to the internet.

## 2. Install

```bash
sudo mkdir -p /opt/crime-tips
sudo chown "$USER":"$USER" /opt/crime-tips
cd /opt/crime-tips
git clone https://github.com/benjaminsingleton/crime-tips.git .
git checkout v1.0.0   # or master — must match the image tag below

cp .env.example .env
./scripts/gen-secrets.sh
```

Edit `.env`:

| Variable | Set to |
|----------|--------|
| `DOMAIN` | Public hostname, e.g. `tips.example.gov` |
| `PUBLIC_ORIGIN` | `https://tips.example.gov` |
| `ADMIN_EMAIL` | Initial admin mailbox |
| `CRIME_TIPS_IMAGE` | Match checkout: `:1.0.0` or `:master` (prefer semver in long-term prod) |
| `CRIME_TIPS_ENV` | Leave unset in `.env` if using the prod overlay (overlay forces `production`) |
| `SMTP_HOST` (and related `SMTP_*`) | Optional; only effective on post-`v1.0.0` images — [email.md](./email.md) |

```bash
chmod 600 .env
./scripts/preflight.sh prod
# Acceptance: anonymous pull must succeed (or use docker login per policy)
docker pull "$CRIME_TIPS_IMAGE"
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Production pulls the published app image from GHCR (no Node build on the PD host). For air-gap or audit builds, see [update.md](./update.md) (`docker-compose.build.yml`).

Open `https://$DOMAIN`. Submit a test tip, log in as the seeded admin, **change the admin password**, then remove `ADMIN_PASSWORD` from `.env` and recreate the app container so the password is not kept on disk:

```bash
# after password change in the UI
sed -i '/^ADMIN_PASSWORD=/d' .env
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d app
```

## 3. Smoke checklist

1. `https://…/` loads the tip form over HTTPS
2. Submit a tip (≥20 characters of tip text) and note the receipt id
3. `/login` with admin credentials → dashboard shows the tip (session is an httpOnly cookie; DevTools → Application → Cookies)
4. `curl -fsS https://$DOMAIN/api/health` → `{"ok":true}`
5. Confirm host ports: only 80/443 (and SSH) are public — not 5432

Officer auth uses a Secure (on HTTPS), httpOnly, SameSite session cookie. Set `PUBLIC_ORIGIN` to your HTTPS origin so CORS allows credentialed browser calls if the API is ever served cross-origin. Draft tip edits require an unguessable edit token returned only on draft create (held in the tip wizard, not the receipt id alone).

Optional officer **TOTP MFA** (`v1.0.0+`): enroll under My Settings, or set `MFA_REQUIRED=true`. Optional **OIDC SSO** (post-`v1.0.0` / `master`): set `OIDC_ISSUER` + `OIDC_CLIENT_ID`. See [auth-mfa.md](./auth-mfa.md) and [user-admin.md](./user-admin.md).

Optional **new-tip email** and **department branding** require a post-`v1.0.0` image — [email.md](./email.md), [branding.md](./branding.md).

## 4. Next steps

1. [hardening.md](./hardening.md) — claims boundary + checklist  
2. Schedule backups — [backup-restore.md](./backup-restore.md)  
3. MFA / SSO policy — [auth-mfa.md](./auth-mfa.md)  
4. Bookmark [troubleshooting.md](./troubleshooting.md) and [privacy-model.md](./privacy-model.md)

## 5. Local developer path (not for production)

```bash
cp .env.example .env
docker compose up --build
# http://localhost:8080 — weak example secrets allowed when CRIME_TIPS_ENV=development
```

See also [update.md](./update.md), [tls.md](./tls.md), and [pd-evaluation.md](./pd-evaluation.md).
