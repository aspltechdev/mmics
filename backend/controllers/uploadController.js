import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

export const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await uploadToCloudinary(req.file, req.body.folder || 'uploads');

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId
      }
    });
  } catch (error) {
    console.error('Upload single error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const results = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file, req.body.folder || 'uploads');
      results.push({
        url: result.url,
        publicId: result.publicId
      });
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    await deleteFromCloudinary(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};