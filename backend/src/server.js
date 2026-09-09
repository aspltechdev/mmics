// server.js

import dotenv from 'dotenv';
import app from '../app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { getStorageDriver, isCloudinaryConfigured } from './config/storage.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Warm the connection pool before accepting traffic so
    // the first dashboard request does not pay for the TLS
    // handshake to the database.
    const connectMs = await connectDatabase();

    const server = app.listen(PORT, () => {
      const driver = getStorageDriver();

      console.log('╔════════════════════════════════════════╗');
      console.log('║   🚀 MMMICS Backend Server Started    ║');
      console.log('╚════════════════════════════════════════╝');
      console.log(`📍 Server:      http://localhost:${PORT}`);
      console.log(`🩺 Health:      http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database:    connected in ${connectMs}ms`);
      console.log(`🖼️  Images:      ${driver}`);

      if (!isCloudinaryConfigured()) {
        console.log(
          '   └─ Cloudinary is not configured, so uploads are being saved to backend/uploads'
        );
        console.log('      and served from /uploads. Add your Cloudinary keys to .env to switch.');
      }

      console.log('══════════════════════════════════════════');
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received, shutting down.`);

      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });

      // Do not hang forever if a connection refuses to close.
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
