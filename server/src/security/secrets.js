/**
 * Production secret validation — refuse weak / example defaults at boot.
 */

const WEAK_JWT = new Set([
  '',
  'change-me-in-production',
  'replace-with-a-long-random-string',
  'dev-insecure-secret-change-me',
  'secret',
  'jwt-secret',
]);

const WEAK_ADMIN_PASSWORDS = new Set([
  '',
  'changeme',
  'change-me',
  'password',
  'admin',
  'admin123',
]);

const WEAK_DB_PASSWORDS = new Set([
  '',
  'crimetips',
  'postgres',
  'password',
  'changeme',
]);

/**
 * Production hardening gate.
 * Prefer CRIME_TIPS_ENV so the runtime image can keep NODE_ENV=production
 * (npm/express norms) while local `docker compose up` stays developer-friendly.
 * Explicit CRIME_TIPS_ENV=development always opts out; unset falls back to NODE_ENV.
 */
export function isProductionEnv() {
  const mode = (process.env.CRIME_TIPS_ENV || '').trim().toLowerCase();
  if (mode === 'production') return true;
  if (mode === 'development' || mode === 'dev') return false;
  return process.env.NODE_ENV === 'production';
}

function passwordFromDatabaseUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.password ? decodeURIComponent(u.password) : null;
  } catch {
    return null;
  }
}

/**
 * Throws / returns error messages if secrets are unsafe for production.
 * @returns {string[]} list of problems (empty = ok)
 */
export function validateProductionSecrets(env = process.env) {
  const problems = [];

  const jwt = (env.JWT_SECRET || '').trim();
  if (!jwt || WEAK_JWT.has(jwt) || jwt.length < 32) {
    problems.push(
      'JWT_SECRET must be set to a strong value (≥32 characters) and must not match example defaults',
    );
  }

  const dbPass =
    (env.POSTGRES_PASSWORD || '').trim() ||
    passwordFromDatabaseUrl(env.DATABASE_URL) ||
    '';
  if (!dbPass || WEAK_DB_PASSWORDS.has(dbPass)) {
    problems.push(
      'POSTGRES_PASSWORD (or password in DATABASE_URL) must not use example/default values',
    );
  }

  const adminPass = (env.ADMIN_PASSWORD || '').trim();
  // Only refuse when an admin password is still provided as a weak example.
  // After first seed, operators should remove ADMIN_PASSWORD from .env.
  if (adminPass && WEAK_ADMIN_PASSWORDS.has(adminPass)) {
    problems.push(
      'ADMIN_PASSWORD must not use example defaults (changeme). Generate a strong password or remove ADMIN_PASSWORD after the first admin is seeded',
    );
  }

  return problems;
}

export function assertSafeSecretsOrExit() {
  if (!isProductionEnv()) return;

  const problems = validateProductionSecrets();
  if (problems.length === 0) return;

  console.error('Refusing to start: unsafe production secrets detected:');
  for (const p of problems) {
    console.error(`  - ${p}`);
  }
  console.error(
    'Fix .env (see scripts/gen-secrets.sh and docs/ops/hardening.md), then restart.',
  );
  process.exit(1);
}

export function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim()) return secret;

  if (isProductionEnv()) {
    console.error('JWT_SECRET is required in production');
    process.exit(1);
  }

  console.warn(
    'WARNING: JWT_SECRET unset; using insecure development fallback. Do not use in production.',
  );
  return 'dev-insecure-secret-change-me';
}
