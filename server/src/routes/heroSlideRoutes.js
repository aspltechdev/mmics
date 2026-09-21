const express = require("express");
const multer = require("multer");

const {
  getHeroSlides,
  getAllAdminHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  changeHeroSlideStatus,
  reorderHeroSlides,
  deleteHeroSlide,
} = require("../controllers/heroSlideController");

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
   PUBLIC HERO SLIDES
   GET /api/hero-slides
========================================================= */

router.get(
  "/",
  getHeroSlides
);


/* =========================================================
   ADMIN - ALL HERO SLIDES
   IMPORTANT: KEEP BEFORE /:id
========================================================= */

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllAdminHeroSlides
);


/* =========================================================
   GET SINGLE HERO SLIDE
   GET /api/hero-slides/:id
========================================================= */

router.get(
  "/:id",
  getHeroSlide
);


/* =========================================================
   CREATE HERO SLIDE
   POST /api/hero-slides
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
   PUT /api/hero-slides/:id
========================================================= */

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateHeroSlide
);


/* =========================================================
   CHANGE HERO SLIDE STATUS
   PATCH /api/hero-slides/:id/status
========================================================= */

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  changeHeroSlideStatus
);


/* =========================================================
   REORDER HERO SLIDES
   PATCH /api/hero-slides/reorder
========================================================= */

router.patch(
  "/reorder",
  authMiddleware,
  roleMiddleware("ADMIN"),
  reorderHeroSlides
);


/* =========================================================
   DELETE HERO SLIDE
   DELETE /api/hero-slides/:id
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
        "HERO MULTER ERROR:",
        error
      );

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Hero image must be less than 4MB.",
          });
      }

      return res
        .status(400)
        .json({
          success: false,
          message:
            error.message ||
            "Hero image upload failed.",
        });
    }


    if (error) {

      console.error(
        "HERO UPLOAD ERROR:",
        error
      );

      return res
        .status(400)
        .json({
          success: false,
          message:
            error.message ||
            "Hero image upload failed.",
        });
    }


    next();
  }
);


module.exports = router;