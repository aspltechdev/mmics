import express from 'express';
import { uploadSingle, uploadMultiple, deleteImage } from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/single', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('image'), uploadSingle);
router.post('/multiple', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.array('images', 10), uploadMultiple);
router.delete('/:publicId', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteImage);

export default router;