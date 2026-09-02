import app from '../app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🚀 MMMICS Backend Server Started    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('══════════════════════════════════════════');
});