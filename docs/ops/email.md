# Email notifications (new tips)

**Limits:** Tipster email is **not** implemented. Password-reset email is **not** implemented. Notification messages never include tip narrative or attachments. **SMTP support requires a post-`v1.0.0` image** (`:master` or a newer release) — [install.md § Version alignment](./install.md#version-alignment).

When a tip is **submitted**, the API emails every **active** officer account with **Email notifications** enabled (`users.notifications = true`). Tip body text is never included in the message — only the tip id and (when configured) a dashboard link.

Officers toggle notifications under **My Settings**, or admins set **Notifications?** in Account Management.

## Configure SMTP

Copy values into `.env` (Compose already passes `SMTP_*` into the `app` service):

```bash
SMTP_HOST=smtp.example.gov
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=crime-tips@example.gov
SMTP_PASS=...
SMTP_FROM="Crime Tips <crime-tips@example.gov>"
```

| Variable | Required | Notes |
|----------|----------|-------|
| `SMTP_HOST` | Yes (to send) | If empty/unset, mail is **not** sent; the API logs an `[email stub]` line instead |
| `SMTP_PORT` | No | Default `587` (STARTTLS). Use `465` with `SMTP_SECURE=true` for implicit TLS |
| `SMTP_SECURE` | No | `true` only for port 465-style TLS-from-connect |
| `SMTP_USER` / `SMTP_PASS` | Often | Omit both if the relay allows unauthenticated submission from the app host |
| `SMTP_FROM` | Recommended | Envelope/from address your agency allows; default `noreply@crimetips.local` |
| `PUBLIC_ORIGIN` | Recommended | First origin becomes the tip link in the email (`https://tips.example.gov/tip/<id>`) |

Restart the app after changing env:

```bash
# production overlay
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d app

# local compose
docker compose up -d app
```

On boot the API logs either `Email notifications: SMTP enabled (host:port)` or that SMTP is unset and stubs will be used.

## Stub mode (no SMTP)

Leave `SMTP_HOST` empty for local/dev or until the agency relay is ready. Submitting a tip still succeeds; the container logs something like:

```text
[email stub] SMTP unset; would notify { tipId, recipientCount, recipients, subject, text }
```

Use that to confirm who would have been emailed without talking to a real MTA.

## Deliverability (SPF / DKIM / DMARC)

Agency IT should align DNS with the address in `SMTP_FROM`:

- **SPF** — include the SMTP relay (or the host that submits mail) in the domain’s SPF record
- **DKIM** — sign outbound mail on the relay if your MTA supports it
- **DMARC** — policy aligned with SPF/DKIM once both pass

Without these, messages often land in spam or are rejected. Prefer the department’s existing authenticated relay over a random public SMTP host.

## Smoke test

1. Ensure at least one active officer has notifications on (seeded admin defaults to on).
2. Submit a tip from the public form.
3. With SMTP set: that officer receives **New Crime Tip** with the tip id (and link if `PUBLIC_ORIGIN` is set).
4. With SMTP unset: `docker compose logs app` shows `[email stub]`.
5. Turn notifications **off** for an account and submit again — that address should not appear in stub recipients / should not get mail.

## Privacy notes

- Emails go **one recipient per message** (addresses are not listed to other officers).
- Tip narrative, attachments, and tipster fields are **not** put in email.
- Password reset email is **not** implemented yet; admins reset passwords in Account Management.
