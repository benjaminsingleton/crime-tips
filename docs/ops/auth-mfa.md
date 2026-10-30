# Officer authentication: TOTP MFA and optional OIDC SSO

Local email/password login remains the default. Officers can add **TOTP** multi-factor authentication (Google Authenticator, Authy, 1Password, etc.) from **My Settings**. Large departments can also enable **OpenID Connect (OIDC)** single sign-on via environment variables without removing the password path.

**Limits:** SAML is **not** implemented. Tipster (public) flows have no login. Password-reset email is **not** implemented — admins reset passwords in Account Management ([user-admin.md](./user-admin.md)). **OIDC requires `v1.1.0+`** (`:1.1.0` or later); TOTP MFA is in `v1.0.0+`. See [install.md § Version alignment](./install.md#version-alignment).

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
- OIDC SSO sessions also require enrollment when this flag is set (redirect to **My Settings** after first SSO login).

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

## Password login (unchanged by default)

Keep using `/login` with email + password. MFA is an extra step only when that account has enrolled (or when `MFA_REQUIRED` forces enrollment).

When OIDC is enabled, the login page also shows **Sign in with agency SSO**. Password login stays available unless you set `OIDC_ALLOW_PASSWORD=false`.

---

## Optional OIDC SSO (agency IdP)

SSO is **off** until you set an issuer and client id. Small departments can ignore these variables entirely.

### 1. Register the app at your IdP

Create a confidential (or public PKCE) OIDC client:

| Setting | Value |
|---------|--------|
| Application type | Web / confidential client (recommended) |
| Redirect URI | `https://tips.example.gov/api/auth/oidc/callback` |
| Grant | Authorization code |
| PKCE | S256 (Crime Tips always sends PKCE) |
| Scopes | at least `openid` `email` (and `profile` if you want names for auto-provision) |

Replace the hostname with your `PUBLIC_ORIGIN` / `DOMAIN`.

### 2. Configure Crime Tips

In `.env` (then recreate/restart `app`):

```bash
PUBLIC_ORIGIN=https://tips.example.gov

OIDC_ISSUER=https://login.example.gov/realms/pd
OIDC_CLIENT_ID=crime-tips
OIDC_CLIENT_SECRET=your-client-secret
# Optional — defaults to ${PUBLIC_ORIGIN}/api/auth/oidc/callback
# OIDC_REDIRECT_URI=https://tips.example.gov/api/auth/oidc/callback
```

Minimal enable rule: **`OIDC_ISSUER` + `OIDC_CLIENT_ID`**. Set `OIDC_ENABLED=false` to force-disable without clearing the other vars.

| Variable | Default | Purpose |
|----------|---------|---------|
| `OIDC_ISSUER` | — | IdP issuer URL (discovery: `/.well-known/openid-configuration`) |
| `OIDC_CLIENT_ID` | — | Client id from the IdP |
| `OIDC_CLIENT_SECRET` | empty | Client secret (omit only if the IdP allows public PKCE clients) |
| `OIDC_REDIRECT_URI` | `{PUBLIC_ORIGIN}/api/auth/oidc/callback` | Must match IdP registration exactly |
| `OIDC_SCOPES` | `openid email profile` | Space-separated scopes |
| `OIDC_EMAIL_CLAIM` | `email` | Claim used to match officers |
| `OIDC_BUTTON_LABEL` | `Sign in with agency SSO` | Login button text |
| `OIDC_ALLOW_PASSWORD` | `true` | `false` = hide email/password (SSO only) |
| `OIDC_AUTO_PROVISION` | `false` | `true` = create a non-admin officer on first SSO if email is unknown |
| `OIDC_DEFAULT_RANK` | `Officer` | Rank for auto-provisioned users |
| `OIDC_ENABLED` | implied true when issuer+client set | Set `false` to disable SSO |
| `OIDC_ALLOW_INSECURE` | `false` | Allow `http://` IdP discovery — **dev only** |
| `OIDC_REQUIRE_EMAIL_VERIFIED` | `true` | Require IdP `email_verified` before email link / auto-provision |

### 3. How accounts are linked

1. Match existing user by IdP `sub` (`users.oidc_sub`).
2. Else match by email (case-insensitive) **only if** `email_verified` is true (unless `OIDC_REQUIRE_EMAIL_VERIFIED=false`), and store `oidc_sub` for next time.
3. Else, if `OIDC_AUTO_PROVISION=true`, create an active non-admin officer with that email (same verified-email rule).
4. Else, show an error: ask an admin to create the officer account first (recommended for LE).

**Recommended for police departments:** keep `OIDC_AUTO_PROVISION=false` and create officers in **Account Management** with the same work email the IdP asserts.

### 4. MFA and SSO together

- **Password login:** local TOTP challenge still applies when the account has MFA enrolled.
- **OIDC login:** Crime Tips does **not** prompt for local TOTP after a successful IdP login (the IdP is expected to enforce MFA). Agency `MFA_REQUIRED=true` still forces local enrollment so password fallback stays strong.
- Tipster (public) flows are unchanged — SSO is officer-only.

### 5. Smoke test

1. Restart `app` after setting OIDC env vars.
2. Open `/login` — SSO button appears.
3. Complete IdP login for an officer whose email already exists → land on dashboard (httpOnly session cookie).
4. Confirm password login still works for a test account (unless `OIDC_ALLOW_PASSWORD=false`).
5. `GET /api/auth/oidc/status` → `{"enabled":true,"allowPassword":true,...}` (no secrets).

### 6. Troubleshooting

| Symptom | Check |
|---------|--------|
| No SSO button | `OIDC_ISSUER` / `OIDC_CLIENT_ID` set? Container restarted? `OIDC_ENABLED` not `false`? |
| Redirect URI mismatch | IdP app registration must match `OIDC_REDIRECT_URI` or `{PUBLIC_ORIGIN}/api/auth/oidc/callback` |
| “No Crime Tips account matches” | Create the officer with the IdP email, or enable `OIDC_AUTO_PROVISION` |
| Discovery / TLS errors | Issuer must be HTTPS in production; `OIDC_ALLOW_INSECURE` is for local http IdPs only |
| CORS / cookie issues after SSO | Same-origin via Caddy is preferred; set `PUBLIC_ORIGIN` and `TRUST_PROXY=true` behind the proxy |

SAML is **not** implemented in this release; use an IdP that speaks OIDC, or a SAML→OIDC bridge.
