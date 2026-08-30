import express from 'express';
import { uploadProductImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/upload - Upload product image (Protected)
router.post('/', protect, uploadProductImage);

export default router;
