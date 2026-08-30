import express from 'express';
import {
  registerMerchant,
  getMerchantDashboard,
  getMerchantProducts,
  createProduct,
  updateProduct,
  updateProductStock,
  updateProductStatus,
  deleteProduct,
  getMerchantOrders,
  updateOrderStatus,
  getMerchantPayments,
  getMerchantPaymentById
} from '../controllers/merchantController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Merchant Registration Endpoint
router.post('/register', registerMerchant);

// Require Authentication & Merchant/Admin Authorization for Dashboard APIs
router.use(protect);
router.use(authorizeRoles('MERCHANT', 'ADMIN'));

// Dashboard
router.get('/dashboard', getMerchantDashboard);

// Merchant Products CRUD
router.get('/products', getMerchantProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.patch('/products/:id/stock', updateProductStock);
router.patch('/products/:id/status', updateProductStatus);
router.delete('/products/:id', deleteProduct);

// Merchant Orders
router.get('/orders', getMerchantOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Merchant Payments
router.get('/payments', getMerchantPayments);
router.get('/payments/:id', getMerchantPaymentById);

export default router;
