# Privacy and anonymity model

Honest framing for agencies and public-affairs review. Crime Tips supports **anonymous tip intake**; it does **not** guarantee tipster anonymity against all technical or legal means.

## Roles

| Role | What they see / control |
|------|-------------------------|
| **Tipster** (public) | Tip wizard; optional contact fields; receipt id after submit |
| **Officer** | Full tip content, attachments, notes, tipster-provided contact if entered |
| **Admin** | Officer accounts, MFA reset, branding (when available) |
| **Agency IT** | Host, Postgres, uploads volume, reverse-proxy / Caddy logs, backups |

The **agency is the data controller**. This software stores tip data on **your** VM and volumes; maintainers do not receive tip content.

## What “anonymous” means here

- Tipsters are **not required** to create an account or provide a name, phone, or email.
- Tipsters **may opt in** to contact details. If they do, officers see those fields with the tip.
- Submitted tips, drafts, attachments, and officer notes live in **agency Postgres** and the **uploads** volume. Officers with dashboard access can read tip content.
- Notification emails (when SMTP is configured) include tip id and a dashboard link — **never** the tip narrative or attachments. See [email.md](./email.md).

## What may still identify or locate a tipster

Agencies should assume the following may exist outside the tip form’s “anonymous” UX:

| Source | Risk |
|--------|------|
| Reverse proxy / Caddy / agency TLS terminator logs | Client IP, User-Agent, request path/time |
| Application rate limits (`TRUST_PROXY` / `X-Forwarded-For`) | IP used for abuse control may be logged or retained by infrastructure |
| Draft edit tokens | Unguessable tokens returned to the tipster browser for unsubmitted drafts — protect like a secret if retained |
| Optional tipster contact fields | Direct PII when the tipster chooses to provide them |
| Attachments (photos, video, documents) | May contain EXIF, faces, locations, account identifiers |
| Officer activity logs | Account actions around tips (for accountability) |
| Backups | Full copies of DB + uploads until your retention deletes them |

**Do not** market Crime Tips as “untraceable” or “no logs.” Align public messaging with this page.

## Compliance boundaries

- **Not CJIS certified** (and not claimed elsewhere). See [SECURITY.md](../../SECURITY.md).
- Records / FOIA / discovery / retention policies are **agency-owned**. This app does not implement automated legal-hold or purge workflows beyond what you operate (DB deletes, volume lifecycle, backup retention).

## Retention starters (agency policy)

Decide and document (examples only — not legal advice):

1. How long **submitted tips** and attachments stay online vs archive.
2. Whether **abandoned drafts** are purged on a schedule.
3. Retention for **officer activity logs**.
4. Backup retention (`BACKUP_KEEP_DAYS`) and encrypted off-box copies — [backup-restore.md](./backup-restore.md).
5. Who may export or screenshot tip content.

## Related

- [hardening.md](./hardening.md) — claims / non-claims and ops checklist  
- [user-admin.md](./user-admin.md) — who can access tips  
- [pd-evaluation.md](./pd-evaluation.md) — one-page evaluator summary  
