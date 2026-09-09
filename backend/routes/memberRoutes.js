/**
 * Admin member management routes.
 * Mounted at /api/members
 */

import express from 'express';

import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  toggleMemberStatus,
  deleteMember,
} from '../controllers/memberController.js';

import { authenticate, authorize } from '../middleware/auth.js';
import { upload, handleUploadErrors } from '../middleware/upload.js';

const router = express.Router();

// Every route below is admin-only.
router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/', getMembers);
router.get('/:id', getMemberById);

router.post('/', upload.single('profileImage'), handleUploadErrors, createMember);
router.put('/:id', upload.single('profileImage'), handleUploadErrors, updateMember);

router.patch('/:id/status', toggleMemberStatus);
router.delete('/:id', deleteMember);

export default router;
