# Department branding (no fork)

Configure the public tip site and officer shell with your agency name, logo, and colors without changing application code.

Resolution order (later wins):

1. Built-in defaults (Gotham Crime Tips / navy `#102033` / gold `#b8974a`)
2. Environment variables (Compose / `.env`)
3. Admin overrides stored in Postgres (`Branding` in the officer UI)

## Option A — environment (deploy-time)

Set in `.env` (passed through Compose):

| Variable | Purpose | Example |
|----------|---------|---------|
| `BRAND_NAME` | Site / department name in nav + hero | `Springfield PD Crime Tips` |
| `BRAND_TAGLINE` | Small label under the name | `Police tip line` |
| `BRAND_LOGO_URL` | Logo image URL (https or same-origin path) | `https://example.gov/seal.png` |
| `BRAND_PRIMARY_COLOR` | Navy / primary hex | `#0b3d5c` |
| `BRAND_ACCENT_COLOR` | Gold / accent hex | `#c4a35a` |

`DEPARTMENT_NAME` is accepted as an alias for `BRAND_NAME`.

```bash
# after editing .env
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d app
```

## Option B — admin UI (no redeploy)

1. Sign in as an admin officer
2. Open **Branding** in the header
3. Set name, tagline, colors; upload a logo (PNG/JPEG/WebP/GIF/SVG, ≤2 MB) or paste an https URL
4. **Save branding** — the tip site and officer shell refresh immediately

**Reset to env / defaults** clears database overrides and any uploaded logo so env values apply again.

## API

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `GET` | `/api/branding` | Public | Resolved branding for the SPA |
| `GET` | `/api/branding/logo` | Public | Streamed uploaded logo file |
| `GET` | `/api/branding/admin` | Admin | Resolved + raw overrides + env layer |
| `PUT` | `/api/branding` | Admin | Merge overrides |
| `DELETE` | `/api/branding` | Admin | Clear overrides + uploaded logo |
| `POST` | `/api/branding/logo` | Admin | Multipart field `logo` |
| `DELETE` | `/api/branding/logo` | Admin | Remove uploaded logo |

Uploaded logos live under `UPLOAD_DIR/branding/` (Compose volume `uploads`).
