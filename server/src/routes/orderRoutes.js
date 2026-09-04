import express from 'express';
import {
  validateCheckout,
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  requestReturnOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order endpoints require authentication

router.post('/validate-checkout', validateCheckout);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.post('/:id/return', requestReturnOrder);

export default router;
