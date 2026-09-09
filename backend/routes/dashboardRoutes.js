/**
 * Admin dashboard routes.
 * Mounted at /api/dashboard
 */

import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/stats',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  getDashboardStats
);

export default router;
