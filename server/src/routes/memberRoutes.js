const express = require("express");
const multer = require("multer");

const {
  getPublicMembers,
  getMembers,
  getMember,
  getMyProfile,
  createMember,
  updateMember,
  changeMemberStatus,
  deleteMember,
} = require("../controllers/memberController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

/* =========================================================
   MEMBER IMAGE UPLOAD

   IMPORTANT:
   Use MEMORY STORAGE.

   Do NOT use:
   multer.diskStorage()

   Vercel cannot permanently write into /var/task.
========================================================= */

const storage = multer.memoryStorage();

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    return cb(
      null,
      true
    );
  }

  return cb(
    new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    ),
    false
  );
};

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Keep safely below Vercel request-body limit
    fileSize:
      4 * 1024 * 1024,
  },
});

/* =========================================================
   ADMIN MIDDLEWARE
========================================================= */

const adminOnly = [
  authMiddleware,
  roleMiddleware("ADMIN"),
];

/* =========================================================
   PUBLIC MEMBERS

   IMPORTANT:
   Must be before /:id
========================================================= */

router.get(
  "/public",
  getPublicMembers
);

/* =========================================================
   MEMBER OWN PROFILE

   Must also be before /:id
========================================================= */

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

/* =========================================================
   ADMIN - GET ALL
========================================================= */

router.get(
  "/",
  ...adminOnly,
  getMembers
);

/* =========================================================
   ADMIN - GET SINGLE
========================================================= */

router.get(
  "/:id",
  ...adminOnly,
  getMember
);

/* =========================================================
   ADMIN - CREATE
========================================================= */

router.post(
  "/",
  ...adminOnly,
  upload.single("profileImage"),
  createMember
);

/* =========================================================
   ADMIN - UPDATE
========================================================= */

router.put(
  "/:id",
  ...adminOnly,
  upload.single("profileImage"),
  updateMember
);

/* =========================================================
   ADMIN - STATUS
========================================================= */

router.patch(
  "/:id/status",
  ...adminOnly,
  changeMemberStatus
);

/* =========================================================
   ADMIN - DELETE
========================================================= */

router.delete(
  "/:id",
  ...adminOnly,
  deleteMember
);

/* =========================================================
   UPLOAD ERROR HANDLER
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
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Profile photo must be less than 4MB",
          });
      }

      return res
        .status(400)
        .json({
          success: false,
          message:
            error.message ||
            "Profile photo upload failed",
        });
    }

    if (error) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            error.message ||
            "Profile photo upload failed",
        });
    }

    next();
  }
);

module.exports = router;