import prisma from '../src/config/database.js';

export const getProducts = async (filters = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    categoryId,
    featured,
    active,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters;

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

  return {
    data: products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  };
};