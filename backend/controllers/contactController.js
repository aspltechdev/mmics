import prisma from '../src/config/database.js';
import { sendEmail } from '../src/config/email.js';

// ✅ Email validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Sanitize email to prevent injection
const sanitizeEmail = (email) => {
  // Remove any newlines or carriage returns
  return email.replace(/[\r\n]/g, '').trim();
};

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    // ✅ Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // ✅ Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        subject,
        message,
        ipAddress,
        userAgent
      }
    });

    // Send email notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@mmmicslimited.com',
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // Send auto-reply to customer
    await sendEmail({
      to: sanitizedEmail, // ✅ Using sanitized email
      subject: 'Thank you for contacting MMMICS Limited',
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to MMMICS Limited. We have received your message and our team will get back to you within 24 hours.</p>
        <p>Your message details:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <br>
        <p>Best regards,</p>
        <p><strong>MMMICS Limited Team</strong></p>
        <p>Packaging Solutions for MSMEs</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: contact
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your message' // ✅ Generic error message
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // ✅ Validate and sanitize pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};
    if (status) where.status = status;

    const [contacts, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber
      }),
      prisma.contactMessage.count({ where })
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching contacts' // ✅ Generic error message
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID is required'
      });
    }

    const contact = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the contact' // ✅ Generic error message
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID is required'
      });
    }

    const contact = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the contact' // ✅ Generic error message
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Contact ID is required'
      });
    }

    const contact = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await prisma.contactMessage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the contact' // ✅ Generic error message
    });
  }
};