import prisma from '../src/config/database.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary
} from '../middleware/upload.js';

/**
 * Convert values coming from JSON or FormData into a Boolean.
 */
const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
};

/**
 * Parse sortOrder safely.
 */
const parseSortOrder = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);

  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/* =========================================================
   GET ALL CATEGORIES
   ========================================================= */

export const getCategories = async (req, res) => {
  try {
    const { active } = req.query;

    const where = {};

    if (active === 'true') {
      where.isActive = true;
    }

    if (active === 'false') {
      where.isActive = false;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        sortOrder: 'asc'
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Get categories error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching categories'
    });
  }
};

/* =========================================================
   GET CATEGORY BY SLUG - OPTIMIZED WITH PAGINATION
   ========================================================= */

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;

    // Validate and sanitize pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNumber - 1) * limitNumber;

    // First, get the category without products
    const category = await prisma.category.findUnique({
      where: {
        slug
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get total count of active products in this category
    const totalProducts = await prisma.product.count({
      where: {
        categoryId: category.id,
        isActive: true
      }
    });

    // Get paginated products with limited image data
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        material: true,
        isFeatured: true,
        createdAt: true,
        images: {
          where: {
            isPrimary: true
          },
          select: {
            id: true,
            url: true,
            altText: true
          },
          take: 1
        }
      },
      orderBy: {
        sortOrder: 'asc'
      },
      skip,
      take: limitNumber
    });

    res.json({
      success: true,
      data: {
        ...category,
        products,
        _count: {
          products: totalProducts
        }
      },
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / limitNumber)
      }
    });
  } catch (error) {
    console.error('❌ Get category error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching category'
    });
  }
};

/* =========================================================
   CREATE CATEGORY
   ========================================================= */

export const createCategory = async (req, res) => {
  try {
    console.log('📝 Create Category Request Body:', req.body);
    console.log('👤 User:', req.user);

    const {
      name,
      slug,
      description,
      isActive,
      sortOrder
    } = req.body;

    /* -------------------------
       Validation
       ------------------------- */

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Name and slug are required'
      });
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Slug can only contain lowercase letters, numbers, and hyphens'
      });
    }

    /* -------------------------
       Check duplicate slug
       ------------------------- */

    const existingCategory = await prisma.category.findUnique({
      where: {
        slug
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    /* -------------------------
       Upload image if provided
       ------------------------- */

    let imageData = {};

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file,
        'categories'
      );

      imageData = {
        image: result.url,
        imagePublicId: result.publicId
      };
    }

    /* -------------------------
       Convert FormData values
       ------------------------- */

    const activeValue = parseBoolean(isActive, true);
    const sortOrderValue = parseSortOrder(sortOrder, 0);

    /* -------------------------
       Create category
       ------------------------- */

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || '',
        isActive: activeValue,
        sortOrder: sortOrderValue,
        ...imageData
      }
    });

    console.log('✅ Category created:', category);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('❌ Create category error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the category'
    });
  }
};

/* =========================================================
   UPDATE CATEGORY
   ========================================================= */

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      description,
      isActive,
      sortOrder
    } = req.body;

    /* -------------------------
       Validate ID
       ------------------------- */
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    /* -------------------------
       Find category
       ------------------------- */

    const category = await prisma.category.findUnique({
      where: {
        id
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    /* -------------------------
       Check duplicate slug
       ------------------------- */

    if (slug && slug !== category.slug) {
      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return res.status(400).json({
          success: false,
          message: 'Slug can only contain lowercase letters, numbers, and hyphens'
        });
      }

      const existingCategory = await prisma.category.findUnique({
        where: {
          slug
        }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    /* -------------------------
       Upload new image
       ------------------------- */

    let imageData = {};

    if (req.file) {
      // Delete old Cloudinary image
      if (category.imagePublicId) {
        await deleteFromCloudinary(
          category.imagePublicId
        );
      }

      const result = await uploadToCloudinary(
        req.file,
        'categories'
      );

      imageData = {
        image: result.url,
        imagePublicId: result.publicId
      };
    }

    /* -------------------------
       Convert FormData values
       ------------------------- */

    const activeValue = parseBoolean(
      isActive,
      category.isActive
    );

    const sortOrderValue = parseSortOrder(
      sortOrder,
      category.sortOrder
    );

    /* -------------------------
       Update category
       ------------------------- */

    const updatedCategory = await prisma.category.update({
      where: {
        id
      },
      data: {
        name: name !== undefined
          ? name.trim()
          : category.name,

        slug: slug !== undefined
          ? slug.trim()
          : category.slug,

        description: description !== undefined
          ? description.trim()
          : category.description,

        isActive: activeValue,

        sortOrder: sortOrderValue,

        ...imageData
      }
    });

    console.log('✅ Category updated:', updatedCategory);

    res.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('❌ Update category error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the category'
    });
  }
};

/* =========================================================
   DELETE CATEGORY
   ========================================================= */

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    /* -------------------------
       Validate ID
       ------------------------- */
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    /* -------------------------
       Find category
       ------------------------- */

    const category = await prisma.category.findUnique({
      where: {
        id
      },
      include: {
        products: true
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    /* -------------------------
       Prevent deletion if
       products exist
       ------------------------- */

    if (category.products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    /* -------------------------
       Delete Cloudinary image
       ------------------------- */

    if (category.imagePublicId) {
      await deleteFromCloudinary(
        category.imagePublicId
      );
    }

    /* -------------------------
       Delete category
       ------------------------- */

    await prisma.category.delete({
      where: {
        id
      }
    });

    console.log('✅ Category deleted:', id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete category error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the category'
    });
  }
};