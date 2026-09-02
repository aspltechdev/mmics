import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (featured === 'true') where.isFeatured = true;
    if (active === 'true') where.isActive = true;
    if (active === 'false') where.isActive = false;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
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

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true
      },
      take: 4,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        }
      }
    });

    res.json({
      success: true,
      data: { ...product, related }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

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

    const existing = await prisma.product.findUnique({
      where: { slug }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        shortDescription,
        fullDescription,
        material,
        specifications: specifications || {},
        applications: applications || [],
        moq,
        customization,
        isFeatured: isFeatured === 'true',
        isActive: isActive !== undefined ? isActive === 'true' : true,
        seoTitle,
        seoDescription
      },
      include: {
        category: true
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

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (slug && slug !== product.slug) {
      const existing = await prisma.product.findUnique({
        where: { slug }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
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
        isFeatured: isFeatured === 'true',
        isActive: isActive !== undefined ? isActive === 'true' : true,
        seoTitle,
        seoDescription
      },
      include: {
        category: true,
        images: true
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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      await deleteFromCloudinary(image.publicId);
    }

    await prisma.product.delete({
      where: { id }
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
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const images = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadToCloudinary(files[i], `products/${id}`);
      const isPrimary = i === 0;

      const image = await prisma.productImage.create({
        data: {
          productId: id,
          url: result.url,
          publicId: result.publicId,
          sortOrder: i,
          isPrimary,
          altText: product.name
        }
      });
      images.push(image);
    }

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Upload product images error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.productImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    await deleteFromCloudinary(image.publicId);

    await prisma.productImage.delete({
      where: { id: imageId }
    });

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete product image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};