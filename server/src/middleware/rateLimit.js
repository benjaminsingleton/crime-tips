import rateLimit from 'express-rate-limit';

const trustProxy = process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1';

/** Login: tight per-IP window to slow password spraying. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

/** Tip create / patch / submit: medium per-IP ceiling. */
export const tipWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_TIP_WRITE_MAX || 60),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many tip requests. Try again later.' },
});

/** Attachment uploads: protect disk from flooding. */
export const tipUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_UPLOAD_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many uploads. Try again later.' },
});

/** Soft global API ceiling. */
export const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.RATE_LIMIT_GLOBAL_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

export function configureTrustProxy(app) {
  if (trustProxy) {
    app.set('trust proxy', 1);
  }
}
