import prisma from '../src/config/database.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary
} from '../middleware/upload.js';

/**
 * Convert values coming from JSON/FormData into real booleans.
 *
 * Handles:
 * true
 * false
 * "true"
 * "false"
 */
const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return defaultValue;
};

/**
 * Safely parse JSON values that may arrive as strings.
 *
 * Example:
 * '{"size":"Large"}' -> { size: "Large" }
 * '["Food","Packaging"]' -> ["Food", "Packaging"]
 */
const parseJSON = (value, defaultValue) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'object') {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }

  return defaultValue;
};


/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      featured,
      active,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 20, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    /* Search */
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          shortDescription: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    /* Category */
    if (categoryId) {
      where.categoryId = categoryId;
    }

    /* Featured */
    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (featured === 'false') {
      where.isFeatured = false;
    }

    /* Active */
    if (active === 'true') {
      where.isActive = true;
    }

    if (active === 'false') {
      where.isActive = false;
    }

    /* Safe sorting */
    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'sortOrder'
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const safeSortOrder =
      sortOrder === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },

          images: {
            orderBy: {
              sortOrder: 'asc'
            }
          }
        },

        orderBy: {
          [safeSortBy]: safeSortOrder
        },

        skip,
        take: limitNumber
      }),

      prisma.product.count({
        where
      })
    ]);

    res.json({
      success: true,
      data: products,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages:
          total === 0
            ? 0
            : Math.ceil(total / limitNumber)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        slug
      },

      include: {
        category: true,

        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    /* Related products */
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,

        id: {
          not: product.id
        },

        isActive: true
      },

      take: 4,

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },

        images: {
          where: {
            isPrimary: true
          },

          take: 1,

          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    res.json({
      success: true,

      data: {
        ...product,
        related
      }
    });

  } catch (error) {
    console.error('Get product error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/* =========================================================
   CREATE PRODUCT
========================================================= */

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      categoryId,
      shortDescription,
      fullDescription,
      material,
      specifications,
      applications,
      moq,
      customization,
      isFeatured,
      isActive,
      seoTitle,
      seoDescription
    } = req.body;

    /* Basic validation */
    if (!name || !slug || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug and category are required'
      });
    }

    /* Check category */
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId
      }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    /* Check duplicate slug */
    const existing = await prisma.product.findUnique({
      where: {
        slug
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    /* Convert Boolean values correctly */
    const featuredValue = parseBoolean(
      isFeatured,
      false
    );

    const activeValue = parseBoolean(
      isActive,
      true
    );

    /* Parse JSON fields */
    const specificationsValue = parseJSON(
      specifications,
      {}
    );

    const applicationsValue = parseJSON(
      applications,
      []
    );

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,

        shortDescription:
          shortDescription || null,

        fullDescription:
          fullDescription || null,

        material:
          material || null,

        specifications:
          specificationsValue,

        applications:
          applicationsValue,

        moq:
          moq || null,

        customization:
          customization || null,

        isFeatured:
          featuredValue,

        isActive:
          activeValue,

        seoTitle:
          seoTitle || null,

        seoDescription:
          seoDescription || null
      },

      include: {
        category: true,

        images: true
      }
    });

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      categoryId,
      shortDescription,
      fullDescription,
      material,
      specifications,
      applications,
      moq,
      customization,
      isFeatured,
      isActive,
      seoTitle,
      seoDescription
    } = req.body;

    /* Find existing product */
    const product = await prisma.product.findUnique({
      where: {
        id
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    /* Check category if changed */
    if (categoryId && categoryId !== product.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId
        }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    /* Check duplicate slug */
    if (slug && slug !== product.slug) {
      const existing = await prisma.product.findUnique({
        where: {
          slug
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    /*
      IMPORTANT:
      Preserve existing Boolean values if they were
      not included in the request.
    */
    const featuredValue = parseBoolean(
      isFeatured,
      product.isFeatured
    );

    const activeValue = parseBoolean(
      isActive,
      product.isActive
    );

    /* Preserve existing JSON fields when omitted */
    const specificationsValue =
      specifications !== undefined
        ? parseJSON(
            specifications,
            product.specifications || {}
          )
        : product.specifications;

    const applicationsValue =
      applications !== undefined
        ? parseJSON(
            applications,
            product.applications || []
          )
        : product.applications;

    const updated = await prisma.product.update({
      where: {
        id
      },

      data: {
        name:
          name !== undefined
            ? name
            : product.name,

        slug:
          slug !== undefined
            ? slug
            : product.slug,

        categoryId:
          categoryId !== undefined
            ? categoryId
            : product.categoryId,

        shortDescription:
          shortDescription !== undefined
            ? shortDescription || null
            : product.shortDescription,

        fullDescription:
          fullDescription !== undefined
            ? fullDescription || null
            : product.fullDescription,

        material:
          material !== undefined
            ? material || null
            : product.material,

        specifications:
          specificationsValue,

        applications:
          applicationsValue,

        moq:
          moq !== undefined
            ? moq || null
            : product.moq,

        customization:
          customization !== undefined
            ? customization || null
            : product.customization,

        isFeatured:
          featuredValue,

        isActive:
          activeValue,

        seoTitle:
          seoTitle !== undefined
            ? seoTitle || null
            : product.seoTitle,

        seoDescription:
          seoDescription !== undefined
            ? seoDescription || null
            : product.seoDescription
      },

      include: {
        category: true,

        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {
    console.error('Update product error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/* =========================================================
   DELETE PRODUCT
========================================================= */

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id
      },

      include: {
        images: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    /* Delete images from Cloudinary */
    for (const image of product.images) {
      try {
        if (image.publicId) {
          await deleteFromCloudinary(
            image.publicId
          );
        }
      } catch (cloudinaryError) {
        console.error(
          'Cloudinary image deletion error:',
          cloudinaryError
        );
      }
    }

    /* Delete product from database */
    await prisma.product.delete({
      where: {
        id
      }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/* =========================================================
   UPLOAD PRODUCT IMAGES
========================================================= */

export const uploadProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id
      },

      include: {
        images: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const images = [];

    /*
      Get the next sort order instead of always
      starting from zero.
    */
    const maxSortOrder =
      product.images.length > 0
        ? Math.max(
            ...product.images.map(
              image => image.sortOrder || 0
            )
          )
        : -1;

    /*
      If the product already has a primary image,
      uploaded images should not automatically
      replace the existing primary image.
    */
    const alreadyHasPrimary =
      product.images.some(
        image => image.isPrimary
      );

    for (let i = 0; i < files.length; i++) {
      const result =
        await uploadToCloudinary(
          files[i],
          `products/${id}`
        );

      const isPrimary =
        !alreadyHasPrimary && i === 0;

      const image =
        await prisma.productImage.create({
          data: {
            productId: id,

            url: result.url,

            publicId:
              result.publicId,

            sortOrder:
              maxSortOrder + i + 1,

            isPrimary,

            altText:
              product.name
          }
        });

      images.push(image);
    }

    res.json({
      success: true,
      data: images
    });

  } catch (error) {
    console.error(
      'Upload product images error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


/* =========================================================
   DELETE PRODUCT IMAGE
========================================================= */

export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.productImage.findUnique({
      where: {
        id: imageId
      }
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    /* Delete from Cloudinary */
    try {
      if (image.publicId) {
        await deleteFromCloudinary(
          image.publicId
        );
      }
    } catch (cloudinaryError) {
      console.error(
        'Cloudinary image deletion error:',
        cloudinaryError
      );
    }

    /* Delete from database */
    await prisma.productImage.delete({
      where: {
        id: imageId
      }
    });

    /*
      If the deleted image was primary,
      automatically make another image primary.
    */
    if (image.isPrimary) {
      const nextImage =
        await prisma.productImage.findFirst({
          where: {
            productId: image.productId
          },

          orderBy: {
            sortOrder: 'asc'
          }
        });

      if (nextImage) {
        await prisma.productImage.update({
          where: {
            id: nextImage.id
          },

          data: {
            isPrimary: true
          }
        });
      }
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error(
      'Delete product image error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};