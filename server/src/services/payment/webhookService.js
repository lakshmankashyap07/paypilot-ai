import paymentVerificationService from './paymentVerificationService.js';
import PaymentEvent from '../../models/PaymentEvent.js';
import Payment from '../../models/Payment.js';
import Order from '../../models/Order.js';

export const webhookService = {
  /**
   * Process incoming Razorpay Webhook event with raw body signature verification & idempotency
   */
  async processWebhookEvent(rawBodyBuffer, webhookSignatureHeader, eventPayload) {
    // 1. Verify Webhook Signature using raw body buffer
    const isValid = paymentVerificationService.verifyWebhookSignature(
      rawBodyBuffer,
      webhookSignatureHeader
    );

    if (!isValid) {
      throw new Error('Invalid Razorpay Webhook signature');
    }

    const { event, payload } = eventPayload || {};
    const eventId = eventPayload?.contains?.[0] || eventPayload?.payload?.payment?.entity?.id || `evt_${Date.now()}`;

    // 2. Idempotency Check: Prevent duplicate webhook processing
    const existingEvent = await PaymentEvent.findOne({ eventId });
    if (existingEvent && existingEvent.processed) {
      return { success: true, message: 'Webhook event already processed (idempotent)', eventId };
    }

    // Record Event log
    await PaymentEvent.create({
      eventId,
      eventType: event || 'unknown',
      processed: false
    });

    // 3. Dispatch Webhook Events
    if (event === 'payment.captured' || event === 'payment.authorized') {
      const pData = payload?.payment?.entity;
      if (pData) {
        const razorpayOrderId = pData.order_id;
        const razorpayPaymentId = pData.id;

        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment && payment.status !== 'CAPTURED') {
          payment.status = 'CAPTURED';
          payment.razorpayPaymentId = razorpayPaymentId;
          payment.paidAt = new Date();
          await payment.save();

          const order = await Order.findById(payment.order);
          if (order && order.paymentStatus !== 'CAPTURED') {
            order.paymentStatus = 'CAPTURED';
            order.orderStatus = 'CONFIRMED';
            order.paidAt = new Date();
            await order.save();
          }
        }
      }
    } else if (event === 'payment.failed') {
      const pData = payload?.payment?.entity;
      if (pData) {
        const razorpayOrderId = pData.order_id;
        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment && payment.status !== 'CAPTURED') {
          payment.status = 'FAILED';
          payment.failureReason = pData.error_description || 'Payment failed via webhook notification';
          await payment.save();

          const order = await Order.findById(payment.order);
          if (order && order.paymentStatus !== 'CAPTURED') {
            order.paymentStatus = 'FAILED';
            await order.save();
          }
        }
      }
    } else if (event === 'payment.refunded') {
      const pData = payload?.payment?.entity;
      if (pData) {
        const razorpayOrderId = pData.order_id;
        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment) {
          payment.status = 'REFUNDED';
          await payment.save();

          const order = await Order.findById(payment.order);
          if (order) {
            order.paymentStatus = 'REFUNDED';
            await order.save();
          }
        }
      }
    }

    // Mark event processed
    await PaymentEvent.updateOne(
      { eventId },
      { processed: true, processedAt: new Date() }
    );

    return { success: true, eventId, eventType: event };
  }
};

export default webhookService;
