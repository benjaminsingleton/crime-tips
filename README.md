# Crime Tips

Anonymous crime-tip intake for police departments, with an officer dashboard.

**Stack:** Vite + React frontend, Node/Express API, PostgreSQL, Docker Compose.

## Quick start (local / developer)

```bash
cp .env.example .env
docker compose up --build
```

Open **http://localhost:8080** (or `APP_PORT` from `.env`).

Example secrets are allowed when `CRIME_TIPS_ENV=development` (Compose default). Default admin: `admin@example.com` / `changeme`.

### Smoke check

1. Public tip form at `/` — enter crime type + tip text (≥20 chars), complete steps, submit.
2. Officer login at `/login` with the admin credentials.
3. Dashboard mailbox should list the tip; open it to view detail / add a note.

## Production self-host (Safe Compose)

Police-department path: TLS via Caddy, Postgres not published, strong secrets required at boot, rate limits + Helmet + CORS.

```bash
cp .env.example .env
./scripts/gen-secrets.sh
# set DOMAIN=tips.example.gov and PUBLIC_ORIGIN=https://tips.example.gov
chmod 600 .env
./scripts/preflight.sh prod
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

| Mode | Command | Public ports |
|------|---------|--------------|
| **Dev** | `docker compose up --build` | App `8080`, Postgres `5432` |
| **Prod** | `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build` | Caddy `80`/`443` only |

Ops runbooks:

- [Install](docs/ops/install.md)
- [TLS](docs/ops/tls.md)
- [Hardening checklist](docs/ops/hardening.md)
- [Backup & restore](docs/ops/backup-restore.md)

Helpers: `scripts/gen-secrets.sh`, `scripts/preflight.sh`, `scripts/backup.sh`, `scripts/restore.sh`.

## Local development (without full Compose)

Requires Node 20+ and a running Postgres (`DATABASE_URL`).

```bash
docker compose up db
cd server && npm install && npm start
cd client && npm install && npm run dev
```

## Configuration

See `.env.example`. Important variables:

| Variable | Purpose |
|----------|---------|
| `CRIME_TIPS_ENV` | `development` (local) or `production` (secret refusal + prod CORS) |
| `JWT_SECRET` | Signs officer session tokens (≥32 chars in prod) |
| `ADMIN_*` | Seeded on first boot when `users` is empty |
| `DATABASE_URL` | Postgres connection string |
| `PUBLIC_ORIGIN` | Allowed CORS origin(s); set to your HTTPS URL in prod |
| `DOMAIN` | Hostname for Caddy / Let’s Encrypt |
| `UPLOAD_DIR` | Tip file storage (volume in Compose) |
| `SMTP_*` | Optional new-tip email; otherwise the API logs a stub |

## Architecture

- `client/` — Vite React app (tip wizard + officer UI)
- `server/` — Express API, JWT/bcrypt auth, Postgres schema in `server/sql/schema.sql`
- `docker-compose.yml` — developer stack (`db` + `app`)
- `docker-compose.prod.yml` — production overlay (Caddy, no Postgres publish, prod env)

## License

Copyright (c) 2017 Benjamin Singleton.
