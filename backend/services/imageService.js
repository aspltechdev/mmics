import cloudinary from '../src/config/cloudinary.js';

export const uploadImage = async (file, folder = 'mmmics') => {
  try {
    const result = await cloudinary.uploader.upload(file.buffer, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};