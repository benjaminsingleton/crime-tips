import assert from 'node:assert/strict';
import {
  isAllowedOrigin,
  configuredOrigins,
  requestHostOrigins,
  isLocalDevOrigin,
  csrfIsProduction,
  csrfSchemeFlexible,
} from './csrf.js';

assert.deepEqual(configuredOrigins({ PUBLIC_ORIGIN: 'https://a.example, https://b.example' }), [
  'https://a.example',
  'https://b.example',
]);

assert.equal(csrfIsProduction({ CRIME_TIPS_ENV: 'development', NODE_ENV: 'production' }), false);
assert.equal(csrfIsProduction({ CRIME_TIPS_ENV: 'production', NODE_ENV: 'production' }), true);
assert.equal(csrfSchemeFlexible({ CRIME_TIPS_ENV: 'development', COOKIE_SAMESITE: 'lax' }), true);
assert.equal(csrfSchemeFlexible({ CRIME_TIPS_ENV: 'production', COOKIE_SAMESITE: 'lax' }), false);
assert.equal(
  csrfSchemeFlexible({ CRIME_TIPS_ENV: 'development', COOKIE_SAMESITE: 'none' }),
  false,
);

const prodReq = {
  headers: { host: 'tips.example.gov', 'x-forwarded-proto': 'https' },
};
assert.equal(
  isAllowedOrigin('https://tips.example.gov', prodReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'production',
  }),
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

// Production + XF-Proto=https: HTTP Origin on same host must NOT pass
assert.equal(
  isAllowedOrigin('http://tips.example.gov', prodReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'production',
  }),
  false,
);

// SameSite=none: also scheme-strict even if CRIME_TIPS_ENV=development
assert.equal(
  isAllowedOrigin('http://tips.example.gov', prodReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'development',
    COOKIE_SAMESITE: 'none',
  }),
  false,
);
assert.equal(
  isAllowedOrigin('https://tips.example.gov', prodReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'development',
    COOKIE_SAMESITE: 'none',
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

// Production without XF-Proto: HTTP Origin must not match invented https:// self
assert.equal(
  isAllowedOrigin('http://localhost:8080', localHttpReq, {
    PUBLIC_ORIGIN: '',
    CRIME_TIPS_ENV: 'production',
    NODE_ENV: 'production',
  }),
  false,
);
assert.deepEqual(
  requestHostOrigins(localHttpReq, {
    CRIME_TIPS_ENV: 'production',
    NODE_ENV: 'production',
  }),
  ['https://localhost:8080'],
);

console.log('csrf.test.js: ok');
