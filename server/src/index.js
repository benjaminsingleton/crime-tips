import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { migrate, seedAdmin, pool } from './db.js';
import { assertSafeSecretsOrExit } from './security/secrets.js';
import {
  configureTrustProxy,
  globalApiLimiter,
} from './middleware/rateLimit.js';
import authRoutes from './routes/auth.js';
import tipRoutes from './routes/tips.js';
import userRoutes from './routes/users.js';
import metricsRoutes from './routes/metrics.js';

assertSafeSecretsOrExit();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);

configureTrustProxy(app);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

function corsOrigin() {
  const configured = (process.env.PUBLIC_ORIGIN || '').trim();
  if (!configured) {
    // Dev / same-origin Compose: reflect request origin (Vite proxy + local).
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    return true;
  }
  const allowed = configured.split(',').map((s) => s.trim()).filter(Boolean);
  return (origin, callback) => {
    if (!origin || allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  };
}

app.use(
  cors({
    origin: corsOrigin(),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use('/api', globalApiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/metrics', metricsRoutes);

const clientDist = process.env.CLIENT_DIST || path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(clientDist, 'index.html'));
  });
}

async function start() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      break;
    } catch (err) {
      console.log(`Waiting for Postgres (${attempt}/30)...`);
      if (attempt === 30) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  await migrate();
  await seedAdmin();

  app.listen(port, () => {
    console.log(`Crime Tips API listening on :${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
