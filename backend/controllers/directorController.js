import prisma from '../src/config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const getDirectors = async (req, res) => {
  try {
    const { active } = req.query;

    const where = {};
    if (active === 'true') where.isActive = true;

    const directors = await prisma.director.findMany({
      where,
      orderBy: { displayOrder: 'asc' }
    });

    res.json({
      success: true,
      data: directors
    });
  } catch (error) {
    console.error('Get directors error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching directors' // ✅ Generic error message
    });
  }
};

export const getDirectorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Director ID is required'
      });
    }

    const director = await prisma.director.findUnique({
      where: { id }
    });

    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    res.json({
      success: true,
      data: director
    });
  } catch (error) {
    console.error('Get director error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the director' // ✅ Generic error message
    });
  }
};

export const createDirector = async (req, res) => {
  try {
    const {
      name,
      designation,
      qualification,
      experience,
      biography,
      linkedinUrl,
      displayOrder,
      isActive
    } = req.body;

    // ✅ Validate required fields
    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Name and designation are required'
      });
    }

    let photoData = {};
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'directors');
      photoData = {
        photo: result.url,
        photoPublicId: result.publicId
      };
    }

    const director = await prisma.director.create({
      data: {
        name,
        designation,
        qualification,
        experience,
        biography,
        linkedinUrl,
        displayOrder: parseInt(displayOrder) || 0,
        isActive: isActive !== undefined ? isActive : true,
        ...photoData
      }
    });

    res.status(201).json({
      success: true,
      data: director
    });
  } catch (error) {
    console.error('Create director error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the director' // ✅ Generic error message
    });
  }
};

export const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      designation,
      qualification,
      experience,
      biography,
      linkedinUrl,
      displayOrder,
      isActive
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Director ID is required'
      });
    }

    const director = await prisma.director.findUnique({
      where: { id }
    });

    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    let photoData = {};
    if (req.file) {
      if (director.photoPublicId) {
        await deleteFromCloudinary(director.photoPublicId);
      }
      const result = await uploadToCloudinary(req.file, 'directors');
      photoData = {
        photo: result.url,
        photoPublicId: result.publicId
      };
    }

    const updated = await prisma.director.update({
      where: { id },
      data: {
        name,
        designation,
        qualification,
        experience,
        biography,
        linkedinUrl,
        displayOrder: parseInt(displayOrder) || 0,
        isActive,
        ...photoData
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update director error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the director' // ✅ Generic error message
    });
  }
};

export const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Director ID is required'
      });
    }

    const director = await prisma.director.findUnique({
      where: { id }
    });

    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found'
      });
    }

    if (director.photoPublicId) {
      await deleteFromCloudinary(director.photoPublicId);
    }

    await prisma.director.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Director deleted successfully'
    });
  } catch (error) {
    console.error('Delete director error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the director' // ✅ Generic error message
    });
  }
};