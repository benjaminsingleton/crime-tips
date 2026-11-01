# Install (police department IT)

Target: one Ubuntu LTS (or similar) VM with Docker Engine + Compose plugin. Time-to-first-tip goal: under one hour if you already know Docker.

## Decision checklist

Before you start, decide:

| Decision | Options |
|----------|---------|
| **Release pin** | Recommended **`v1.1.3` / `:1.1.3`** (install/ops patch on Medium-hardened SMTP/branding/OIDC package). Prefer a semver pin over `:latest` / `:master` for long-term prod |
| **DNS / TLS** | **Public DNS + Let’s Encrypt** via Caddy, **or lab / no public DNS** (`DOMAIN=localhost` or agency TLS — [tls.md](./tls.md) Modes 2–3). Do not open 80/443 to the internet until DNS for `DOMAIN` is correct |
| **IdP?** | Skip, or OIDC ([auth-mfa.md](./auth-mfa.md)) — included in `v1.1.0+` |
| **SMTP?** | Agency relay for new-tip mail, or stub/log only ([email.md](./email.md)) — included in `v1.1.0+` |
| **Sizing** | Small dept starter: 2 vCPU, 4 GiB RAM, 40+ GiB disk (uploads grow with media) |

Windows Server / non-Ubuntu: best-effort if Docker Engine + Compose work the same way; runbooks assume Linux paths under `/opt/crime-tips`.

## Version alignment

| You want | Git checkout | `CRIME_TIPS_IMAGE` |
|----------|--------------|--------------------|
| Current PD package (incl. install friction #20) | `git checkout v1.1.3` | `ghcr.io/benjaminsingleton/crime-tips:1.1.3` |
| Previous Medium security patch (#18) | `git checkout v1.1.2` | `ghcr.io/benjaminsingleton/crime-tips:1.1.2` |
| Previous security patch (#16) | `git checkout v1.1.1` | `ghcr.io/benjaminsingleton/crime-tips:1.1.1` |
| Previous feature release (SMTP, branding, OIDC; pre-#16) | `git checkout v1.1.0` | `ghcr.io/benjaminsingleton/crime-tips:1.1.0` |
| First release only (no SMTP / branding / OIDC) | `git checkout v1.0.0` | `ghcr.io/benjaminsingleton/crime-tips:1.0.0` |
| Pre-release / tip of tree | `git checkout master` | `ghcr.io/benjaminsingleton/crime-tips:master` (or a `:sha-…`) |

**Do not** mix checkout and image tags (e.g. `master` docs with `:1.0.0`). Feature matrix: [README § Version & features](../../README.md#version--features).

## 1. Prerequisites

- Docker Engine + Compose plugin (`docker compose version`)
- DNS A/AAAA for your tip hostname (for Let’s Encrypt), or plan agency TLS / internal CA ([tls.md](./tls.md))
- Host firewall: allow **80/443** only when DNS for `DOMAIN` is correct (and SSH from jump hosts only). Do **not** expose 5432 or 3000 to the internet.
- Optional but useful on minimal images: `iproute2` (`ss`) so `./scripts/preflight.sh prod` can check ports 80/443

### Ubuntu: install Docker Engine + Compose

If `docker` is missing on a clean Ubuntu LTS host, install from Docker’s official apt repository (summary; full detail: [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)):

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
# Re-login (or newgrp docker) so group membership applies; until then use sudo docker …
docker compose version
```

## 2. Install

```bash
sudo mkdir -p /opt/crime-tips
sudo chown "$USER":"$USER" /opt/crime-tips
cd /opt/crime-tips
git clone https://github.com/benjaminsingleton/crime-tips.git .
git checkout v1.1.3   # pin Compose/scripts to a release tag (detached HEAD is expected)
```

```bash
cp .env.example .env
./scripts/gen-secrets.sh
# Copy ADMIN_EMAIL / ADMIN_PASSWORD into the agency password manager now
```

Edit `.env` for production (see comments in `.env.example`):

| Variable | Set to |
|----------|--------|
| `DOMAIN` | Public hostname, e.g. `tips.example.gov` (lab: `localhost` or skip Let’s Encrypt — [tls.md](./tls.md)) |
| `PUBLIC_ORIGIN` | `https://tips.example.gov` |
| `ADMIN_EMAIL` | Initial admin mailbox |
| `CRIME_TIPS_IMAGE` | `ghcr.io/benjaminsingleton/crime-tips:1.1.3` (match the release; do not use `:latest` in prod) |
| `CRIME_TIPS_ENV` | Leave **unset** (or comment it out). Do **not** leave `development` from a naive copy of older examples — that publishes DB/app ports on the base Compose file. The prod overlay forces `production` when both Compose files are used |
| `SMTP_HOST` (and related `SMTP_*`) | Optional agency relay for new-tip officer email; leave empty to stub/log only — see [email.md](./email.md) |

Treat `.env` as sensitive: mode `600`, exclude from unencrypted off-box backup sync (or encrypt the archive).

```bash
chmod 600 .env
./scripts/preflight.sh prod
# Read only the image pin for `docker pull`. Do **not** `source .env` — that
# exports secrets into your shell and can truncate values containing $ ! or backticks;
# exported vars would also override Compose's .env file.
CRIME_TIPS_IMAGE="$(grep -E '^CRIME_TIPS_IMAGE=' .env | head -n1 | cut -d= -f2-)"
# Acceptance: anonymous pull must succeed (or use docker login per policy)
docker pull "${CRIME_TIPS_IMAGE:-ghcr.io/benjaminsingleton/crime-tips:1.1.3}"
# Always use BOTH compose files in production — never bare `docker compose up`.
# Compose loads `.env` itself (`--env-file` makes that explicit); no shell export needed.
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Production pulls the published app image from GHCR (no Node build on the PD host). For air-gap or audit builds, see [update.md](./update.md) (`docker-compose.build.yml`).

Open `https://$DOMAIN` (or `https://localhost` for lab). Submit a test tip, log in as the seeded admin, **change the admin password**, then remove `ADMIN_PASSWORD` from `.env` and recreate the app container so the password is not kept on disk:

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
6. `ADMIN_PASSWORD` removed from `.env` after first UI password change (checked item above)
7. Schedule backups **before** accepting real tips — [backup-restore.md](./backup-restore.md)

Officer auth uses a Secure (on HTTPS), httpOnly, SameSite=`lax` session cookie. Keep the API same-origin behind Caddy; set `PUBLIC_ORIGIN` if the browser origin differs. **Do not** set `COOKIE_SAMESITE=none` unless you intentionally run a cross-site API — that mode enables CSRF risk and turns on strict Origin checks. Draft tip edits require an unguessable edit token (header `X-Tip-Edit-Token`, not a query string) returned only on draft create.

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
# Optional: comment out CRIME_TIPS_IMAGE to keep the local crime-tips:local tag
docker compose up --build
# http://localhost:8080 — base Compose defaults CRIME_TIPS_ENV=development when unset
```

See also [update.md](./update.md), [tls.md](./tls.md), and [pd-evaluation.md](./pd-evaluation.md).
