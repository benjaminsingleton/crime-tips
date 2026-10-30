import assert from 'node:assert/strict';
import { validateProductionSecrets } from './secrets.js';

const base = {
  JWT_SECRET: 'a'.repeat(40),
  POSTGRES_PASSWORD: 'strong-db-pass-not-default',
};

assert.deepEqual(validateProductionSecrets(base), []);

const insecure = validateProductionSecrets({
  ...base,
  OIDC_ALLOW_INSECURE: 'true',
});
assert.ok(insecure.some((p) => p.includes('OIDC_ALLOW_INSECURE')));

console.log('secrets.test.js: ok');
