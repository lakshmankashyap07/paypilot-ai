import crypto from 'crypto';

export const paymentVerificationService = {
  /**
   * Verify Razorpay Payment Signature for Checkout Callback
   * Expected payload string format: `${razorpay_order_id}|${razorpay_payment_id}`
   */
  verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return false;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_paypilot_key_secret';
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const expBuf = Buffer.from(expectedSignature, 'utf-8');
    const actBuf = Buffer.from(razorpay_signature, 'utf-8');

    if (expBuf.length !== actBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expBuf, actBuf);
  },

  /**
   * Verify Razorpay Webhook Signature using raw payload Buffer & Webhook Secret
   */
  verifyWebhookSignature(rawBodyBuffer, webhookSignatureHeader) {
    if (!rawBodyBuffer || !webhookSignatureHeader) {
      return false;
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_paypilot_webhook_secret';

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBodyBuffer)
      .digest('hex');

    const expBuf = Buffer.from(expectedSignature, 'utf-8');
    const actBuf = Buffer.from(webhookSignatureHeader, 'utf-8');

    if (expBuf.length !== actBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expBuf, actBuf);
  }
};

export default paymentVerificationService;
