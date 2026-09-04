import express from 'express';
import {
  handleNaturalSearch,
  handleCompareProducts,
  handleBudgetGuard,
  handleSmartBundles,
  handlePriceIntelligence,
  handleSmartWishlist,
  handlePersonalizedFeed,
  handleCheckoutAssistant
} from '../controllers/aiIntelligenceController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Optional Auth Routes
router.post('/natural-search', handleNaturalSearch);
router.post('/compare', handleCompareProducts);
router.get('/bundles/:productId', handleSmartBundles);
router.get('/price-intelligence/:productId', handlePriceIntelligence);
router.get('/for-you', optionalAuth, handlePersonalizedFeed);

// Protected User Routes
router.post('/budget-guard', protect, handleBudgetGuard);
router.get('/smart-wishlist', protect, handleSmartWishlist);
router.post('/checkout-summary', protect, handleCheckoutAssistant);

export default router;
