import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('photo'), createTestimonial);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('photo'), updateTestimonial);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteTestimonial);

export default router;