import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getCategories,
  getBrands
} from '../controllers/productController.js';
import {
  getProductReviews,
  createReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Static product discovery endpoints
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/slug/:slug', getProductBySlug);

// Product reviews nested endpoints
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createReview);

// General product list and detail endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
