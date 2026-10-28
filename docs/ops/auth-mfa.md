# Officer authentication: TOTP MFA (and SSO follow-up)

Local email/password login remains the default. Officers can add **TOTP** multi-factor authentication (Google Authenticator, Authy, 1Password, etc.) from **My Settings**.

## Enable MFA (per officer)

1. Log in with email + password.
2. Open **My Settings**.
3. Under **Two-factor authentication**, click **Set up authenticator**.
4. Scan the QR code (or enter the secret) in your authenticator app.
5. Enter the 6-digit code to confirm.
6. **Save the backup codes** shown once — each code works one time if the app is lost.

On the next login: password → then the 6-digit code (or a backup code). Password-only accounts are unchanged until they enroll.

## Require MFA for all officers (agency policy)

In `.env`:

```bash
MFA_REQUIRED=true
```

Restart the `app` container. Effects:

- After password login, officers without MFA are sent to **My Settings** to enroll.
- Dashboard / tips / admin APIs return `403` with `mfaEnrollmentRequired` until MFA is enabled.
- Officers cannot self-disable MFA while this flag is set.
- Admins can still **Reset MFA** on an account (lost phone) from Account Management; the officer must re-enroll.

Optional tuning:

| Variable | Default | Purpose |
|----------|---------|---------|
| `MFA_REQUIRED` | unset / false | Force enrollment for every officer |
| `MFA_ISSUER` | `Crime Tips` | Label shown in authenticator apps |
| `MFA_PENDING_TTL_SEC` | `300` | How long the post-password MFA challenge token lasts |

Secrets are encrypted at rest with a key derived from `JWT_SECRET`. Rotating `JWT_SECRET` invalidates sessions **and** decryptable MFA secrets — officers would need an admin MFA reset and re-enroll. Prefer rotating only when necessary; document the reset procedure in your runbook.

## Admin: lost authenticator

1. Sign in as an admin who still has MFA (if required).
2. **Account Management** → Edit user → **Reset MFA**.
3. Officer sets a new authenticator under **My Settings**.

## Password login (unchanged)

Keep using `/login` with email + password. MFA is an extra step only when that account has enrolled (or when `MFA_REQUIRED` forces enrollment).

## SSO (OIDC / SAML) — follow-up

Agency IdP single sign-on is **not** in this release. Planned as a later env-gated option (`OIDC_ISSUER`, `OIDC_CLIENT_ID`, …) that keeps password login as a fallback for small PDs without an IdP. Prefer shipping TOTP first for self-hosted departments that have no central IdP today.
