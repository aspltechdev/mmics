import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
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

dotenv.config();

const app = express();

// ✅ IMPORTANT: These MUST be here BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
app.use('/api', apiLimiter);

// API routes (THESE COME AFTER body parsers)
app.use('/api/auth', authRoutes);
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

export default app;