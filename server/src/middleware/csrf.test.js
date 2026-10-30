import assert from 'node:assert/strict';
import { isAllowedOrigin, configuredOrigins } from './csrf.js';

assert.deepEqual(configuredOrigins({ PUBLIC_ORIGIN: 'https://a.example, https://b.example' }), [
  'https://a.example',
  'https://b.example',
]);

const req = {
  headers: { host: 'tips.example.gov', 'x-forwarded-proto': 'https' },
};
assert.equal(
  isAllowedOrigin('https://tips.example.gov', req, { PUBLIC_ORIGIN: '' }),
  true,
);
assert.equal(
  isAllowedOrigin('https://evil.example', req, { PUBLIC_ORIGIN: 'https://tips.example.gov' }),
  false,
);
assert.equal(
  isAllowedOrigin('https://portal.example.gov', req, {
    PUBLIC_ORIGIN: 'https://portal.example.gov',
  }),
  true,
);

console.log('csrf.test.js: ok');
