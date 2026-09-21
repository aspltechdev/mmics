const multer = require("multer");

/* =========================================================
   STORAGE
   =========================================================

   Keep uploaded files in memory.

   This is required because:
   - Local product uploads use file.buffer
   - Vercel Blob uploads use file.buffer
   - Vercel's filesystem should not be used for permanent files
========================================================= */

const storage = multer.memoryStorage();


/* =========================================================
   ALLOWED IMAGE TYPES
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
   MULTER CONFIGURATION
========================================================= */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    /*
     * Keep below Vercel's request-body limit.
     */
    fileSize:
      4 * 1024 * 1024,
  },
});


module.exports = upload;