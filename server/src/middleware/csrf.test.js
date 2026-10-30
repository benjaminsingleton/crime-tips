import assert from 'node:assert/strict';
import {
  isAllowedOrigin,
  configuredOrigins,
  requestHostOrigins,
  isLocalDevOrigin,
  csrfIsProduction,
} from './csrf.js';

assert.deepEqual(configuredOrigins({ PUBLIC_ORIGIN: 'https://a.example, https://b.example' }), [
  'https://a.example',
  'https://b.example',
]);

assert.equal(csrfIsProduction({ CRIME_TIPS_ENV: 'development', NODE_ENV: 'production' }), false);
assert.equal(csrfIsProduction({ CRIME_TIPS_ENV: 'production', NODE_ENV: 'production' }), true);

const prodReq = {
  headers: { host: 'tips.example.gov', 'x-forwarded-proto': 'https' },
};
assert.equal(
  isAllowedOrigin('https://tips.example.gov', prodReq, { PUBLIC_ORIGIN: '', CRIME_TIPS_ENV: 'production' }),
  true,
);
assert.equal(
  isAllowedOrigin('https://evil.example', prodReq, {
    PUBLIC_ORIGIN: 'https://tips.example.gov',
    CRIME_TIPS_ENV: 'production',
  }),
  false,
);
assert.equal(
  isAllowedOrigin('https://portal.example.gov', prodReq, {
    PUBLIC_ORIGIN: 'https://portal.example.gov',
    CRIME_TIPS_ENV: 'production',
  }),
  true,
);

// Compose-style: NODE_ENV=production but CRIME_TIPS_ENV=development over HTTP
const localHttpReq = {
  headers: { host: 'localhost:8080' },
  secure: false,
};
assert.deepEqual(
  requestHostOrigins(localHttpReq, {
    CRIME_TIPS_ENV: 'development',
    NODE_ENV: 'production',
  }).sort(),
  ['http://localhost:8080', 'https://localhost:8080'].sort(),
);
assert.equal(
  isAllowedOrigin('http://localhost:8080', localHttpReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'development',
    NODE_ENV: 'production',
  }),
  true,
);

// Vite :5173 → API :3000 in development
const apiReq = { headers: { host: 'localhost:3000' }, secure: false };
assert.equal(
  isAllowedOrigin('http://localhost:5173', apiReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'development',
    NODE_ENV: 'production',
  }),
  true,
);
assert.equal(isLocalDevOrigin(new URL('http://localhost:5173')), true);

// Production must NOT allow random localhost
assert.equal(
  isAllowedOrigin('http://localhost:5173', apiReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'production',
    NODE_ENV: 'production',
  }),
  false,
);

// Same Host:port, scheme mismatch (HTTP Origin vs NODE_ENV-forced https footgun)
assert.equal(
  isAllowedOrigin('http://localhost:8080', localHttpReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'production',
    NODE_ENV: 'production',
  }),
  true,
);

console.log('csrf.test.js: ok');
