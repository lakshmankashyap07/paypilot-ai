import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target uploads directory at server/uploads
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload Product Image
 * POST /api/upload
 */
export const uploadProductImage = async (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }

    // Extract Base64 Mime Type & Data
    const matches = image.match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i);
    if (!matches) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Only PNG, JPG, JPEG, and WEBP image files are allowed.'
      });
    }

    const mimeType = matches[1].toLowerCase();
    const ext = matches[2].toLowerCase() === 'jpeg' ? 'jpg' : matches[2].toLowerCase();
    const base64Data = matches[3];

    // Estimate file size in bytes
    const fileBuffer = Buffer.from(base64Data, 'base64');
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    if (fileBuffer.length > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: `Image file size (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum limit of 5MB.`
      });
    }

    // Generate safe unique filename
    const safeFilename = `prod_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${ext}`;
    const filePath = path.join(uploadsDir, safeFilename);

    // Save image to disk
    fs.writeFileSync(filePath, fileBuffer);

    // Return accessible relative image URL
    const imageUrl = `/uploads/${safeFilename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: safeFilename,
        mimeType,
        size: fileBuffer.length
      }
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};
