# Draft retention and purge

Crime Tips can automatically delete **unsubmitted** tip drafts (and their upload files) after a configurable age. Submitted tips are never purged by this job.

## Why

Abandoned drafts hold tipster PII and consume disk. The [privacy model](./privacy-model.md) expects agencies to decide draft retention; this job enforces that policy.

## Configuration

| Variable | Default | Meaning |
|----------|---------|---------|
| `DRAFT_RETENTION_DAYS` | `30` | Delete unsubmitted tips whose `updated_at` (else `created_at`) is older than this many days. Set `0` to disable the scheduler and refuse live purge. |
| `DRAFT_PURGE_INTERVAL_HOURS` | `24` | How often the API process runs the purge after boot. |

Set these in `.env` (see `.env.example`). The API also runs a first purge ~15 seconds after boot when retention is enabled.

## What gets deleted

For each matching unsubmitted tip:

1. Files under `uploads/<tip-id>/` (if present)
2. The `tips` row (CASCADE removes `tip_attachments` and `tip_notes`)

Activity logs that referenced the tip keep `tip_id = NULL` (`ON DELETE SET NULL`). A `draftPurge` activity row is written when a live purge deletes at least one tip.

## Admin controls

Admins → **Audit** → **Abandoned draft retention**:

- View last-run metrics (candidates, deleted count, dry-run flag, errors)
- **Dry run** — count candidates without deleting (`POST /api/admin/draft-purge` with `dryRun: true`)
- **Purge now** — live delete (`dryRun: false`); blocked when retention is disabled

Dashboard metrics for admins also include a `draftPurge` object from `GET /api/metrics`.

## Interaction with backups

- Purge only affects the live database and uploads volume.
- Backups taken **before** a purge still contain deleted drafts until those backup files age out (`BACKUP_KEEP_DAYS` — see [backup-restore.md](./backup-restore.md)).
- Restoring an older backup can resurrect purged drafts; run purge again after restore if policy requires it.
- Disk snapshots / volume snapshots are outside this job — rotate them per agency policy.

## Related

- [privacy-model.md](./privacy-model.md) — anonymity and retention starters  
- [backup-restore.md](./backup-restore.md) — backup retention  
- Product backlog item: abandoned-draft retention (P0)
