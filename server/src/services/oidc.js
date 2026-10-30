import * as client from 'openid-client';
import jwt from 'jsonwebtoken';
import { resolveJwtSecret } from '../security/secrets.js';
import { cookieSecure, sameSiteMode } from '../middleware/cookies.js';

const PENDING_COOKIE = 'crime_tips_oidc';
const PENDING_TTL_SEC = 600;

let cachedConfig = null;
let cachedKey = '';

function envTruthy(name) {
  const v = (process.env[name] || '').toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function envFalsy(name) {
  const v = (process.env[name] || '').toLowerCase();
  return v === 'false' || v === '0' || v === 'no';
}

/** True when issuer + client id are set and OIDC_ENABLED is not explicitly false. */
export function oidcConfigured() {
  if (envFalsy('OIDC_ENABLED')) return false;
  const issuer = (process.env.OIDC_ISSUER || '').trim();
  const clientId = (process.env.OIDC_CLIENT_ID || '').trim();
  return Boolean(issuer && clientId);
}

/** Keep email/password (+ TOTP) unless explicitly disabled. */
export function oidcAllowPassword() {
  if (envFalsy('OIDC_ALLOW_PASSWORD')) return false;
  return true;
}

export function oidcAutoProvision() {
  return envTruthy('OIDC_AUTO_PROVISION');
}

export function oidcButtonLabel() {
  return (process.env.OIDC_BUTTON_LABEL || 'Sign in with agency SSO').trim();
}

export function oidcScopes() {
  return (process.env.OIDC_SCOPES || 'openid email profile').trim();
}

export function oidcEmailClaim() {
  return (process.env.OIDC_EMAIL_CLAIM || 'email').trim();
}

export function publicOidcStatus() {
  return {
    enabled: oidcConfigured(),
    allowPassword: oidcAllowPassword(),
    buttonLabel: oidcButtonLabel(),
  };
}

export function resolveRedirectUri() {
  const explicit = (process.env.OIDC_REDIRECT_URI || '').trim();
  if (explicit) return explicit;
  const origin = (process.env.PUBLIC_ORIGIN || '')
    .split(',')[0]
    .trim()
    .replace(/\/$/, '');
  if (origin) return `${origin}/api/auth/oidc/callback`;
  return null;
}

function cacheKey() {
  return [
    process.env.OIDC_ISSUER,
    process.env.OIDC_CLIENT_ID,
    process.env.OIDC_CLIENT_SECRET || '',
  ].join('|');
}

/**
 * Discover and cache the OIDC client configuration.
 * Throws if misconfigured or discovery fails.
 */
export async function getOidcConfig() {
  if (!oidcConfigured()) {
    throw new Error('OIDC is not configured');
  }
  const key = cacheKey();
  if (cachedConfig && cachedKey === key) return cachedConfig;

  const issuerUrl = new URL((process.env.OIDC_ISSUER || '').trim());
  const clientId = (process.env.OIDC_CLIENT_ID || '').trim();
  const clientSecret = (process.env.OIDC_CLIENT_SECRET || '').trim() || undefined;

  const insecure = envTruthy('OIDC_ALLOW_INSECURE');
  const config = await client.discovery(
    issuerUrl,
    clientId,
    clientSecret,
    undefined,
    insecure ? { execute: [client.allowInsecureRequests] } : undefined,
  );

  cachedConfig = config;
  cachedKey = key;
  return config;
}

/** Clear discovery cache (tests / env reload). */
export function resetOidcCache() {
  cachedConfig = null;
  cachedKey = '';
}

export async function buildOidcAuthorization() {
  const config = await getOidcConfig();
  const redirectUri = resolveRedirectUri();
  if (!redirectUri) {
    throw new Error(
      'OIDC redirect URI missing — set OIDC_REDIRECT_URI or PUBLIC_ORIGIN',
    );
  }

  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  const parameters = {
    redirect_uri: redirectUri,
    scope: oidcScopes(),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
    nonce,
  };

  const redirectTo = client.buildAuthorizationUrl(config, parameters);
  return {
    redirectTo: redirectTo.href,
    pending: { codeVerifier, state, nonce, redirectUri },
  };
}

export async function exchangeOidcCallback(currentUrl, pending) {
  const config = await getOidcConfig();
  const tokens = await client.authorizationCodeGrant(config, currentUrl, {
    pkceCodeVerifier: pending.codeVerifier,
    expectedState: pending.state,
    expectedNonce: pending.nonce,
  });

  let claims = tokens.claims();
  const emailClaim = oidcEmailClaim();

  if ((!claims || !claims[emailClaim]) && tokens.access_token) {
    const sub = claims?.sub;
    if (sub) {
      try {
        const info = await client.fetchUserInfo(config, tokens.access_token, sub);
        claims = { ...(claims || {}), ...info };
      } catch {
        /* UserInfo optional */
      }
    }
  }

  if (!claims?.sub) {
    throw new Error('OIDC token response missing subject claim');
  }

  return { tokens, claims };
}

export function signOidcPending(pending) {
  return jwt.sign(
    {
      purpose: 'oidc',
      cv: pending.codeVerifier,
      st: pending.state,
      n: pending.nonce,
      ru: pending.redirectUri,
    },
    resolveJwtSecret(),
    { expiresIn: PENDING_TTL_SEC },
  );
}

export function verifyOidcPending(token) {
  const payload = jwt.verify(token, resolveJwtSecret());
  if (payload.purpose !== 'oidc' || !payload.cv || !payload.st || !payload.n) {
    throw new Error('Invalid OIDC pending state');
  }
  return {
    codeVerifier: payload.cv,
    state: payload.st,
    nonce: payload.n,
    redirectUri: payload.ru,
  };
}

export function oidcPendingCookieName() {
  return PENDING_COOKIE;
}

export function setOidcPendingCookie(res, req, token) {
  res.cookie(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure(req),
    sameSite: sameSiteMode(),
    path: '/api/auth/oidc',
    maxAge: PENDING_TTL_SEC * 1000,
  });
}

