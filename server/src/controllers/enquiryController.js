const prisma = require("../config/database");

// =====================================================
// CREATE ENQUIRY - PUBLIC CONTACT / PRODUCT FORM
// =====================================================

const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      type,
      productId,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const enquiryType =
      type === "PRODUCT" ? "PRODUCT" : "CONTACT";

    // If product enquiry, verify product exists
    if (enquiryType === "PRODUCT" && productId) {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        type: enquiryType,
        status: "NEW",
        productId: productId || null,
      },

      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry: {
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        type: enquiry.type,
        status: enquiry.status,
        product: enquiry.product,
        createdAt: enquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit enquiry",
    });
  }
};

// =====================================================
// GET ALL ENQUIRIES - ADMIN
// =====================================================

const getEnquiries = async (req, res) => {
  try {
    const {
      status,
      type,
      productId,
    } = req.query;

    const enquiries = await prisma.enquiry.findMany({
      where: {
        ...(status && {
          status,
        }),

        ...(type && {
          type,
        }),

        ...(productId && {
          productId,
        }),
      },

      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch enquiries",
    });
  }
};

// =====================================================
// GET SINGLE ENQUIRY - ADMIN
// =====================================================

const getEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: {
        id,
      },

      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error("Get enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch enquiry",
    });
  }
};

// =====================================================
// UPDATE ENQUIRY STATUS - ADMIN
// =====================================================

const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "NEW",
      "READ",
      "REPLIED",
      "CLOSED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be NEW, READ, REPLIED or CLOSED",
      });
    }

    const existingEnquiry =
      await prisma.enquiry.findUnique({
        where: {
          id,
        },
      });

    if (!existingEnquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    const enquiry = await prisma.enquiry.update({
      where: {
        id,
      },

      data: {
        status,
      },

      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Enquiry status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error(
      "Update enquiry status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update enquiry status",
    });
  }
};

// =====================================================
// DELETE ENQUIRY - ADMIN
// =====================================================

const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: {
        id,
      },
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await prisma.enquiry.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete enquiry",
    });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
};