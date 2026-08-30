import express from 'express';
import {
  getOverview,
  getSalesAnalytics,
  getOrderAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getPaymentAnalytics,
  getFunnelAnalytics,
  getSearchAnalytics,
  getCategoryAnalytics,
  getInventoryAnalytics,
  getCartAbandonmentAnalytics,
  getAIMetrics,
  exportCSV
} from '../controllers/analyticsController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require Authentication & Merchant/Admin Authorization
router.use(protect);
router.use(authorizeRoles('MERCHANT', 'ADMIN'));

// Analytics Endpoints
router.get('/overview', getOverview);
router.get('/sales', getSalesAnalytics);
router.get('/orders', getOrderAnalytics);
router.get('/products', getProductAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/payments', getPaymentAnalytics);
router.get('/funnel', getFunnelAnalytics);
router.get('/search', getSearchAnalytics);
router.get('/categories', getCategoryAnalytics);
router.get('/inventory', getInventoryAnalytics);
router.get('/cart-abandonment', getCartAbandonmentAnalytics);
router.get('/ai', getAIMetrics);
router.get('/export', exportCSV);

export default router;
