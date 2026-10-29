# Install (police department IT)

Target: one Ubuntu LTS (or similar) VM with Docker Engine + Compose plugin. Time-to-first-tip goal: under one hour if you already know Docker.

## 1. Prerequisites

- Docker Engine + Compose plugin (`docker compose version`)
- DNS A/AAAA for your tip hostname (for Let’s Encrypt), or plan to use agency TLS / internal CA
- Host firewall: allow **80/443** (and SSH from jump hosts only). Do **not** expose 5432 or 3000 to the internet.

Sizing (small department): 2 vCPU, 4 GiB RAM, 40+ GiB disk (uploads grow with media).

## 2. Install

```bash
sudo mkdir -p /opt/crime-tips
sudo chown "$USER":"$USER" /opt/crime-tips
cd /opt/crime-tips
git clone https://github.com/benjaminsingleton/crime-tips.git .
git checkout vX.Y.Z   # pin Compose/scripts to a release tag when available

cp .env.example .env
./scripts/gen-secrets.sh
```

Edit `.env`:

| Variable | Set to |
|----------|--------|
| `DOMAIN` | Public hostname, e.g. `tips.example.gov` |
| `PUBLIC_ORIGIN` | `https://tips.example.gov` |
| `ADMIN_EMAIL` | Initial admin mailbox |
| `CRIME_TIPS_IMAGE` | `ghcr.io/benjaminsingleton/crime-tips:X.Y.Z` (match the release; default `:latest`) |
| `CRIME_TIPS_ENV` | Leave unset in `.env` if using the prod overlay (overlay forces `production`) |
| `SMTP_HOST` (and related `SMTP_*`) | Optional agency relay for new-tip officer email; leave empty to stub/log only — see [email.md](./email.md) |

```bash
chmod 600 .env
./scripts/preflight.sh prod
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

Optional officer **TOTP MFA**: enroll under My Settings, or set `MFA_REQUIRED=true` to require it for all officers. See [auth-mfa.md](./auth-mfa.md). Agency OIDC/SAML SSO is a documented follow-up (not in this release).

Optional **new-tip email**: set `SMTP_*` to your agency relay so officers with notifications enabled get mail on submit; leave `SMTP_HOST` empty to keep stub logging. See [email.md](./email.md).

## 4. Local developer path (not for production)

```bash
cp .env.example .env
docker compose up --build
# http://localhost:8080 — weak example secrets allowed when CRIME_TIPS_ENV=development
```

See also [update.md](./update.md), [hardening.md](./hardening.md), [tls.md](./tls.md), [email.md](./email.md), and [backup-restore.md](./backup-restore.md).
