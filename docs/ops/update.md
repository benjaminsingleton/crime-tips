# Update (police department IT)

Keep production on a **pinned GHCR image tag**. Do not run `git pull` on `master` and rebuild casually.

**Do not mix** checkout and image tags (e.g. `v1.1.3` docs with `:1.0.0`). Match checkout ↔ image ↔ [CHANGELOG](../../CHANGELOG.md). Alignment table: [install.md § Version alignment](./install.md#version-alignment).

## Image name and tags

| Item | Value |
|------|--------|
| Registry | GitHub Container Registry (GHCR) |
| Image | `ghcr.io/benjaminsingleton/crime-tips` |
| Release tags | Semver from Git tags `vX.Y.Z` → `:X.Y.Z`, also `:X.Y` and `:latest` |
| Branch builds | `:master` and `:sha-<short>` (optional / pre-release; prefer a release tag for long-term prod) |

Pin with `CRIME_TIPS_IMAGE` in `.env`, for example:

```bash
CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.1.3
```

List releases: https://github.com/benjaminsingleton/crime-tips/releases  
Packages: https://github.com/benjaminsingleton/crime-tips/pkgs/container/crime-tips  
Read the notes for the **specific** tag you are moving to before updating.

**Visibility:** GHCR packages often start **private**. Departments need either a **Public** package or `docker login ghcr.io` with `read:packages`. Maintainer steps to publish and flip visibility: [ghcr.md](./ghcr.md).

If pulls fail with `unauthorized`, the package may still be private: in GitHub → Packages → crime-tips → Package settings → change visibility to **Public**, or `docker login ghcr.io` with a PAT that has `read:packages`. See [troubleshooting.md](./troubleshooting.md).

## Before every update

1. Read the release notes / [CHANGELOG.md](../../CHANGELOG.md) for that tag (schema / breaking changes).
2. Prefer a staging clone when you have one.
3. **Backup** Postgres + uploads: `./scripts/backup.sh` (see [backup-restore.md](./backup-restore.md)).

## Update to a new release (recommended)

From the install directory (e.g. `/opt/crime-tips`):

```bash
./scripts/backup.sh
./scripts/update.sh v1.2.3
```

What the script does:

1. Writes `CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.2.3` into `.env` (leading `v` optional)
2. `docker compose … pull app`
3. `docker compose … up -d` (recreates app; DB volume preserved)
4. Waits for `/api/health`

Manual equivalent:

```bash
# edit .env → CRIME_TIPS_IMAGE=ghcr.io/benjaminsingleton/crime-tips:1.2.3
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull app
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
curl -fsS "https://$DOMAIN/api/health"
```

Compose applies additive SQL on boot (`server/sql/`). Breaking schema changes are called out in the release notes.

## Rollback

1. Point `CRIME_TIPS_IMAGE` at the previous tag (or `./scripts/update.sh v1.2.2`).
2. If data was migrated in a breaking way, restore the pre-update backup first ([backup-restore.md](./backup-restore.md)), then start the older image.

## Build from source (air-gap / audit)

Keep the Dockerfile path for offline or audited builds:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  -f docker-compose.build.yml up -d --build
```

Or: `CRIME_TIPS_BUILD=1 ./scripts/update.sh`

For a true air-gap: on a connected machine `docker pull` the release tag, `docker save` to a `.tar`, copy to the host, `docker load`, set `CRIME_TIPS_IMAGE` to that tag, then `compose up -d` (no pull required if the image is already local; set `CRIME_TIPS_PULL_POLICY=never` if needed).

## Local developers

Unchanged — build on the machine:

```bash
docker compose up --build
```

Do not use the prod GHCR pin for day-to-day UI/API development.
