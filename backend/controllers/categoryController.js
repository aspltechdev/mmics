import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const getCategories = async (req, res) => {
  try {
    const { active } = req.query;

    const where = {};
    if (active === 'true') where.isActive = true;

    const categories = await prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive, sortOrder } = req.body;

    const existing = await prisma.category.findUnique({
      where: { slug }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    let imageData = {};
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'categories');
      imageData = {
        image: result.url,
        imagePublicId: result.publicId
      };
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        ...imageData
      }
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, isActive, sortOrder } = req.body;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (slug && slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    let imageData = {};
    if (req.file) {
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file, 'categories');
      imageData = {
        image: result.url,
        imagePublicId: result.publicId
      };
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        isActive,
        sortOrder,
        ...imageData
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (category.products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};