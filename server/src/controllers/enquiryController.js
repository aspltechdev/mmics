const prisma = require("../config/database");

// =====================================================
// CREATE ENQUIRY - PUBLIC CONTACT / PRODUCT / MEMBERSHIP
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

    // =====================================================
    // REQUIRED FIELD VALIDATION
    // =====================================================

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    // =====================================================
    // ENQUIRY TYPE
    // =====================================================

    const allowedTypes = [
      "CONTACT",
      "PRODUCT",
      "MEMBERSHIP",
    ];

    const enquiryType = allowedTypes.includes(type)
      ? type
      : "CONTACT";

    // =====================================================
    // PRODUCT ID
    //
    // Product ID should only be saved when enquiry type
    // is PRODUCT.
    // =====================================================

    let validProductId = null;

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

      validProductId = productId;
    }

    // =====================================================
    // CREATE ENQUIRY
    // =====================================================

    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),

        email: email.trim(),

        phone:
          phone && phone.trim()
            ? phone.trim()
            : null,

        subject:
          subject && subject.trim()
            ? subject.trim()
            : null,

        message: message.trim(),

        type: enquiryType,

        status: "NEW",

        productId: validProductId,
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

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message: "Enquiry submitted successfully",

      enquiry: {
        id: enquiry.id,

        name: enquiry.name,

        email: enquiry.email,

        phone: enquiry.phone,

        subject: enquiry.subject,

        message: enquiry.message,

        type: enquiry.type,

        status: enquiry.status,

        product: enquiry.product,

        createdAt: enquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to submit enquiry",
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

    // =====================================================
    // VALID STATUS FILTER
    // =====================================================

    const allowedStatuses = [
      "NEW",
      "READ",
      "REPLIED",
      "CLOSED",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Status must be NEW, READ, REPLIED or CLOSED",
      });
    }

    // =====================================================
    // VALID TYPE FILTER
    // =====================================================

    const allowedTypes = [
      "CONTACT",
      "PRODUCT",
      "MEMBERSHIP",
    ];

    if (
      type &&
      !allowedTypes.includes(type)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Type must be CONTACT, PRODUCT or MEMBERSHIP",
      });
    }

    // =====================================================
    // FETCH ENQUIRIES
    // =====================================================

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

    return res.status(200).json({
      success: true,

      count: enquiries.length,

      enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch enquiries",
    });
  }
};

// =====================================================
// GET SINGLE ENQUIRY - ADMIN
// =====================================================

const getEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // FIND ENQUIRY
    // =====================================================

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

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!enquiry) {
      return res.status(404).json({
        success: false,

        message: "Enquiry not found",
      });
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      enquiry,
    });
  } catch (error) {
    console.error("Get enquiry error:", error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch enquiry",
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

    // =====================================================
    // ALLOWED STATUS
    // =====================================================

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

    // =====================================================
    // CHECK ENQUIRY EXISTS
    // =====================================================

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

    // =====================================================
    // UPDATE STATUS
    // =====================================================

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

    return res.status(200).json({
      success: true,

      message:
        "Enquiry status updated successfully",

      enquiry,
    });
  } catch (error) {
    console.error(
      "Update enquiry status error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to update enquiry status",
    });
  }
};

// =====================================================
// DELETE ENQUIRY - ADMIN
// =====================================================

const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // CHECK ENQUIRY EXISTS
    // =====================================================

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

    // =====================================================
    // DELETE
    // =====================================================

    await prisma.enquiry.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,

      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to delete enquiry",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
};