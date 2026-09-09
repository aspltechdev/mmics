import React, { useState, useEffect } from 'react';
import {
  resolveImageUrl,
  getResizedImageUrl,
  IMAGE_PLACEHOLDER,
  AVATAR_PLACEHOLDER,
} from '../../utils/image';

/**
 * =========================================================
 * SmartImage
 * =========================================================
 *
 * One component for every image in the portal.
 *
 * It handles the four things that were previously going
 * wrong in different places:
 *
 *   1. relative image paths pointing at the wrong origin
 *      -> resolveImageUrl normalises them
 *
 *   2. a missing image rendering as a broken-image icon
 *      -> falls back to an inline SVG placeholder
 *
 *   3. an image that 404s (deleted from storage but still
 *      referenced in the database) breaking the layout
 *      -> onError swaps in the placeholder once
 *
 *   4. full-size originals being downloaded for thumbnails
 *      -> asks Cloudinary for a resized variant when width
 *         or height is supplied
 *
 * Usage:
 *   <SmartImage src={product.images?.[0]?.url} alt={product.name} width={300} />
 *   <SmartImage src={member.profileImage} variant="avatar" alt={member.name} />
 */
const SmartImage = ({
  src,
  alt = '',
  width,
  height,
  crop = 'fill',
  variant = 'default',
  className = '',
  style,
  loading = 'lazy',
  onLoad,
  ...rest
}) => {
  const placeholder =
    variant === 'avatar' ? AVATAR_PLACEHOLDER : IMAGE_PLACEHOLDER;

  const resolved =
    width || height
      ? getResizedImageUrl(src, { width, height, crop })
      : resolveImageUrl(src);

  const [currentSrc, setCurrentSrc] = useState(resolved || placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  // Reset when the source changes, e.g. after an upload
  // replaces an existing image.
  useEffect(() => {
    setCurrentSrc(resolved || placeholder);
    setIsLoaded(false);
    setHasFailed(false);
  }, [resolved, placeholder]);

  const handleError = () => {
    // Guard against an infinite loop if the placeholder
    // itself were ever to fail.
    if (hasFailed) {
      return;
    }

    setHasFailed(true);
    setCurrentSrc(placeholder);
  };

  const handleLoad = (event) => {
    setIsLoaded(true);

    if (onLoad) {
      onLoad(event);
    }
  };

  const isPlaceholder = currentSrc === placeholder;

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={handleError}
      onLoad={handleLoad}
      className={[
        'smart-image',
        isLoaded ? 'is-loaded' : 'is-loading',
        isPlaceholder ? 'is-placeholder' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    />
  );
};

export default SmartImage;
