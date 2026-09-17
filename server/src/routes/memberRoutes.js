// const express = require("express");

// const {
//   getMembers,
//   getMember,
//   createMember,
//   updateMember,
//   changeMemberStatus,
//   deleteMember,
// } = require("../controllers/memberController");

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// const router = express.Router();

// // All member management routes require ADMIN
// router.use(authMiddleware);
// router.use(roleMiddleware("ADMIN"));

// router.get("/", getMembers);

// router.get("/:id", getMember);

// router.post("/", createMember);

// router.put("/:id", updateMember);

// router.patch("/:id/status", changeMemberStatus);

// router.delete("/:id", deleteMember);

// module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const {
//   getMembers,
//   getMember,
//   createMember,
//   updateMember,
//   changeMemberStatus,
//   deleteMember,
// } = require("../controllers/memberController");

// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");

// const router = express.Router();

// /* =========================================================
//    MEMBER PHOTO UPLOAD CONFIG
// ========================================================= */

// const uploadDir = path.join(
//   __dirname,
//   "../../uploads/members"
// );

// /* ---------------------------------------------------------
//    CREATE UPLOAD DIRECTORY IF IT DOESN'T EXIST
// --------------------------------------------------------- */

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, {
//     recursive: true,
//   });
// }

// /* =========================================================
//    MULTER STORAGE
// ========================================================= */

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },

//   filename: (req, file, cb) => {
//     const extension = path
//       .extname(file.originalname)
//       .toLowerCase();

//     const filename =
//       `member-${Date.now()}-${Math.round(
//         Math.random() * 1e9
//       )}${extension}`;

//     cb(null, filename);
//   },
// });

// /* =========================================================
//    FILE FILTER
// ========================================================= */

// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//   ];

//   if (
//     allowedMimeTypes.includes(
//       file.mimetype
//     )
//   ) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Only JPG, JPEG, PNG and WebP images are allowed"
//       ),
//       false
//     );
//   }
// };

// /* =========================================================
//    MULTER UPLOAD
// ========================================================= */

// const upload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },

//   fileFilter,
// });

// /* =========================================================
//    AUTH + ADMIN MIDDLEWARE
// ========================================================= */

// const adminOnly = [
//   authMiddleware,
//   roleMiddleware("ADMIN"),
// ];

// /* =========================================================
//    GET ALL MEMBERS
//    GET /api/members
// ========================================================= */

// router.get(
//   "/",
//   ...adminOnly,
//   getMembers
// );

// /* =========================================================
//    GET SINGLE MEMBER
//    GET /api/members/:id
// ========================================================= */

// router.get(
//   "/:id",
//   ...adminOnly,
//   getMember
// );

// /* =========================================================
//    CREATE MEMBER
//    POST /api/members

//    multipart/form-data

//    profileImage = actual local image file
// ========================================================= */

// router.post(
//   "/",
//   ...adminOnly,
//   upload.single("profileImage"),
//   createMember
// );

// /* =========================================================
//    UPDATE MEMBER
//    PUT /api/members/:id

//    multipart/form-data

//    profileImage = optional new local image
// ========================================================= */

// router.put(
//   "/:id",
//   ...adminOnly,
//   upload.single("profileImage"),
//   updateMember
// );

// /* =========================================================
//    CHANGE MEMBER STATUS
//    PATCH /api/members/:id/status
// ========================================================= */

// router.patch(
//   "/:id/status",
//   ...adminOnly,
//   changeMemberStatus
// );

// /* =========================================================
//    DELETE MEMBER
//    DELETE /api/members/:id
// ========================================================= */

// router.delete(
//   "/:id",
//   ...adminOnly,
//   deleteMember
// );

// /* =========================================================
//    MULTER ERROR HANDLER
// ========================================================= */

// router.use(
//   (error, req, res, next) => {
//     if (
//       error instanceof multer.MulterError
//     ) {
//       if (
//         error.code === "LIMIT_FILE_SIZE"
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Profile photo must be less than 5MB",
//         });
//       }

//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }

//     next();
//   }
// );

// /* =========================================================
//    EXPORT ROUTER
// ========================================================= */

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getMembers,
  getMember,
  getMyProfile,
  createMember,
  updateMember,
  changeMemberStatus,
  deleteMember,
} = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =========================================================
   MEMBER PHOTO UPLOAD CONFIG
========================================================= */

const uploadDir = path.join(
  __dirname,
  "../../uploads/members"
);

/* =========================================================
   CREATE UPLOAD DIRECTORY
========================================================= */

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
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

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
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

/* =========================================================
   MULTER UPLOAD
========================================================= */

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

/* =========================================================
   ADMIN ONLY MIDDLEWARE
========================================================= */

const adminOnly = [
  authMiddleware,
  roleMiddleware("ADMIN"),
];

/* =========================================================
   LOGGED-IN MEMBER
========================================================= */

/*
 * GET /api/members/me
 *
 * Used by:
 * Member Dashboard
 * Member Profile
 *
 * IMPORTANT:
 * This route must come BEFORE /:id
 */

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

/* =========================================================
   ADMIN - GET ALL MEMBERS
   GET /api/members
========================================================= */

router.get(
  "/",
  ...adminOnly,
  getMembers
);

/* =========================================================
   ADMIN - GET SINGLE MEMBER
   GET /api/members/:id
========================================================= */

router.get(
  "/:id",
  ...adminOnly,
  getMember
);

/* =========================================================
   ADMIN - CREATE MEMBER
   POST /api/members

   multipart/form-data

   profileImage = actual local image file
========================================================= */

router.post(
  "/",
  ...adminOnly,
  upload.single("profileImage"),
  createMember
);

/* =========================================================
   ADMIN - UPDATE MEMBER
   PUT /api/members/:id

   multipart/form-data

   profileImage = optional new local image
========================================================= */

router.put(
  "/:id",
  ...adminOnly,
  upload.single("profileImage"),
  updateMember
);

/* =========================================================
   ADMIN - CHANGE MEMBER STATUS
   PATCH /api/members/:id/status
========================================================= */

router.patch(
  "/:id/status",
  ...adminOnly,
  changeMemberStatus
);

/* =========================================================
   ADMIN - DELETE MEMBER
   DELETE /api/members/:id
========================================================= */

router.delete(
  "/:id",
  ...adminOnly,
  deleteMember
);

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use(
  (error, req, res, next) => {
    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Profile photo must be less than 5MB",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Profile photo upload failed",
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "File upload failed",
      });
    }

    next();
  }
);

/* =========================================================
   EXPORT ROUTER
========================================================= */

module.exports = router;