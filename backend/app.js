import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { initStorage, UPLOADS_ROOT } from './src/config/storage.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import directorRoutes from './routes/directorRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import memberAuthRoutes from './routes/memberAuthRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

// Needed so express-rate-limit and req.ip see the real client
// address when running behind a proxy (Render, Nginx, etc).
app.set('trust proxy', 1);

/* =====================================================
   BODY PARSERS
   ===================================================== */

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

/* =====================================================
   SECURITY
   ===================================================== */

app.use(
  helmet({
    // Images are served from this API but displayed on the
    // frontend origin. Helmet's default same-origin policy
    // blocks that, which is why locally stored images render
    // as broken thumbnails.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

/*
 * Allow a comma-separated list of frontend origins so the
 * dev server, the preview build and production can all talk
 * to the same API without editing code.
 */
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin requests and tools like curl send no origin.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

/* =====================================================
   STATIC FILES (locally stored images)
   ===================================================== */

const storageDriver = initStorage();

app.use(
  '/uploads',
  express.static(UPLOADS_ROOT, {
    // Uploaded files are content-addressed by timestamp +
    // random suffix, so they can be cached hard.
    maxAge: '30d',
    immutable: true,
    fallthrough: true,
  })
);

/* =====================================================
   RATE LIMITING
   ===================================================== */

app.use('/api/auth/login', authLimiter);
app.use('/api', apiLimiter);

/* =====================================================
   API ROUTES
   ===================================================== */

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/hero', heroRoutes);

// Member portal
app.use('/api/member/auth', memberAuthRoutes);

// Member administration
app.use('/api/members', memberRoutes);

/* =====================================================
   HEALTH CHECK
   ===================================================== */

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    storageDriver,
  });
});

/* =====================================================
   404
   ===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* =====================================================
   ERROR HANDLER
   ===================================================== */

app.use(errorHandler);

export default app;
