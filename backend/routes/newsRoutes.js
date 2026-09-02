import express from 'express';
import {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), upload.single('coverImage'), createNews);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), upload.single('coverImage'), updateNews);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteNews);

export default router;