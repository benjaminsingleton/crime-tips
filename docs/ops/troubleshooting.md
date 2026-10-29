# Troubleshooting (PD IT)

Common go-live and ops failures. Prefer `docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=200 <service>` for production.

## Health and boot

| Symptom | Check |
|---------|--------|
| App exits immediately | Weak secrets in production — run `./scripts/gen-secrets.sh`, set strong `JWT_SECRET` / DB / admin passwords, or remove `ADMIN_PASSWORD` after seed. See [hardening.md](./hardening.md). |
| `curl https://$DOMAIN/api/health` fails | Caddy up? `DOMAIN` / DNS correct? App healthy? `docker compose … ps` |
| Health OK but UI blank / API CORS errors | `PUBLIC_ORIGIN` must match the browser origin; prefer same-origin via Caddy |

## TLS / ACME (Let’s Encrypt)

| Symptom | Check |
|---------|--------|
| Certificate not issued | Public A/AAAA for `DOMAIN`? Ports **80/443** reachable from the internet? |
| HTTP works, HTTPS fails | Wait for ACME; inspect Caddy logs; agency firewall intercepting 80? |
| Agency already terminates TLS | Use BYO proxy mode — [tls.md](./tls.md) |

## GHCR pull

| Symptom | Check |
|---------|--------|
| `unauthorized` / `denied` on pull | Package may still be **private** — [ghcr.md](./ghcr.md). Verify: `docker pull ghcr.io/benjaminsingleton/crime-tips:<tag>` without login. |
| Tag not found | Confirm tag on the [package page](https://github.com/benjaminsingleton/crime-tips/pkgs/container/crime-tips) or use `:master` only if you intentionally follow pre-release. |

**Acceptance test before go-live:** anonymous `docker pull` of your pinned tag must succeed (or document PAT + `docker login` as agency policy).

## Auth / SSO / cookies

| Symptom | Check |
|---------|--------|
| Login succeeds then immediately logged out | HTTPS + `COOKIE_SECURE`; `PUBLIC_ORIGIN`; `TRUST_PROXY=true` behind reverse proxy |
| No SSO button | `OIDC_ISSUER` + `OIDC_CLIENT_ID` set and app restarted? Feature available on your image tag? See [Version alignment](./install.md#version-alignment). |
| Redirect URI mismatch | IdP registration must match `{PUBLIC_ORIGIN}/api/auth/oidc/callback` — [auth-mfa.md](./auth-mfa.md) |
| Locked out (SSO-only) | Keep a break-glass password admin, or temporarily set `OIDC_ALLOW_PASSWORD=true` — [user-admin.md](./user-admin.md) |

## Disk / uploads / restore

| Symptom | Check |
|---------|--------|
| Upload failures | Disk full? `MAX_UPLOAD_BYTES` / `MAX_ATTACHMENTS_PER_TIP`? MIME allowlist rejection in app logs |
| Restore fails | Use matching `WITH_PROD=1`; confirm backup path; stop traffic first — [backup-restore.md](./backup-restore.md) |
| Missing attachments after restore | Ensure both `postgres.dump` **and** `uploads.tar.gz` were restored |

## Email

| Symptom | Check |
|---------|--------|
| No officer mail | `SMTP_HOST` set? Officer **notifications** on? Stub mode logs `[email stub]` when SMTP unset — [email.md](./email.md) |
| Mail in spam | SPF/DKIM/DMARC for `SMTP_FROM` |

## Monitoring starters

- Probe `GET /api/health` from agency monitoring (expect `{"ok":true}`).
- Ship `docker compose … logs` (app, caddy, db) to your SIEM or log agent; set retention per agency policy.
- Alert on container restart loops and disk free space on the uploads volume host path.

More detail lives in feature runbooks: [tls.md](./tls.md), [ghcr.md](./ghcr.md), [auth-mfa.md](./auth-mfa.md), [email.md](./email.md), [update.md](./update.md).
