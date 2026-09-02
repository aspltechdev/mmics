import express from 'express';
import { getGallery, uploadGallery, deleteGallery } from '../controllers/galleryController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('image'), uploadGallery);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteGallery);

export default router;