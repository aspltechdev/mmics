import prisma from '../src/config/database.js';

import {
  uploadToCloudinary,
  uploadManyToCloudinary,
  deleteFromCloudinary
} from '../middleware/upload.js';

// =========================================================
// HELPERS
// =========================================================

/**
 * Convert values coming from JSON/FormData into real booleans.
 */
const parseBoolean = (value, defaultValue = true) => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
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
 */
const parseJSON = (value, defaultValue) => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
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

// =========================================================
// GET ALL PRODUCTS - OPTIMIZED
// =========================================================

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

    // Validate and sanitize pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    // -----------------------------------------------------
    // SEARCH
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // CATEGORY
    // -----------------------------------------------------

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // -----------------------------------------------------
    // FEATURED
    // -----------------------------------------------------

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (featured === 'false') {
      where.isFeatured = false;
    }

    // -----------------------------------------------------
    // ACTIVE
    // -----------------------------------------------------

    if (active === 'true') {
      where.isActive = true;
    }

    if (active === 'false') {
      where.isActive = false;
    }

    // -----------------------------------------------------
    // SAFE SORTING
    // -----------------------------------------------------

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'sortOrder'
    ];

    const safeSortBy =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'createdAt';

    const safeSortOrder =
      sortOrder === 'asc'
        ? 'asc'
        : 'desc';

    // -----------------------------------------------------
    // DATABASE QUERY - OPTIMIZED WITH SELECT
    // -----------------------------------------------------

    const [
      products,
      total
    ] = await Promise.all([
      prisma.product.findMany({
        where,

        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          material: true,
          isFeatured: true,
          isActive: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
              sortOrder: true
            },
            orderBy: {
              sortOrder: 'asc'
            },
            take: 3 // Limit to first 3 images for performance
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

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.json({
      success: true,

      data: products,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limitNumber)
      }
    });

  } catch (error) {

    console.error('Get products error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching products'
    });
  }
};

// =========================================================
// GET PRODUCT BY ID
// =========================================================

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // -----------------------------------------------------
    // FIND PRODUCT - OPTIMIZED WITH SELECT
    // -----------------------------------------------------

    const product =
      await prisma.product.findUnique({
        where: {
          id
        },

        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          fullDescription: true,
          material: true,
          specifications: true,
          applications: true,
          moq: true,
          customization: true,
          isFeatured: true,
          isActive: true,
          seoTitle: true,
          seoDescription: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
              sortOrder: true
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      });

    // -----------------------------------------------------
    // NOT FOUND
    // -----------------------------------------------------

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.json({
      success: true,
      data: product
    });

  } catch (error) {

    console.error('Get product by ID error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the product'
    });
  }
};

// =========================================================
// GET PRODUCT BY SLUG - OPTIMIZED
// =========================================================

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // -----------------------------------------------------
    // FIND PRODUCT - OPTIMIZED WITH SELECT
    // -----------------------------------------------------

    const product =
      await prisma.product.findUnique({
        where: {
          slug,
          isActive: true
        },

        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          fullDescription: true,
          material: true,
          specifications: true,
          applications: true,
          moq: true,
          customization: true,
          isFeatured: true,
          isActive: true,
          seoTitle: true,
          seoDescription: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true
            }
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
              sortOrder: true
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      });

    // -----------------------------------------------------
    // NOT FOUND
    // -----------------------------------------------------

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // -----------------------------------------------------
    // RELATED PRODUCTS - OPTIMIZED
    // -----------------------------------------------------

    const related =
      await prisma.product.findMany({
        where: {
          categoryId:
            product.category.id,

          id: {
            not: product.id
          },

          isActive: true
        },

        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          material: true,
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
            select: {
              id: true,
              url: true,
              altText: true
            },
            take: 1
          }
        },

        take: 4
      });

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

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
      message: 'An error occurred while fetching the product'
    });
  }
};

