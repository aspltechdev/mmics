/**
 * Member portal authentication routes.
 * Mounted at /api/member/auth
 */

import express from 'express';

import {
  memberLogin,
  getMemberProfile,
  getMemberDashboard,
  updateMemberProfile,
  changeMemberPassword,
} from '../controllers/memberAuthController.js';

import { authenticateMember } from '../middleware/memberAuth.js';
import { upload, handleUploadErrors } from '../middleware/upload.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public
router.post('/login', authLimiter, memberLogin);

// Authenticated member
router.get('/me', authenticateMember, getMemberProfile);
router.get('/dashboard', authenticateMember, getMemberDashboard);

router.put(
  '/profile',
  authenticateMember,
  upload.single('profileImage'),
  handleUploadErrors,
  updateMemberProfile
);

router.post('/change-password', authenticateMember, changeMemberPassword);

export default router;
