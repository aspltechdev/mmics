/**
 * =========================================================
 * IMAGE HELPERS
 * =========================================================
 *
 * Every image in the portal goes through resolveImageUrl().
 *
 * The backend can return an image URL in several shapes
 * depending on how it was stored:
 *
 *   - a full Cloudinary URL      https://res.cloudinary.com/...
 *   - a full local URL           http://localhost:5000/uploads/...
 *   - a relative path            /uploads/products/abc.jpg
 *   - a bare storage key         products/abc123/171-9f2.jpg
 *   - null / undefined / ''      no image set
 *
 * Rendering a relative path straight into <img src> points
 * the browser at the frontend origin (5173) instead of the
 * API (5000), which is why some images silently failed to
 * load. This helper normalises all of those to something the
 * browser can actually fetch.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/** Strip the trailing /api to get the server origin. */
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

/**
 * Inline SVG placeholder. Used when there is no image, or
 * when the real image fails to load. Kept as a data URI so
 * it never triggers a second failed network request.
 */
export const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#eef2f7"/>
      <g fill="none" stroke="#b3c0d1" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="140" y="110" width="120" height="90" rx="8"/>
        <path d="M140 175l30-28 24 22 26-30 40 36"/>
        <circle cx="176" cy="136" r="9"/>
      </g>
    </svg>`
  );

export const AVATAR_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#e8eef6"/>
      <circle cx="100" cy="78" r="34" fill="#b9c7d8"/>
      <path d="M36 178c0-35 29-58 64-58s64 23 64 58z" fill="#b9c7d8"/>
    </svg>`
  );

/**
 * Normalise any stored image reference into a loadable URL.
 *
 * @param {string|object|null} source  URL string, or an object
 *        with a `url` / `image` / `photo` / `profileImage` field
 * @returns {string|null} a usable URL, or null when unset
 */
export const resolveImageUrl = (source) => {
  if (!source) {
    return null;
  }

  // Accept an image record as well as a plain string.
  let value = source;

  if (typeof source === 'object') {
    value =
      source.url ||
      source.image ||
      source.photo ||
      source.profileImage ||
      source.backgroundImage ||
      source.coverImage ||
      null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === '') {
    return null;
  }

  // Already absolute, or a data/blob URI.
  if (/^(https?:)?\/\//i.test(trimmed) || /^(data|blob):/i.test(trimmed)) {
    return trimmed;
  }

  // Served by the API: "/uploads/..."
  if (trimmed.startsWith('/uploads/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  // Bare storage key: "products/abc/171-9f2.jpg"
  if (!trimmed.startsWith('/')) {
    return `${API_ORIGIN}/uploads/${trimmed}`;
  }

  // Anything else rooted at the frontend (e.g. /images/logo.png
  // in the public folder) is left alone.
  return trimmed;
};

/**
 * Pick the image to show for a product.
 * Prefers the primary image, then the lowest sortOrder,
 * then whatever is first.
 */
export const getPrimaryProductImage = (product) => {
  const images = product?.images;

  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const primary = images.find((image) => image?.isPrimary);

  if (primary) {
    return resolveImageUrl(primary.url);
  }

  const sorted = [...images].sort(
    (a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)
  );

  return resolveImageUrl(sorted[0]?.url);
};

/**
 * Cloudinary can resize on the fly. When the image is stored
 * locally there is nothing to transform, so the URL is
 * returned unchanged.
 *
 * @param {string} url
 * @param {{width?: number, height?: number, crop?: string}} options
 */
export const getResizedImageUrl = (url, options = {}) => {
  const resolved = resolveImageUrl(url);

  if (!resolved || !resolved.includes('res.cloudinary.com')) {
    return resolved;
  }

  const { width, height, crop = 'fill' } = options;

  const transformations = ['f_auto', 'q_auto'];

  if (width) {
    transformations.push(`w_${Math.round(width)}`);
  }

  if (height) {
    transformations.push(`h_${Math.round(height)}`);
  }

  if (width || height) {
    transformations.push(`c_${crop}`);
  }

  // Insert the transformation segment straight after /upload/
  return resolved.replace('/upload/', `/upload/${transformations.join(',')}/`);
};

export default resolveImageUrl;
