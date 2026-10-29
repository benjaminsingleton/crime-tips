# Backup and restore

Tip data lives in **Postgres** (`pgdata` volume) and **upload files** (`uploads` volume). Back up both together.

## Objectives (agency-owned)

Document your own targets; starters for a small department:

| Term | Starter guidance |
|------|------------------|
| **RPO** | Daily backup ⇒ up to ~24h data loss unless you run more often |
| **RTO** | Restore drill on staging until the tip list + one attachment work; aim for a practiced procedure, not a guess |
| **Off-box** | Copy `backups/<stamp>/` off the VM (agency backup agent, S3-compatible, tape) |
| **Encryption** | Encrypt at rest (host disk encryption and/or encrypted archive) if policy requires |

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

Optional retention (deletes older local stamp dirs):

```bash
BACKUP_KEEP_DAYS=14 WITH_PROD=1 ./scripts/backup.sh
```

### Example daily cron

```bash
# /etc/cron.d/crime-tips-backup  (adjust user and path)
15 2 * * * root cd /opt/crime-tips && WITH_PROD=1 BACKUP_KEEP_DAYS=14 ./scripts/backup.sh >> /var/log/crime-tips-backup.log 2>&1
```

After cron runs, confirm the newest stamp directory exists, `MANIFEST.txt` is non-empty, and your off-box copy job picked it up.

## Restore drill

1. Prefer restoring on a staging clone first
2. Stop traffic / stop `app` (script does this)
3. Run:

```bash
WITH_PROD=1 ./scripts/restore.sh backups/YYYYMMDDTHHMMSSZ
# type: restore
```

4. **Verify:** tip list in officer UI; open one tip; download an attachment; `curl -fsS https://$DOMAIN/api/health`
5. Document the drill date for audit (quarterly recommended)

## Notes

- Volume names default to `<compose-project>_uploads`. Override with `UPLOADS_VOLUME` / `COMPOSE_PROJECT_NAME` if your project name differs.
- Encrypt backup directories at rest if agency policy requires it (host disk encryption or encrypted archive).
- Retention of tips vs backups is a records decision — [privacy-model.md](./privacy-model.md).
