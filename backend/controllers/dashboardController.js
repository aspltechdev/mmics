/**
 * =========================================================
 * ADMIN DASHBOARD
 * =========================================================
 *
 * One endpoint that returns every number the dashboard shows.
 *
 * What this replaces: the dashboard used to fire six separate
 * list requests (products, enquiries, contacts, directors,
 * gallery, news), each pulling up to 100 *full rows* --
 * including joined categories and image arrays -- and then
 * called `.length` on the result.
 *
 * That was slow for three reasons:
 *   1. six round trips instead of one
 *   2. hundreds of rows and joins transferred to count them
 *   3. the counts were wrong anyway, because `limit: 100`
 *      capped them at 100
 *
 * Here every figure is a COUNT run inside a single
 * transaction, so it is one round trip to Neon and the
 * database returns integers rather than rows.
 */

import prisma from '../src/config/database.js';

/**
 * Small in-process cache. The dashboard is polled every time
 * an admin navigates back to it; recomputing on every visit
 * is wasteful when the numbers barely move.
 */
const CACHE_TTL_MS = Number(process.env.DASHBOARD_CACHE_MS || 15000);

let cache = {
  payload: null,
  expiresAt: 0,
};

export const invalidateDashboardCache = () => {
  cache = { payload: null, expiresAt: 0 };
};

/* =========================================================
   GET /api/dashboard/stats
   ========================================================= */

export const getDashboardStats = async (req, res) => {
  try {
    const now = Date.now();

    if (cache.payload && cache.expiresAt > now && req.query.refresh !== 'true') {
      return res.json({
        success: true,
        data: cache.payload,
        cached: true,
      });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // $transaction batches these into a single round trip.
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      enquiriesThisMonth,
      totalContacts,
      unreadContacts,
      totalDirectors,
      totalGallery,
      totalNews,
      publishedNews,
      totalTestimonials,
      totalMembers,
      activeMembers,
      recentEnquiries,
      recentMembers,
    ] = await prisma.$transaction([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
      prisma.director.count(),
      prisma.galleryImage.count(),
      prisma.news.count(),
      prisma.news.count({ where: { isPublished: true } }),
      prisma.testimonial.count(),
      prisma.member.count(),
      prisma.member.count({ where: { isActive: true } }),

      // Only the columns the table renders, only 5 rows.
      prisma.enquiry.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          product: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      prisma.member.findMany({
        select: {
          id: true,
          name: true,
          membershipNumber: true,
          profileImage: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const payload = {
      stats: {
        products: totalProducts,
        activeProducts,
        categories: totalCategories,
        enquiries: totalEnquiries,
        newEnquiries,
        enquiriesThisMonth,
        contacts: totalContacts,
        unreadContacts,
        directors: totalDirectors,
        gallery: totalGallery,
        news: totalNews,
        publishedNews,
        testimonials: totalTestimonials,
        members: totalMembers,
        activeMembers,
      },
      recentEnquiries,
      recentMembers,
      generatedAt: new Date().toISOString(),
    };

    cache = {
      payload,
      expiresAt: now + CACHE_TTL_MS,
    };

    res.json({
      success: true,
      data: payload,
      cached: false,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while loading dashboard statistics',
    });
  }
};
