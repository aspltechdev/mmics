// const express = require("express");

// const {
//   getProducts,
//   getProduct,
//   getProductBySlug,
//   createProduct,
//   updateProduct,
//   changeProductStatus,
//   addProductImage,
//   deleteProductImage,
//   deleteProduct,
// } = require("../controllers/productController");

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// const router = express.Router();

// /*
//   PUBLIC ROUTES
// */

// // Product listing
// router.get("/", getProducts);

// // Product by slug
// router.get("/slug/:slug", getProductBySlug);

// // Product by ID
// router.get("/:id", getProduct);


// /*
//   ADMIN ROUTES
// */

// // Create
// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   createProduct
// );

// // Update
// router.put(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   updateProduct
// );

// // Change status
// router.patch(
//   "/:id/status",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   changeProductStatus
// );

// // Add image
// router.post(
//   "/:id/images",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   addProductImage
// );

// // Delete image
// router.delete(
//   "/images/:imageId",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   deleteProductImage
// );

// // Delete product
// router.delete(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   deleteProduct
// );

// module.exports = router;




const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/*
=========================================================
PRODUCT IMAGE UPLOAD CONFIG
=========================================================
*/

const uploadDirectory = path.join(
  __dirname,
  "../../uploads/products"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const baseName = path
      .basename(
        file.originalname,
        extension
      )
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

    const uniqueName = `${Date.now()}-${baseName}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/*
=========================================================
PUBLIC ROUTES
=========================================================
*/

// Product listing
router.get("/", getProducts);

// Product by slug
router.get(
  "/slug/:slug",
  getProductBySlug
);

// Product by ID
router.get("/:id", getProduct);

/*
=========================================================
ADMIN ROUTES
=========================================================
*/

// Create
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProduct
);

// Update
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateProduct
);

// Change status
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
