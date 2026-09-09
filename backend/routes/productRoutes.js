import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload, handleUploadErrors } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);

/*
 * Fetch by id.
 *
 * This must be declared before "/:slug", otherwise Express
 * matches "id" as a slug. The admin product edit form needs
 * this: it holds a product id, not a slug, and previously
 * called GET /products/:slug with an id, which always
 * returned 404 and made editing impossible.
 */
router.get('/id/:id', getProductById);

router.get('/:slug', getProductBySlug);

router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteProduct);

router.post(
  '/:id/images',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload.array('images', 10),
  handleUploadErrors,
  uploadProductImages
);

router.delete(
  '/images/:imageId',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteProductImage
);

export default router;
