import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const getNews = async (req, res) => {
  try {
    const { published, page = 1, limit = 10 } = req.query;

    const where = {};
    if (published === 'true') where.isPublished = true;
    if (published === 'false') where.isPublished = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.news.count({ where })
    ]);

    res.json({
      success: true,
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const news = await prisma.news.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      isPublished,
      publishedAt,
      seoTitle,
      seoDescription
    } = req.body;

    const existing = await prisma.news.findUnique({
      where: { slug }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    let coverData = {};
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'news');
      coverData = {
        coverImage: result.url,
        coverImagePublicId: result.publicId
      };
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        authorId: req.user.id,
        isPublished: isPublished === 'true',
        publishedAt: publishedAt ? new Date(publishedAt) : (isPublished === 'true' ? new Date() : null),
        seoTitle,
        seoDescription,
        ...coverData
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      isPublished,
      publishedAt,
      seoTitle,
      seoDescription
    } = req.body;

    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    if (slug && slug !== news.slug) {
      const existing = await prisma.news.findUnique({
        where: { slug }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    let coverData = {};
    if (req.file) {
      if (news.coverImagePublicId) {
        await deleteFromCloudinary(news.coverImagePublicId);
      }
      const result = await uploadToCloudinary(req.file, 'news');
      coverData = {
        coverImage: result.url,
        coverImagePublicId: result.publicId
      };
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        isPublished: isPublished === 'true',
        publishedAt: publishedAt ? new Date(publishedAt) : (isPublished === 'true' ? new Date() : null),
        seoTitle,
        seoDescription,
        ...coverData
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    if (news.coverImagePublicId) {
      await deleteFromCloudinary(news.coverImagePublicId);
    }

    await prisma.news.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};