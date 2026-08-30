import paymentService from '../services/payment/paymentService.js';
import webhookService from '../services/payment/webhookService.js';

/**
 * @desc Create Razorpay payment order for internal order
 * @route POST /api/payments/create-order
 * @access Private (Customer)
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const result = await paymentService.createPaymentOrder(req.user._id, orderId);
    res.status(200).json({
      success: true,
      message: 'Razorpay payment order initialized',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verify Razorpay payment HMAC SHA256 signature
 * @route POST /api/payments/verify
 * @access Private (Customer)
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const result = await paymentService.verifyAndCapturePayment(req.user._id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Handle Razorpay Webhooks with raw body verification & idempotency
 * @route POST /api/payments/webhook
 * @access Public (Webhook Signature Verified)
 */
export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));

    const result = await webhookService.processWebhookEvent(rawBody, signature, req.body);
    res.status(200).json({ success: true, message: 'Webhook processed', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get customer payment history
 * @route GET /api/payments
 * @access Private (Customer)
 */
export const getPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getCustomerPayments(req.user._id);
    res.status(200).json({
      success: true,
      data: { payments }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single customer payment
 * @route GET /api/payments/:id
 * @access Private (Customer)
 */
export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getCustomerPaymentById(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Mark payment attempt as failed
 * @route POST /api/payments/:id/failed
 * @access Private (Customer)
 */
export const markPaymentFailed = async (req, res, next) => {
  try {
    const { failureReason } = req.body;
    const payment = await paymentService.markPaymentFailed(
      req.user._id,
      req.params.id,
      failureReason || 'Payment attempt failed'
    );
    res.status(200).json({
      success: true,
      message: 'Payment marked as failed',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Retry payment for failed order
 * @route POST /api/payments/:id/retry
 * @access Private (Customer)
 */
export const retryPayment = async (req, res, next) => {
  try {
    const result = await paymentService.retryPayment(req.user._id, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Payment retry order created',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
