import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const getTestimonials = async (req, res) => {
  try {
    const { active, featured } = req.query;

    const where = {};
    if (active === 'true') where.isActive = true;
    if (featured === 'true') where.isFeatured = true;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching testimonials' // ✅ Generic error message
    });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const {
      customerName,
      designation,
      company,
      testimonial,
      rating,
      isActive,
      isFeatured,
      sortOrder
    } = req.body;

    // ✅ Validate required fields
    if (!customerName || !testimonial) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and testimonial are required'
      });
    }

    let photoData = {};
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'testimonials');
      photoData = {
        photo: result.url,
        photoPublicId: result.publicId
      };
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        customerName,
        designation,
        company,
        testimonial,
        rating: parseInt(rating) || 5,
        isActive: isActive !== undefined ? isActive === 'true' : true,
        isFeatured: isFeatured === 'true',
        sortOrder: parseInt(sortOrder) || 0,
        ...photoData
      }
    });

    res.status(201).json({
      success: true,
      data: newTestimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the testimonial' // ✅ Generic error message
    });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      designation,
      company,
      testimonial,
      rating,
      isActive,
      isFeatured,
      sortOrder
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Testimonial ID is required'
      });
    }

    const existing = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    let photoData = {};
    if (req.file) {
      if (existing.photoPublicId) {
        await deleteFromCloudinary(existing.photoPublicId);
      }
      const result = await uploadToCloudinary(req.file, 'testimonials');
      photoData = {
        photo: result.url,
        photoPublicId: result.publicId
      };
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        customerName,
        designation,
        company,
        testimonial,
        rating: parseInt(rating) || 5,
        isActive: isActive !== undefined ? isActive === 'true' : true,
        isFeatured: isFeatured === 'true',
        sortOrder: parseInt(sortOrder) || 0,
        ...photoData
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the testimonial' // ✅ Generic error message
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Testimonial ID is required'
      });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    if (testimonial.photoPublicId) {
      await deleteFromCloudinary(testimonial.photoPublicId);
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the testimonial' // ✅ Generic error message
    });
  }
};