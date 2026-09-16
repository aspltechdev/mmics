const prisma = require("../config/database");

const getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalMembers,
      activeMembers,
      inactiveMembers,

      totalProducts,
      activeProducts,
      inactiveProducts,

      totalCategories,
      activeCategories,

      totalGalleries,
      activeGalleries,

      totalHeroSlides,
      activeHeroSlides,

      totalEnquiries,
      newEnquiries,
      readEnquiries,
      repliedEnquiries,
      closedEnquiries,

      recentMembers,
      recentProducts,
      recentEnquiries,
    ] = await Promise.all([
      // MEMBERS
      prisma.member.count(),

      prisma.member.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.member.count({
        where: {
          status: "INACTIVE",
        },
      }),

      // PRODUCTS
      prisma.product.count(),

      prisma.product.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.product.count({
        where: {
          status: "INACTIVE",
        },
      }),

      // CATEGORIES
      prisma.productCategory.count(),

      prisma.productCategory.count({
        where: {
          isActive: true,
        },
      }),

      // GALLERIES
      prisma.gallery.count(),

      prisma.gallery.count({
        where: {
          isActive: true,
        },
      }),

      // HERO SLIDES
      prisma.heroSlide.count(),

      prisma.heroSlide.count({
        where: {
          isActive: true,
        },
      }),

      // ENQUIRIES
      prisma.enquiry.count(),

      prisma.enquiry.count({
        where: {
          status: "NEW",
        },
      }),

      prisma.enquiry.count({
        where: {
          status: "READ",
        },
      }),

      prisma.enquiry.count({
        where: {
          status: "REPLIED",
        },
      }),

      prisma.enquiry.count({
        where: {
          status: "CLOSED",
        },
      }),

      // RECENT MEMBERS
      prisma.member.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          membershipNumber: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,
        },
      }),

      // RECENT PRODUCTS
      prisma.product.findMany({
        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,

          category: {
            select: {
              id: true,
              name: true,
            },
          },

          images: {
            take: 1,

            orderBy: {
              createdAt: "asc",
            },

            select: {
              imageUrl: true,
            },
          },
        },
      }),

      // RECENT ENQUIRIES
      prisma.enquiry.findMany({
        take: 10,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          subject: true,
          message: true,
          type: true,
          status: true,
          createdAt: true,

          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,

      analytics: {
        members: {
          total: totalMembers,
          active: activeMembers,
          inactive: inactiveMembers,
        },

        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
        },

        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive:
            totalCategories - activeCategories,
        },

        galleries: {
          total: totalGalleries,
          active: activeGalleries,
          inactive:
            totalGalleries - activeGalleries,
        },

        heroSlides: {
          total: totalHeroSlides,
          active: activeHeroSlides,
          inactive:
            totalHeroSlides - activeHeroSlides,
        },

        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          read: readEnquiries,
          replied: repliedEnquiries,
          closed: closedEnquiries,
        },
      },

      recent: {
        members: recentMembers,
        products: recentProducts,
        enquiries: recentEnquiries,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard analytics",
    });
  }
};

module.exports = {
  getDashboardAnalytics,
};