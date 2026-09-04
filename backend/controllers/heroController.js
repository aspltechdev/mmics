import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

// Get hero content (public)
export const getHero = async (req, res) => {
  try {
    let hero = await prisma.hero.findFirst();
    
    if (!hero) {
      // Create default hero if none exists
      hero = await prisma.hero.create({
        data: {
          title: 'Welcome to MMMICS Limited',
          subtitle: 'Packaging Solutions for MSMEs, Cooperatives & Businesses',
          ctaText: 'Explore Products',
          ctaLink: '/products',
          ctaText2: 'Request a Quote',
          ctaLink2: '/quote',
          isActive: true,
        },
      });
    }
    
    res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update hero content (Admin only)
export const updateHero = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      ctaText,
      ctaLink,
      ctaText2,
      ctaLink2,
      isActive,
    } = req.body;

    let hero = await prisma.hero.findFirst();

    let imageData = {};
    if (req.file) {
      if (hero?.backgroundImagePublicId) {
        await deleteFromCloudinary(hero.backgroundImagePublicId);
      }
      const result = await uploadToCloudinary(req.file, 'hero');
      imageData = {
        backgroundImage: result.url,
        backgroundImagePublicId: result.publicId,
      };
    }

    if (!hero) {
      hero = await prisma.hero.create({
        data: {
          title: title || 'Welcome to MMMICS Limited',
          subtitle: subtitle || 'Packaging Solutions for MSMEs, Cooperatives & Businesses',
          ctaText: ctaText || 'Explore Products',
          ctaLink: ctaLink || '/products',
          ctaText2: ctaText2 || 'Request a Quote',
          ctaLink2: ctaLink2 || '/quote',
          isActive: isActive !== undefined ? isActive : true,
          ...imageData,
        },
      });
    } else {
      hero = await prisma.hero.update({
        where: { id: hero.id },
        data: {
          title,
          subtitle,
          ctaText,
          ctaLink,
          ctaText2,
          ctaLink2,
          isActive: isActive !== undefined ? isActive : true,
          ...imageData,
        },
      });
    }

    res.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};