export function clearOidcPendingCookie(res, req) {
  res.clearCookie(PENDING_COOKIE, {
    httpOnly: true,
    secure: cookieSecure(req),
    sameSite: sameSiteMode(),
    path: '/api/auth/oidc',
  });
}

/** Absolute callback URL for the token exchange (must match redirect_uri). */
export function callbackUrlFromRequest(req) {
  const redirectUri = resolveRedirectUri();
  if (redirectUri) {
    const u = new URL(redirectUri);
    const incoming = new URL(req.originalUrl || req.url, `${u.protocol}//${u.host}`);
    u.search = incoming.search;
    return u;
  }
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http')
    .toString()
    .split(',')[0]
    .trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || 'localhost')
    .toString()
    .split(',')[0]
    .trim();
  return new URL(req.originalUrl || req.url, `${proto}://${host}`);
}

/**
 * Whether the IdP asserts a verified email for linking / auto-provision.
 * Default: require `email_verified === true` (or string "true").
 * Set OIDC_REQUIRE_EMAIL_VERIFIED=false only for IdPs that never send the claim.
 */
export function oidcRequireEmailVerified() {
  return process.env.OIDC_REQUIRE_EMAIL_VERIFIED !== 'false';
}

export function extractOidcIdentity(claims) {
  const sub = claims.sub ? String(claims.sub) : null;
  const emailRaw = claims[oidcEmailClaim()];
  const email = emailRaw ? String(emailRaw).trim().toLowerCase() : null;
  const verifiedRaw = claims.email_verified;
  const emailVerified = verifiedRaw === true || verifiedRaw === 'true';
  const firstName =
    (claims.given_name && String(claims.given_name)) ||
    (claims.first_name && String(claims.first_name)) ||
    '';
  const lastName =
    (claims.family_name && String(claims.family_name)) ||
    (claims.last_name && String(claims.last_name)) ||
    '';
  return { sub, email, emailVerified, firstName, lastName };
}
