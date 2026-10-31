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
| **Secrets** | Do **not** include `.env` in unencrypted off-box sync; encrypt the archive if policy requires a copy |

## Backup

With the stack running:

```bash
# Developer compose
./scripts/backup.sh

# Production overlay project (required when you used docker-compose.prod.yml)
WITH_PROD=1 ./scripts/backup.sh
```

Creates `backups/<UTC-stamp>/` only after a successful dump + uploads archive (failed runs do not leave 0-byte `postgres.dump` stamp dirs):

- `postgres.dump` — `pg_dump -Fc` (must be non-zero size)
- `uploads.tar.gz` — contents of the uploads volume
- `MANIFEST.txt` — includes byte sizes

Optional retention (deletes older local stamp dirs):

```bash
BACKUP_KEEP_DAYS=14 WITH_PROD=1 ./scripts/backup.sh
```

### Verify backup (before off-box copy)

```bash
stamp=backups/YYYYMMDDTHHMMSSZ   # newest stamp
test -s "$stamp/postgres.dump"
tar tzf "$stamp/uploads.tar.gz" | head
test -s "$stamp/MANIFEST.txt"
# then copy $stamp off-box, e.g.:
# scp -r "$stamp" backup-host:/secure/crime-tips/
```

### Example daily cron

```bash
# /etc/cron.d/crime-tips-backup  (adjust user and path)
15 2 * * * root cd /opt/crime-tips && WITH_PROD=1 BACKUP_KEEP_DAYS=14 ./scripts/backup.sh >> /var/log/crime-tips-backup.log 2>&1
```

After cron runs, confirm the newest stamp directory exists, `postgres.dump` is non-zero, `MANIFEST.txt` is non-empty, and your off-box copy job picked it up. Schedule backups **before** accepting real tips in production.

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

Restore refuses 0-byte dumps. For non-interactive drills only: `printf 'restore\n' | WITH_PROD=1 ./scripts/restore.sh backups/…` (prefer the interactive prompt in production).

## Notes

- Volume names default to `<compose-project>_uploads` (often `crime-tips_uploads` when the install dir is `/opt/crime-tips`). Override with `UPLOADS_VOLUME` / `COMPOSE_PROJECT_NAME` if your project directory name differs.
- Encrypt backup directories at rest if agency policy requires it (host disk encryption or encrypted archive).
- Retention of tips vs backups is a records decision — [privacy-model.md](./privacy-model.md).
