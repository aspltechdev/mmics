import prisma from '../src/config/database.js';
import { sendEmail } from './emailService.js';

export const createEnquiry = async (data) => {
  const enquiry = await prisma.enquiry.create({
    data,
    include: {
      product: {
        select: { name: true }
      }
    }
  });
  return enquiry;
};

export const sendEnquiryEmails = async (enquiry) => {
  const productName = enquiry.product?.name || 'Not specified';

  // Admin email
  await sendEmail({
    to: process.env.ADMIN_EMAIL || 'info@mmmicslimited.com',
    subject: `New Enquiry: ${productName}`,
    html: `
      <h2>New Product Enquiry</h2>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Customer:</strong> ${enquiry.name}</p>
      <p><strong>Company:</strong> ${enquiry.company || 'Not provided'}</p>
      <p><strong>Email:</strong> ${enquiry.email}</p>
      <p><strong>Phone:</strong> ${enquiry.phone}</p>
      <p><strong>Quantity:</strong> ${enquiry.quantity || 'Not specified'}</p>
      <p><strong>Requirements:</strong> ${enquiry.requirements || 'Not specified'}</p>
      <p><strong>Message:</strong> ${enquiry.message || 'No message'}</p>
      <br>
      <p><a href="${process.env.FRONTEND_URL}/admin/enquiries/${enquiry.id}">View Enquiry</a></p>
    `
  });

  // Customer acknowledgement
  await sendEmail({
    to: enquiry.email,
    subject: 'Thank you for your enquiry - MMMICS Limited',
    html: `
      <h2>Thank You for Your Enquiry</h2>
      <p>Dear ${enquiry.name},</p>
      <p>Thank you for your interest in MMMICS Limited. We have received your enquiry and our team will get back to you within 24 hours.</p>
      <p><strong>Enquiry Details:</strong></p>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Quantity:</strong> ${enquiry.quantity || 'Not specified'}</p>
      <p><strong>Your Message:</strong> ${enquiry.message || 'No message'}</p>
      <br>
      <p>Best regards,</p>
      <p><strong>MMMICS Limited Team</strong></p>
      <p>Packaging Solutions for MSMEs</p>
      <p>Phone: ${process.env.COMPANY_PHONE || '0484 265 4871'}</p>
      <p>Email: ${process.env.COMPANY_EMAIL || 'info@mmmicslimited.com'}</p>
    `
  });
};