const express = require("express");
const multer = require("multer");

const {
  getGalleries,
  getAllGalleries,
  getGallery,
  createGallery,
  updateGallery,
  changeGalleryStatus,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  deleteGallery,
} = require("../controllers/galleryController");

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

// GET ACTIVE GALLERIES
router.get(
  "/",
  getGalleries
);


/* =========================================================
   ADMIN ROUTES
========================================================= */

// IMPORTANT:
// /admin/all MUST COME BEFORE /:id
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllGalleries
);


// CREATE GALLERY
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createGallery
);


// UPDATE GALLERY
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateGallery
);


// CHANGE GALLERY STATUS
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  changeGalleryStatus
);


/* =========================================================
   GALLERY IMAGE ROUTES
========================================================= */

// ADD IMAGE
router.post(
  "/:id/images",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  addGalleryImage
);


// UPDATE IMAGE
router.put(
  "/images/:imageId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateGalleryImage
);


// DELETE IMAGE
router.delete(
  "/images/:imageId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteGalleryImage
);


// DELETE GALLERY
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteGallery
);


/* =========================================================
   PUBLIC SINGLE GALLERY

   KEEP AFTER ADMIN/IMAGE ROUTES
========================================================= */

router.get(
  "/:id",
  getGallery
);


/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      console.error(
        "GALLERY MULTER ERROR:",
        error
      );

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery image must be less than 4MB.",
        });
      }

      if (
        error.code ===
        "LIMIT_UNEXPECTED_FILE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Unexpected image field. Use field name "image".',
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Gallery image upload failed.",
      });
    }

    if (error) {
      console.error(
        "GALLERY UPLOAD ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Gallery image upload failed.",
      });
    }

    next();
  }
);


module.exports = router;