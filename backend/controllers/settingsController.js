import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          companyName: 'MMMICS Limited',
          tagline: 'Packaging Solutions for MSMEs',
          email: 'info@mmmicslimited.com',
          phone: '0484 265 4871',
          address: 'Kadavanthara, Ernakulam, Kerala',
          footerText: 'MMMICS Limited - Packaging Solutions',
          copyright: '© 2024 MMMICS Limited. All rights reserved.',
          metaTitle: 'MMMICS Limited - Packaging Solutions for MSMEs',
          metaDescription: 'MMMICS Limited is a cooperative organization focused on providing quality packaging solutions for MSMEs, cooperatives, and businesses.'
        }
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      companyName,
      tagline,
      email,
      phone,
      whatsapp,
      address,
      googleMapsUrl,
      facebook,
      instagram,
      linkedin,
      twitter,
      youtube,
      footerText,
      copyright,
      metaTitle,
      metaDescription
    } = req.body;

    let settings = await prisma.siteSettings.findFirst();

    let logoData = {};
    if (req.files && req.files.logo) {
      if (settings?.logoPublicId) {
        await deleteFromCloudinary(settings.logoPublicId);
      }
      const result = await uploadToCloudinary(req.files.logo[0], 'settings');
      logoData = {
        logo: result.url,
        logoPublicId: result.publicId
      };
    }

    let faviconData = {};
    if (req.files && req.files.favicon) {
      if (settings?.faviconPublicId) {
        await deleteFromCloudinary(settings.faviconPublicId);
      }
      const result = await uploadToCloudinary(req.files.favicon[0], 'settings');
      faviconData = {
        favicon: result.url,
        faviconPublicId: result.publicId
      };
    }

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          companyName,
          tagline,
          email,
          phone,
          whatsapp,
          address,
          googleMapsUrl,
          facebook,
          instagram,
          linkedin,
          twitter,
          youtube,
          footerText,
          copyright,
          metaTitle,
          metaDescription,
          ...logoData,
          ...faviconData
        }
      });
    } else {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          companyName,
          tagline,
          email,
          phone,
          whatsapp,
          address,
          googleMapsUrl,
          facebook,
          instagram,
          linkedin,
          twitter,
          youtube,
          footerText,
          copyright,
          metaTitle,
          metaDescription,
          ...logoData,
          ...faviconData
        }
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};