import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authenticate, authorize('SUPER_ADMIN'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), updateSettings);

export default router;