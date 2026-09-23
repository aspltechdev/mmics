const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// =========================================================
// MEMBER IMAGE DIRECTORY
// =========================================================

const uploadDir = path.join(
  __dirname,
  "../../uploads/members"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const filename =
      `member-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (
  req,
  file,
  cb
) => {
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
        "Only JPG, JPEG, PNG and WebP images are allowed"
      ),
      false
    );
  }
};

// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter,
});

// =========================================================
// ADMIN MIDDLEWARE
// =========================================================

const adminOnly = [
  authMiddleware,
  roleMiddleware("ADMIN"),
];

// =========================================================
// PUBLIC MEMBERS
//
// IMPORTANT:
// NO AUTH MIDDLEWARE HERE.
//
// MUST BE BEFORE "/:id"
// =========================================================

router.get(
  "/public",
  getPublicMembers
);

// =========================================================
// LOGGED-IN MEMBER PROFILE
//
// MUST ALSO BE BEFORE "/:id"
// =========================================================

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

// =========================================================
// ADMIN - GET ALL MEMBERS
// =========================================================

router.get(
  "/",
  ...adminOnly,
  getMembers
);

// =========================================================
// ADMIN - GET SINGLE MEMBER
// =========================================================

router.get(
  "/:id",
  ...adminOnly,
  getMember
);

// =========================================================
// ADMIN - CREATE MEMBER
// =========================================================

router.post(
  "/",
  ...adminOnly,
  upload.single(
    "profileImage"
  ),
  createMember
);

// =========================================================
// ADMIN - UPDATE MEMBER
// =========================================================

router.put(
  "/:id",
  ...adminOnly,
  upload.single(
    "profileImage"
  ),
  updateMember
);

// =========================================================
// ADMIN - UPDATE MEMBER STATUS
// =========================================================

router.patch(
  "/:id/status",
  ...adminOnly,
  changeMemberStatus
);

// =========================================================
// ADMIN - DELETE MEMBER
// =========================================================

router.delete(
  "/:id",
  ...adminOnly,
  deleteMember
);

// =========================================================
// MULTER ERROR HANDLER
// =========================================================

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
              "Profile photo must be less than 5MB",
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
            "File upload failed",
        });
    }

    next();
  }
);

module.exports = router;