import prisma from '../src/config/database.js';
import { sendEmail } from '../src/config/email.js';

export const submitEnquiry = async (req, res) => {
  try {
    const {
      productId,
      name,
      company,
      email,
      phone,
      quantity,
      requirements,
      message
    } = req.body;

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const enquiry = await prisma.enquiry.create({
      data: {
        productId,
        name,
        company,
        email,
        phone,
        quantity,
        requirements,
        message,
        ipAddress,
        userAgent
      },
      include: {
        product: {
          select: { name: true }
        }
      }
    });

    // Get product name
    let productName = 'Not specified';
    if (enquiry.product) {
      productName = enquiry.product.name;
    }

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@mmmicslimited.com',
      subject: `New Enquiry: ${productName}`,
      html: `
        <h2>New Product Enquiry</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Quantity:</strong> ${quantity || 'Not specified'}</p>
        <p><strong>Requirements:</strong> ${requirements || 'Not specified'}</p>
        <p><strong>Message:</strong> ${message || 'No message'}</p>
        <br>
        <p><a href="${process.env.FRONTEND_URL}/admin/enquiries/${enquiry.id}">View Enquiry</a></p>
      `
    });

    // Send acknowledgement to customer
    await sendEmail({
      to: email,
      subject: 'Thank you for your enquiry - MMMICS Limited',
      html: `
        <h2>Thank You for Your Enquiry</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your interest in MMMICS Limited. We have received your enquiry and our team will get back to you within 24 hours.</p>
        <p><strong>Enquiry Details:</strong></p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Quantity:</strong> ${quantity || 'Not specified'}</p>
        <p><strong>Your Message:</strong> ${message || 'No message'}</p>
        <br>
        <p>Best regards,</p>
        <p><strong>MMMICS Limited Team</strong></p>
        <p>Packaging Solutions for MSMEs</p>
        <p>Phone: ${process.env.COMPANY_PHONE || '0484 265 4871'}</p>
        <p>Email: ${process.env.COMPANY_EMAIL || 'info@mmmicslimited.com'}</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry
    });
  } catch (error) {
    console.error('Submit enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const { status, productId, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (productId) where.productId = productId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, slug: true }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.enquiry.count({ where })
    ]);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, name: true, slug: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedToId, internalNotes } = req.body;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id }
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status,
        assignedToId,
        internalNotes
      },
      include: {
        product: {
          select: { name: true }
        },
        assignedTo: {
          select: { name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id }
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    await prisma.enquiry.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};