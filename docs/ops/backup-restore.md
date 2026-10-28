# Backup and restore

Tip data lives in **Postgres** (`pgdata` volume) and **upload files** (`uploads` volume). Back up both together.

## Backup

With the stack running:

```bash
# Developer compose
./scripts/backup.sh

# Production overlay project
WITH_PROD=1 ./scripts/backup.sh
```

Creates `backups/<UTC-stamp>/`:

- `postgres.dump` — `pg_dump -Fc`
- `uploads.tar.gz` — contents of the uploads volume
- `MANIFEST.txt`

Copy the directory off-box (agency backup agent, S3-compatible storage, tape). Optional retention:

```bash
BACKUP_KEEP_DAYS=14 WITH_PROD=1 ./scripts/backup.sh
```

Suggested schedule: daily cron on the host.

## Restore drill

1. Prefer restoring on a staging clone first
2. Stop traffic / stop `app` (script does this)
3. Run:

```bash
WITH_PROD=1 ./scripts/restore.sh backups/YYYYMMDDTHHMMSSZ
# type: restore
```

4. Confirm tip list + an attachment download in the officer UI
5. Document the drill date for audit

## Notes

- Volume names default to `<compose-project>_uploads`. Override with `UPLOADS_VOLUME` / `COMPOSE_PROJECT_NAME` if your project name differs.
- Encrypt backup directories at rest if agency policy requires it (host disk encryption or encrypted archive).
