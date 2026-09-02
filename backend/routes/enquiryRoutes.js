import express from 'express';
import {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitEnquiry);
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getEnquiries);
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), getEnquiryById);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateEnquiry);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteEnquiry);

export default router;