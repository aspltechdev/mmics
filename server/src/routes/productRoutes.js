const express = require("express");

const {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  changeProductStatus,
  addProductImage,
  deleteProductImage,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const router = express.Router();


/* =========================================================
   PUBLIC ROUTES
========================================================= */

// Get all products
router.get(
  "/",
  getProducts
);

// Get product by slug
router.get(
  "/slug/:slug",
  getProductBySlug
);

// Get product by ID
router.get(
  "/:id",
  getProduct
);


/* =========================================================
   ADMIN ROUTES
========================================================= */

// Create product
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProduct
);


// Update product
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateProduct
);


// Change product status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  changeProductStatus
);


// Add product image
router.post(
  "/:id/images",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  addProductImage
);


// Delete product image
router.delete(
  "/images/:imageId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProductImage
);


// Delete product
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProduct
);


module.exports = router;