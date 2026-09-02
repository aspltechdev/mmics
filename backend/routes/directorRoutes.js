import express from 'express';
import {
  getDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector
} from '../controllers/directorController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getDirectors);
router.get('/:id', getDirectorById);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('photo'), createDirector);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('photo'), updateDirector);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteDirector);

export default router;