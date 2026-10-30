# User administration (officers & admins)

Officer accounts are managed in the app (**Account Management**, admin only). There is **no** password-reset email; admins set passwords in the UI.

## Seeded admin (first boot)

When the `users` table is empty, the API seeds one admin from env:

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAIL` | Login email |
| `ADMIN_PASSWORD` | Initial password (remove from `.env` after change) |
| `ADMIN_RANK` / `ADMIN_FIRST_NAME` / `ADMIN_LAST_NAME` | Display fields |

After first login: **change the password in the UI**, then delete `ADMIN_PASSWORD` from `.env` and recreate the `app` container so the secret is not kept on disk. See [install.md](./install.md).

## Create an officer

1. Sign in as admin → **Account Management**.
2. Create user: email, password, rank, first/last name; optionally mark **admin**.
3. New officers default to **active** with notifications on (they can turn notifications off under **My Settings**).

Prefer creating accounts with the same work email your IdP will assert if you plan OIDC later.

## Disable an account

In **Account Management**, set the user inactive (`accountActive` / active toggle). Disabled officers cannot use the dashboard. Prefer disable over delete for audit continuity.

## Reset password (no email flow)

Password-reset email is **not implemented**. Passwords must be **at least 10 characters**.

1. Admin → **Account Management** → set a new password for the officer, **or**
2. Officer changes their own password under **My Settings** (requires **current password**, plus a TOTP/backup code when MFA is enrolled).

Communicate the temporary password out of band (phone, in person, agency password tool). Self email changes use the same re-auth rules.

## MFA reset (lost authenticator)

1. Admin with working MFA (when `MFA_REQUIRED=true`) → **Account Management** → **Reset MFA**.
2. Officer enrolls again under **My Settings**.

If `MFA_REQUIRED=true`, officers cannot self-disable MFA; admin reset is the recovery path and itself requires the admin to be MFA-enrolled. Details: [auth-mfa.md](./auth-mfa.md).

## SSO-only / break-glass

When `OIDC_ALLOW_PASSWORD=false`, email/password login is hidden. **Keep at least one break-glass admin** with password login available unless policy forbids it — for example temporarily set `OIDC_ALLOW_PASSWORD=true`, fix IdP issues, then tighten again.

Recommended: `OIDC_AUTO_PROVISION=false` and create officers explicitly before first SSO. See [auth-mfa.md](./auth-mfa.md).

## Related

- [privacy-model.md](./privacy-model.md) — who can see tip content  
- [hardening.md](./hardening.md) — MFA enrollment, unused accounts  
- [troubleshooting.md](./troubleshooting.md) — lockouts and cookie/SSO issues  
