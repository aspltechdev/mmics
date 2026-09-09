/**
 * =========================================================
 * UNIFIED IMAGE STORAGE
 * =========================================================
 *
 * The whole application uploads images through this module.
 *
 * Two drivers are supported:
 *
 *   1. "cloudinary" - used when real Cloudinary credentials
 *      are present in .env
 *
 *   2. "local" - automatic fallback that writes the file to
 *      backend/uploads and serves it from /uploads
 *
 * The fallback is what makes image upload work "for all"
 * environments. Previously every upload threw a 500 error
 * whenever Cloudinary was not configured, which is the case
 * on a fresh checkout because .env still holds the
 * placeholder values ("your-cloud-name" etc).
 *
 * Both drivers return exactly the same shape:
 *
 *   { url, publicId }
 *
 * so no controller needs to know which driver is active.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import cloudinary from './cloudinary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/src/config -> backend
export const BACKEND_ROOT = path.resolve(__dirname, '..', '..');
export const UPLOADS_ROOT = path.join(BACKEND_ROOT, 'uploads');

/* =========================================================
   DRIVER DETECTION
   ========================================================= */

/**
 * A value counts as "not configured" when it is missing,
 * empty, or still holds one of the placeholder strings that
 * ship in .env.example.
 */
const isPlaceholder = (value) => {
  if (!value || typeof value !== 'string') {
    return true;
  }

  const normalised = value.trim().toLowerCase();

  if (normalised === '') {
    return true;
  }

  const placeholders = [
    'your-cloud-name',
    'your-api-key',
    'your-api-secret',
    'changeme',
    'xxx',
    'undefined',
    'null',
  ];

  return placeholders.includes(normalised);
};

export const isCloudinaryConfigured = () => {
  return (
    !isPlaceholder(process.env.CLOUDINARY_CLOUD_NAME) &&
    !isPlaceholder(process.env.CLOUDINARY_API_KEY) &&
    !isPlaceholder(process.env.CLOUDINARY_API_SECRET)
  );
};

export const getStorageDriver = () => {
  // Allow an explicit override, useful for local development
  // and for tests.
  const forced = (process.env.STORAGE_DRIVER || '').trim().toLowerCase();

  if (forced === 'local' || forced === 'cloudinary') {
    return forced;
  }

  return isCloudinaryConfigured() ? 'cloudinary' : 'local';
};

/* =========================================================
   LOCAL DRIVER HELPERS
   ========================================================= */

const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const EXTENSION_BY_MIMETYPE = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

/**
 * Folder names arrive from controllers as things like
 * "products/clx123". Only allow safe characters so a crafted
 * value can never escape the uploads directory.
 */
const sanitiseFolder = (folder) => {
  return String(folder || 'uploads')
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, ''))
    .filter((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
    .join('/') || 'uploads';
};

const getPublicBaseUrl = () => {
  const configured = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  return configured.replace(/\/+$/, '');
};

/**
 * Turn a stored publicId back into an absolute URL.
 * Used when the frontend receives a relative path.
 */
export const buildLocalUrl = (relativePath) => {
  return `${getPublicBaseUrl()}/uploads/${relativePath}`;
};

const uploadLocally = async (file, folder) => {
  const safeFolder = sanitiseFolder(folder);
  const targetDirectory = path.join(UPLOADS_ROOT, safeFolder);

  ensureDirectory(targetDirectory);

  const extension =
    EXTENSION_BY_MIMETYPE[file.mimetype] ||
    path.extname(file.originalname || '') ||
    '.jpg';

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`;
  const absolutePath = path.join(targetDirectory, filename);

  await fs.promises.writeFile(absolutePath, file.buffer);

  // publicId is the path relative to the uploads root. It is
  // what deleteImage() needs in order to remove the file.
  const publicId = `${safeFolder}/${filename}`;

  return {
    url: buildLocalUrl(publicId),
    publicId,
    driver: 'local',
  };
};

const deleteLocally = async (publicId) => {
  const safeRelativePath = sanitiseFolder(publicId);
  const absolutePath = path.join(UPLOADS_ROOT, safeRelativePath);

  // Final guard: never delete anything outside uploads/
  if (!absolutePath.startsWith(UPLOADS_ROOT)) {
    return false;
  }

  if (!fs.existsSync(absolutePath)) {
    return false;
  }

  await fs.promises.unlink(absolutePath);
  return true;
};

/* =========================================================
   CLOUDINARY DRIVER HELPERS
   ========================================================= */

const uploadToCloudinaryDriver = (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1600, height: 1600, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error('Cloudinary returned no upload result'));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          driver: 'cloudinary',
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

const deleteFromCloudinaryDriver = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  return true;
};

/* =========================================================
   PUBLIC API
   ========================================================= */

/**
 * Upload one image.
 *
 * @param {object} file   multer file object (memory storage)
 * @param {string} folder logical folder, e.g. "products/abc123"
 * @returns {Promise<{url: string, publicId: string, driver: string}>}
 */
export const storeImage = async (file, folder = 'uploads') => {
  if (!file || !file.buffer) {
    const error = new Error('No image file received.');
    error.statusCode = 400;
    throw error;
  }

  const driver = getStorageDriver();

  if (driver === 'cloudinary') {
    try {
      return await uploadToCloudinaryDriver(file, folder);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);

      // A network blip or a bad key should not lose the
      // user's upload. Fall back rather than 500.
      return uploadLocally(file, folder);
    }
  }

  return uploadLocally(file, folder);
};

/**
 * Upload many images, preserving order.
 * Runs in parallel, which makes multi-image product uploads
 * noticeably faster than the previous sequential loop.
 */
export const storeImages = async (files = [], folder = 'uploads') => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  return Promise.all(files.map((file) => storeImage(file, folder)));
};

/**
 * Delete an image. Never throws: a failed cleanup should not
 * abort the surrounding database operation.
 */
export const removeImage = async (publicId) => {
  if (!publicId) {
    return false;
  }

  try {
    // Local publicIds always contain a "/" and a file
    // extension. Cloudinary publicIds have no extension.
    const looksLocal = /\.[a-zA-Z0-9]{2,5}$/.test(publicId);

    if (looksLocal) {
      return await deleteLocally(publicId);
    }

    if (getStorageDriver() === 'cloudinary') {
      return await deleteFromCloudinaryDriver(publicId);
    }

    return await deleteLocally(publicId);
  } catch (error) {
    console.error('Image deletion failed:', error.message);
    return false;
  }
};

/**
 * Called once at boot so the uploads directory exists and the
 * active driver is visible in the logs.
 */
export const initStorage = () => {
  const driver = getStorageDriver();

  if (driver === 'local') {
    ensureDirectory(UPLOADS_ROOT);
  }

  return driver;
};

export default {
  storeImage,
  storeImages,
  removeImage,
  initStorage,
  getStorageDriver,
  isCloudinaryConfigured,
};
