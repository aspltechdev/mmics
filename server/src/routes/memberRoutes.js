<<<<<<< HEAD
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
const fs = require("fs");
const path = require("path");
=======
const express = require("express");
const multer = require("multer");
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149

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
<<<<<<< HEAD
   MULTER CONFIGURATION
========================================================= */

const uploadDir = path.join(
  __dirname,
  "../../uploads/members"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
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
=======
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
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
  },
});

/* =========================================================
<<<<<<< HEAD
   ADMIN AUTH
=======
   ADMIN MIDDLEWARE
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

const adminOnly = [
  authMiddleware,
  roleMiddleware("ADMIN"),
];

/* =========================================================
   PUBLIC MEMBERS
<<<<<<< HEAD
   IMPORTANT: KEEP THIS BEFORE /:id
=======

   IMPORTANT:
   Must be before /:id
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.get(
  "/public",
  getPublicMembers
);

/* =========================================================
<<<<<<< HEAD
   LOGGED-IN MEMBER PROFILE
=======
   MEMBER OWN PROFILE

   Must also be before /:id
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

/* =========================================================
<<<<<<< HEAD
   ADMIN - GET ALL MEMBERS
=======
   ADMIN - GET ALL
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.get(
  "/",
  ...adminOnly,
  getMembers
);

/* =========================================================
<<<<<<< HEAD
   ADMIN - GET SINGLE MEMBER
=======
   ADMIN - GET SINGLE
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.get(
  "/:id",
  ...adminOnly,
  getMember
);

/* =========================================================
<<<<<<< HEAD
   ADMIN - CREATE MEMBER
=======
   ADMIN - CREATE
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.post(
  "/",
  ...adminOnly,
  upload.single("profileImage"),
  createMember
);

/* =========================================================
<<<<<<< HEAD
   ADMIN - UPDATE MEMBER
=======
   ADMIN - UPDATE
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.put(
  "/:id",
  ...adminOnly,
  upload.single("profileImage"),
  updateMember
);

/* =========================================================
<<<<<<< HEAD
   ADMIN - CHANGE MEMBER STATUS
=======
   ADMIN - STATUS
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
========================================================= */

router.patch(
  "/:id/status",
  ...adminOnly,
  changeMemberStatus
);

/* =========================================================
<<<<<<< HEAD
   ADMIN - DELETE MEMBER
=======
   ADMIN - DELETE
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
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
<<<<<<< HEAD
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message:
            "Profile image must be 5 MB or smaller",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
=======
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
>>>>>>> 6bc6eb4dee1139ddc8bdbedd72d2596bf9598149
    }

    next();
  }
);

module.exports = router;