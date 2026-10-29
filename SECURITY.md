# Security policy

## Scope

Crime Tips is a **self-hosted** anonymous tip intake form and officer mailbox. Your agency runs the stack (VM, Docker, Postgres, uploads, TLS, backups). The project maintainers do **not** operate a managed SaaS for your data.

### What this project claims

- Practical production defaults for a small-department self-host (Safe Compose, strong-secret refusal, rate limits, Helmet, httpOnly sessions).
- Optional officer TOTP MFA and optional OIDC SSO.
- Ops runbooks for install, hardening, backup, and update.

### What this project does **not** claim

- **Not CJIS certified.** There is no CJIS (or similar) certification, audit package, or compliance attestation from this project. Agencies remain responsible for their own policy, accreditation, and records obligations.
- Not a managed security service, SOC, or 24/7 support contract.
- Not high availability / multi-node by default (single-node Docker Compose).
- Not SAML SSO (OIDC only), not tipster email, not password-reset email, not built-in malware scanning of uploads.

Hardening checklist: [docs/ops/hardening.md](docs/ops/hardening.md).  
Privacy / anonymity model: [docs/ops/privacy-model.md](docs/ops/privacy-model.md).

## Reporting a vulnerability

Please **do not** open a public tip or discussion that includes exploit details for a live agency deployment.

1. Prefer a **private** report when possible (email below).
2. Otherwise open a GitHub Issue on this repository and mark it clearly as a security concern; avoid pasting secrets, dump files, or working exploits in the public issue body.
3. Include: affected version / image tag, deployment mode (prod Compose vs local), and steps to reproduce at a high level.

**Contact**

| Channel | Address |
|---------|---------|
| Maintainer email | [benfsingleton@gmail.com](mailto:benfsingleton@gmail.com) |
| Repository Issues | https://github.com/benjaminsingleton/crime-tips/issues |

There is no dedicated security bounty program and no guaranteed SLA. Reasonable reports will be triaged as capacity allows.

## Supported versions

| Version / image | Status |
|-----------------|--------|
| Latest GitHub Release tag (`vX.Y.Z` → `:X.Y.Z`) | Supported for security fixes when feasible |
| `master` / `:master` | Pre-release / moving; use only if you accept churn |
| Older release tags | Best-effort; prefer updating |

Pin production to a release image tag and follow [docs/ops/update.md](docs/ops/update.md).
