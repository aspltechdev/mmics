import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const getGallery = async (req, res) => {
  try {
    const { category, featured } = req.query;

    const where = {};
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching gallery images' // ✅ Generic error message
    });
  }
};

export const uploadGallery = async (req, res) => {
  try {
    const { title, description, category, isFeatured, sortOrder } = req.body;

    // ✅ Validate required fields
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await uploadToCloudinary(req.file, 'gallery');

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description,
        url: result.url,
        publicId: result.publicId,
        category: category || 'PRODUCTS',
        isFeatured: isFeatured === 'true',
        sortOrder: parseInt(sortOrder) || 0
      }
    });

    res.status(201).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Upload gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the image' // ✅ Generic error message
    });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required'
      });
    }

    const image = await prisma.galleryImage.findUnique({
      where: { id }
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    await deleteFromCloudinary(image.publicId);

    await prisma.galleryImage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the image' // ✅ Generic error message
    });
  }
};