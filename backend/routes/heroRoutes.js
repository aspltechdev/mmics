import express from 'express';
import { getHero, updateHero } from '../controllers/heroController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('backgroundImage'), updateHero);

export default router;