import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getPayments,
  getPaymentById,
  markPaymentFailed,
  retryPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook endpoint does NOT use protect middleware (uses HMAC raw body signature instead)
router.post('/webhook', handleWebhook);

// Customer Protected Endpoints
router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/:id/failed', markPaymentFailed);
router.post('/:id/retry', retryPayment);

export default router;
