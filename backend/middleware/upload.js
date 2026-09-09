/**
 * =========================================================
 * UPLOAD MIDDLEWARE
 * =========================================================
 *
 * Multer configuration plus thin wrappers over the storage
 * layer (src/config/storage.js).
 *
 * The exported names uploadToCloudinary / deleteFromCloudinary
 * are kept for backwards compatibility: every existing
 * controller imports them. They now route through the storage
 * layer, so they work whether or not Cloudinary is configured.
 */

import multer from 'multer';
import { AppError } from './errorHandler.js';
import { storeImage, storeImages, removeImage } from '../src/config/storage.js';

/* =========================================================
   MULTER
   ========================================================= */

const storage = multer.memoryStorage();

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new AppError(
      'Invalid file type. Only JPEG, PNG, WEBP and GIF images are allowed.',
      400
    ),
    false
  );
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10,
  },
});

/**
 * Translates multer's own errors into clean API responses.
 * Mount this directly after any route that accepts files.
 */
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'Each image must be smaller than 5MB.',
      LIMIT_FILE_COUNT: 'Too many files. A maximum of 10 images is allowed.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field in the upload.',
    };

    return res.status(400).json({
      success: false,
      message: messages[err.code] || 'File upload failed.',
    });
  }

  return next(err);
};

/* =========================================================
   STORAGE WRAPPERS
   ========================================================= */

export const uploadToCloudinary = async (file, folder = 'mmmics') => {
  try {
    return await storeImage(file, folder);
  } catch (error) {
    if (error.statusCode === 400) {
      throw new AppError(error.message, 400);
    }

    console.error('Image upload error:', error);
    throw new AppError('Failed to upload image', 500);
  }
};

export const uploadManyToCloudinary = async (files, folder = 'mmmics') => {
  try {
    return await storeImages(files, folder);
  } catch (error) {
    console.error('Image upload error:', error);
    throw new AppError('Failed to upload one or more images', 500);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  return removeImage(publicId);
};

export default upload;
