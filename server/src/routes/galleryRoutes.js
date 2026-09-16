// const express = require("express");

// const {
//   getGalleries,
//   getAllGalleries,
//   getGallery,
//   createGallery,
//   updateGallery,
//   changeGalleryStatus,
//   addGalleryImage,
//   updateGalleryImage,
//   deleteGalleryImage,
//   deleteGallery,
// } = require("../controllers/galleryController");

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// const router = express.Router();

// // PUBLIC
// router.get("/", getGalleries);

// router.get("/:id", getGallery);

// // ADMIN
// router.get(
//   "/admin/all",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   getAllGalleries
// );

// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   createGallery
// );

// router.put(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   updateGallery
// );

// router.patch(
//   "/:id/status",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   changeGalleryStatus
// );

// router.post(
//   "/:id/images",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   addGalleryImage
// );

// router.put(
//   "/images/:imageId",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   updateGalleryImage
// );

// router.delete(
//   "/images/:imageId",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   deleteGalleryImage
// );

// router.delete(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   deleteGallery
// );

// module.exports = router;



const express = require("express");
const path = require("path");
const fs = require("fs");
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

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ============================================================
// GALLERY UPLOAD DIRECTORY
// ============================================================

const uploadDir = path.resolve(
  __dirname,
  "../../uploads/gallery"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ============================================================
// MULTER STORAGE
// ============================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const baseName = path.basename(
      file.originalname,
      extension
    );

    const cleanName = baseName
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const safeBaseName =
      cleanName || "gallery-image";

    const fileName =
      `${Date.now()}-${safeBaseName}${extension}`;

    cb(null, fileName);
  },
});

// ============================================================
// MULTER FILE FILTER
// ============================================================

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    ),
    false
  );
};

// ============================================================
// MULTER CONFIG
// ============================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ============================================================
// GALLERY IMAGE UPLOAD MIDDLEWARE
// ============================================================

const galleryUpload = (req, res, next) => {
  upload.single("image")(
    req,
    res,
    (error) => {
      // ------------------------------------------------------
      // MULTER ERROR
      // ------------------------------------------------------

      if (error) {
        console.error(
          "===================================="
        );

        console.error(
          "GALLERY MULTER ERROR"
        );

        console.error(
          "===================================="
        );

        console.error(
          "Error:",
          error
        );

        if (
          error instanceof multer.MulterError
        ) {
          if (
            error.code ===
            "LIMIT_FILE_SIZE"
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Gallery image must be less than 5MB.",
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

        return res.status(400).json({
          success: false,
          message:
            error.message ||
            "Gallery image upload failed.",
        });
      }

      // ------------------------------------------------------
      // DEBUG
      // ------------------------------------------------------

      console.log(
        "===================================="
      );

      console.log(
        "GALLERY MULTER SUCCESS"
      );

      console.log(
        "Body:",
        req.body
      );

      console.log(
        "File:",
        req.file
      );

      console.log(
        "===================================="
      );

      // ------------------------------------------------------
      // CONTINUE TO CONTROLLER
      // ------------------------------------------------------

      next();
    }
  );
};

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET ACTIVE GALLERIES
router.get(
  "/",
  getGalleries
);

// ============================================================
// ADMIN ROUTES
// ============================================================

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

// ============================================================
// GALLERY IMAGE ROUTES
// ============================================================

// ADD IMAGE TO GALLERY
//
// IMPORTANT:
// galleryUpload MUST run before addGalleryImage
//
router.post(
  "/:id/images",
  authMiddleware,
  roleMiddleware("ADMIN"),
  galleryUpload,
  addGalleryImage
);

// UPDATE GALLERY IMAGE
router.put(
  "/images/:imageId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateGalleryImage
);

// DELETE GALLERY IMAGE
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

// ============================================================
// PUBLIC SINGLE GALLERY
//
// Keep this AFTER /admin/all and image routes.
// ============================================================

router.get(
  "/:id",
  getGallery
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;