// =========================================================
// CREATE PRODUCT
// =========================================================

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

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      !name ||
      !slug ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug and category are required'
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

    // -----------------------------------------------------
    // CHECK CATEGORY
    // -----------------------------------------------------

    const category =
      await prisma.category.findUnique({
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

    // -----------------------------------------------------
    // CHECK DUPLICATE SLUG
    // -----------------------------------------------------

    const existing =
      await prisma.product.findUnique({
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

    // -----------------------------------------------------
    // BOOLEAN VALUES
    // -----------------------------------------------------

    const featuredValue =
      parseBoolean(
        isFeatured,
        false
      );

    const activeValue =
      parseBoolean(
        isActive,
        true
      );

    // -----------------------------------------------------
    // JSON VALUES
    // -----------------------------------------------------

    const specificationsValue =
      parseJSON(
        specifications,
        {}
      );

    const applicationsValue =
      parseJSON(
        applications,
        []
      );

    // -----------------------------------------------------
    // CREATE PRODUCT
    // -----------------------------------------------------

    const product =
      await prisma.product.create({
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      });

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {

    console.error('Create product error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the product'
    });
  }
};

// =========================================================
// UPDATE PRODUCT
// =========================================================

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

    // -----------------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // -----------------------------------------------------
    // FIND EXISTING PRODUCT
    // -----------------------------------------------------

    const product =
      await prisma.product.findUnique({
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

    // -----------------------------------------------------
    // CHECK CATEGORY
    // -----------------------------------------------------

    if (
      categoryId &&
      categoryId !== product.categoryId
    ) {

      const category =
        await prisma.category.findUnique({
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

    // -----------------------------------------------------
    // CHECK DUPLICATE SLUG
    // -----------------------------------------------------

    if (
      slug &&
      slug !== product.slug
    ) {

      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return res.status(400).json({
          success: false,
          message: 'Slug can only contain lowercase letters, numbers, and hyphens'
        });
      }

      const existing =
        await prisma.product.findUnique({
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

    // -----------------------------------------------------
    // BOOLEAN VALUES
    // -----------------------------------------------------

    const featuredValue =
      parseBoolean(
        isFeatured,
        product.isFeatured
      );

    const activeValue =
      parseBoolean(
        isActive,
        product.isActive
      );

    // -----------------------------------------------------
    // JSON VALUES
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // UPDATE PRODUCT
    // -----------------------------------------------------

    const updated =
      await prisma.product.update({
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              isPrimary: true,
              sortOrder: true
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      });

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {

    console.error('Update product error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the product'
    });
  }
};

// =========================================================
// DELETE PRODUCT
// =========================================================

export const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    // -----------------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // -----------------------------------------------------
    // FIND PRODUCT + IMAGES
    // -----------------------------------------------------

    const product =
      await prisma.product.findUnique({
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

    // -----------------------------------------------------
    // DELETE IMAGES FROM CLOUDINARY
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // DELETE PRODUCT
    // -----------------------------------------------------

    await prisma.product.delete({
      where: {
        id
      }
    });

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {

    console.error('Delete product error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the product'
    });
  }
};

// =========================================================
// UPLOAD PRODUCT IMAGES
// =========================================================

export const uploadProductImages = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const files = req.files;

    // -----------------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // -----------------------------------------------------
    // CHECK FILES
    // -----------------------------------------------------

    if (
      !files ||
      files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // -----------------------------------------------------
    // FIND PRODUCT (only the image metadata we need)
    // -----------------------------------------------------

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        images: {
          select: { sortOrder: true, isPrimary: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // -----------------------------------------------------
    // SORT ORDER + PRIMARY FLAG
    // -----------------------------------------------------

    const maxSortOrder =
      product.images.length > 0
        ? Math.max(...product.images.map(image => image.sortOrder || 0))
        : -1;

    const alreadyHasPrimary = product.images.some(image => image.isPrimary);

    // -----------------------------------------------------
    // UPLOAD ALL IMAGES IN PARALLEL
    // -----------------------------------------------------
    //
    // Previously each image was uploaded and inserted one at
    // a time inside a for loop. Ten images meant ten
    // sequential round trips to the image host followed by
    // ten sequential INSERTs. Uploading in parallel and
    // inserting with a single createMany turns that into one
    // wait and one write.

    const uploadResults = await uploadManyToCloudinary(
      files,
      `products/${id}`
    );

    await prisma.productImage.createMany({
      data: uploadResults.map((result, index) => ({
        productId: id,
        url: result.url,
        publicId: result.publicId,
        sortOrder: maxSortOrder + index + 1,
        isPrimary: !alreadyHasPrimary && index === 0,
        altText: product.name
      }))
    });

    // createMany does not return rows, so read back the ones
    // just written for the response.
    const images = await prisma.productImage.findMany({
      where: {
        productId: id,
        publicId: { in: uploadResults.map(result => result.publicId) }
      },
      orderBy: { sortOrder: 'asc' }
    });

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.json({
      success: true,
      data: images
    });

  } catch (error) {

    console.error('Upload product images error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading images'
    });
  }
};

// =========================================================
// DELETE PRODUCT IMAGE
// =========================================================

export const deleteProductImage = async (
  req,
  res
) => {
  try {

    const { imageId } = req.params;

    // -----------------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------------

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required'
      });
    }

    // -----------------------------------------------------
    // FIND IMAGE
    // -----------------------------------------------------

    const image =
      await prisma.productImage.findUnique({
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

    // -----------------------------------------------------
    // DELETE FROM CLOUDINARY
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // DELETE FROM DATABASE
    // -----------------------------------------------------

    await prisma.productImage.delete({
      where: {
        id: imageId
      }
    });

    // -----------------------------------------------------
    // HANDLE PRIMARY IMAGE
    // -----------------------------------------------------

    if (image.isPrimary) {

      const nextImage =
        await prisma.productImage.findFirst({
          where: {
            productId:
              image.productId
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

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {

    console.error('Delete product image error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the image'
    });
  }
};