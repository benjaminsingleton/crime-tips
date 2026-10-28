# Crime Tips

Anonymous crime-tip intake for police departments, with an officer dashboard.

**Stack:** Vite + React frontend, Node/Express API, PostgreSQL, Docker Compose. Firebase has been removed.

## Quick start (Docker)

```bash
cp .env.example .env
# edit JWT_SECRET and ADMIN_PASSWORD at minimum
docker compose up --build
```

Open **http://localhost:8080** (or `APP_PORT` from `.env`).

The app reaches Postgres via the Compose hostname `db` by default. If container-to-container TCP fails in your environment, set `DATABASE_URL` to use `host.docker.internal` (see `.env.example`); Compose already adds that host mapping.

Default admin (from `.env.example`):

- Email: `admin@example.com`
- Password: `changeme`

### Smoke check

1. Public tip form at `/` — enter crime type + tip text (≥20 chars), complete steps, submit. Note the receipt id.
2. Officer login at `/login` with the admin credentials.
3. Dashboard mailbox should list the tip; open it to view detail / add a note.

Optional attachments: enable “I have media…” on the intro step and upload on the media step (stored in the `uploads` Docker volume).

## Local development (without full Compose)

Requires Node 20+ and a running Postgres (`DATABASE_URL`).

```bash
# terminal 1 — database (or use only the db service)
docker compose up db

# terminal 2 — API
cd server
cp ../.env.example ../.env   # set DATABASE_URL=postgres://crimetips:crimetips@127.0.0.1:5432/crimetips
npm install
npm start

# terminal 3 — Vite client (proxies /api → :3000)
cd client
npm install
npm run dev
```

## Configuration

See `.env.example`. Important variables:

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Signs officer session tokens |
| `ADMIN_*` | Seeded on first boot when `users` is empty |
| `DATABASE_URL` | Postgres connection string |
| `UPLOAD_DIR` | Tip file storage (volume in Compose) |
| `SMTP_*` | Optional new-tip email; otherwise the API logs a stub |

## Architecture

- `client/` — Vite React app (tip wizard + officer UI)
- `server/` — Express API, JWT/bcrypt auth, Postgres schema in `server/sql/schema.sql`
- `docker-compose.yml` — `db` (Postgres 16) + `app` (API serving built client)

Self-host packaging for department IT (installers, TLS, ops UX) is a separate workstream.

## License

Copyright (c) 2017 Benjamin Singleton.
