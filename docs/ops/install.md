# Install (police department IT)

Target: one Ubuntu LTS (or similar) VM with Docker Engine + Compose plugin. Time-to-first-tip goal: under one hour if you already know Docker.

## Decision checklist

Before you start, decide:

| Decision | Options |
|----------|---------|
| **Release pin** | Recommended **`v1.1.1` / `:1.1.1`** (security patch on SMTP/branding/OIDC package). Prefer a semver pin over `:latest` / `:master` for long-term prod |
| **DNS / TLS** | Public hostname + Let’s Encrypt via Caddy, or agency TLS / BYO proxy ([tls.md](./tls.md)) |
| **IdP?** | Skip, or OIDC ([auth-mfa.md](./auth-mfa.md)) — included in `v1.1.0+` |
| **SMTP?** | Agency relay for new-tip mail, or stub/log only ([email.md](./email.md)) — included in `v1.1.0+` |
| **Sizing** | Small dept starter: 2 vCPU, 4 GiB RAM, 40+ GiB disk (uploads grow with media) |

Windows Server / non-Ubuntu: best-effort if Docker Engine + Compose work the same way; runbooks assume Linux paths under `/opt/crime-tips`.

## Version alignment

| You want | Git checkout | `CRIME_TIPS_IMAGE` |
|----------|--------------|--------------------|
| Current PD package (incl. security patch #16) | `git checkout v1.1.1` | `ghcr.io/benjaminsingleton/crime-tips:1.1.1` |
| Previous feature release (SMTP, branding, OIDC; pre-#16) | `git checkout v1.1.0` | `ghcr.io/benjaminsingleton/crime-tips:1.1.0` |
| First release only (no SMTP / branding / OIDC) | `git checkout v1.0.0` | `ghcr.io/benjaminsingleton/crime-tips:1.0.0` |
| Pre-release / tip of tree | `git checkout master` | `ghcr.io/benjaminsingleton/crime-tips:master` (or a `:sha-…`) |

**Do not** mix checkout and image tags (e.g. `master` docs with `:1.0.0`). Feature matrix: [README § Version & features](../../README.md#version--features).

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
git checkout v1.1.1   # pin Compose/scripts to a release tag

cp .env.example .env
./scripts/gen-secrets.sh
```

Edit `.env`:

| Variable | Set to |
|----------|--------|
| `DOMAIN` | Public hostname, e.g. `tips.example.gov` |
| `PUBLIC_ORIGIN` | `https://tips.example.gov` |
| `ADMIN_EMAIL` | Initial admin mailbox |
| `CRIME_TIPS_IMAGE` | `ghcr.io/benjaminsingleton/crime-tips:1.1.1` (match the release; default `:latest`) |
| `CRIME_TIPS_ENV` | Leave unset in `.env` if using the prod overlay (overlay forces `production`) |
| `SMTP_HOST` (and related `SMTP_*`) | Optional agency relay for new-tip officer email; leave empty to stub/log only — see [email.md](./email.md) |

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

Optional officer **TOTP MFA**: enroll under My Settings, or set `MFA_REQUIRED=true`. Optional **OIDC SSO**: set `OIDC_ISSUER` + `OIDC_CLIENT_ID` (and usually `OIDC_CLIENT_SECRET`); password login stays available unless `OIDC_ALLOW_PASSWORD=false`. See [auth-mfa.md](./auth-mfa.md) and [user-admin.md](./user-admin.md).

Optional **new-tip email**: set `SMTP_*` to your agency relay so officers with notifications enabled get mail on submit; leave `SMTP_HOST` empty to keep stub logging. See [email.md](./email.md).

**Department branding** (name, logo, navy/gold colors) without forking: set `BRAND_*` in `.env`, or sign in as admin → **Branding**. See [branding.md](./branding.md).

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
