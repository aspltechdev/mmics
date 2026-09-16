
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
  getHeroSlides,
  getAllHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  changeHeroSlideStatus,
  reorderHeroSlides,
  deleteHeroSlide,
} = require("../controllers/heroSlideController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =========================================================
   HERO SLIDE UPLOAD DIRECTORY
   ========================================================= */

const uploadDir = path.resolve(
  __dirname,
  "../../uploads/hero-slides"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =========================================================
   MULTER STORAGE
   ========================================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(
      file.originalname
    );

    const baseName = path.basename(
      file.originalname,
      extension
    );

    const cleanName = baseName
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const fileName =
      Date.now() +
      "-" +
      cleanName +
      extension.toLowerCase();

    cb(null, fileName);
  },
});

/* =========================================================
   FILE FILTER
   ========================================================= */

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
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

/* =========================================================
   MULTER
   ========================================================= */

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/* =========================================================
   PUBLIC HERO SLIDES
   ========================================================= */

router.get(
  "/",
  getHeroSlides
);

/* =========================================================
   ADMIN - ALL HERO SLIDES
   IMPORTANT: Keep this BEFORE /:id
   ========================================================= */

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllHeroSlides
);

/* =========================================================
   GET SINGLE HERO SLIDE
   ========================================================= */

router.get(
  "/:id",
  getHeroSlide
);

/* =========================================================
   CREATE HERO SLIDE
   ========================================================= */

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createHeroSlide
);

/* =========================================================
   UPDATE HERO SLIDE
   ========================================================= */

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateHeroSlide
);

/* =========================================================
   CHANGE STATUS
   ========================================================= */

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  changeHeroSlideStatus
);

/* =========================================================
   REORDER HERO SLIDES
   ========================================================= */

router.patch(
  "/reorder",
  authMiddleware,
  roleMiddleware("ADMIN"),
  reorderHeroSlides
);

/* =========================================================
   DELETE HERO SLIDE
   ========================================================= */

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteHeroSlide
);

/* =========================================================
   MULTER ERROR HANDLER
   ========================================================= */

router.use(function (error, req, res, next) {
  if (
    error instanceof multer.MulterError
  ) {
    console.error(
      "MULTER ERROR:",
      error
    );

    if (
      error.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Hero image must be less than 5MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Image upload failed.",
    });
  }

  if (error) {
    console.error(
      "HERO UPLOAD ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Hero image upload failed.",
    });
  }

  next();
});

module.exports = router;

