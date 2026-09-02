import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteProduct);
router.post('/:id/images', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), upload.array('images', 10), uploadProductImages);
router.delete('/images/:imageId', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteProductImage);

export default router;