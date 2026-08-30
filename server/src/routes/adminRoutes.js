import express from 'express';
import {
  getDashboardOverview,
  getUsers,
  updateUserStatus,
  getMerchants,
  updateMerchantStatus,
  approveMerchant,
  rejectMerchant,
  suspendMerchant,
  getProducts,
  updateProductStatus,
  getOrders,
  getAIObservability,
  getSecurityEvents,
  getAuditLogs,
  getSystemHealth
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require Authentication & Admin Authorization
router.use(protect);
router.use(authorizeRoles('ADMIN'));

router.get('/dashboard', getDashboardOverview);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/merchants', getMerchants);
router.patch('/merchants/:id/status', updateMerchantStatus);
router.patch('/merchants/:id/approve', approveMerchant);
router.patch('/merchants/:id/reject', rejectMerchant);
router.patch('/merchants/:id/suspend', suspendMerchant);
router.get('/products', getProducts);
router.patch('/products/:id/status', updateProductStatus);
router.get('/orders', getOrders);
router.get('/ai', getAIObservability);
router.get('/security-events', getSecurityEvents);
router.get('/audit-logs', getAuditLogs);
router.get('/health', getSystemHealth);

export default router;
