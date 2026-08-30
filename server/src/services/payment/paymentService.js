import Payment from '../../models/Payment.js';
import Order from '../../models/Order.js';
import Counter from '../../models/Counter.js';
import razorpayService from './razorpayService.js';
import paymentVerificationService from './paymentVerificationService.js';

export const paymentService = {
  /**
   * Helper to generate unique human-readable Payment Number (PAY-YYYYMMDD-XXXXX)
   * Uses MongoDB atomic Counter collection with existing database synchronization
   */
  async generatePaymentNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `PAY-${dateStr}-`;
    const counterId = `paymentNumber_${dateStr}`;

    // 1. Initialize counter sequence if not present for today
    const existingCounter = await Counter.findById(counterId);
    if (!existingCounter) {
      // Find highest existing sequence for today in Payment collection
      const existingPayments = await Payment.find({
        paymentNumber: new RegExp(`^${prefix}`)
      })
        .select('paymentNumber')
        .lean();

      let maxSeq = 0;
      for (const p of existingPayments) {
        if (p.paymentNumber) {
          const parts = p.paymentNumber.split('-');
          const seqNum = parseInt(parts[parts.length - 1], 10);
          if (!isNaN(seqNum) && seqNum > maxSeq) {
            maxSeq = seqNum;
          }
        }
      }

      await Counter.updateOne(
        { _id: counterId },
        { $setOnInsert: { seq: maxSeq } },
        { upsert: true }
      );
    }

    // 2. Perform atomic increment
    const updatedCounter = await Counter.findOneAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const sequence = String(updatedCounter.seq).padStart(5, '0');
    return `${prefix}${sequence}`;
  },

  /**
   * Create Razorpay Payment Order with Trusted Server-Side Amount Calculation & Idempotency
   */
  async createPaymentOrder(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new Error('Order not found or access denied');
    }

    if (order.paymentStatus === 'CAPTURED' || order.paymentStatus === 'PAID') {
      throw new Error('This order has already been paid successfully');
    }

    if (order.orderStatus === 'CANCELLED') {
      throw new Error('Cannot initiate payment for a cancelled order');
    }

    // 1. Calculate trusted amount strictly from database (in INR & Paise)
    const trustedAmountINR = order.total;
    const amountInPaise = Math.round(trustedAmountINR * 100);

    if (amountInPaise <= 0) {
      throw new Error('Invalid order total amount');
    }

    // Idempotency: Check if an active CREATED/PENDING payment record already exists for this order
    let payment = await Payment.findOne({
      order: order._id,
      status: { $in: ['CREATED', 'PENDING'] }
    });

    let razorpayOrder;

    if (payment && payment.razorpayOrderId) {
      // Reuse active payment order cleanly
      razorpayOrder = {
        id: payment.razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR'
      };
    } else {
      let createdPayment = null;
      let attempts = 0;

      while (!createdPayment && attempts < 5) {
        attempts++;
        const paymentNumber = await this.generatePaymentNumber();

        // Create Razorpay Order via SDK
        razorpayOrder = await razorpayService.createRazorpayOrder({
          amountInPaise,
          currency: 'INR',
          receipt: paymentNumber,
          notes: {
            orderNumber: order.orderNumber,
            paymentNumber,
            userId: userId.toString()
          }
        });

        try {
          // Save Payment Model Record with unique paymentNumber
          payment = await Payment.create({
            paymentNumber,
            user: userId,
            order: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: trustedAmountINR,
            currency: 'INR',
            status: 'CREATED',
            metadata: {
              orderNumber: order.orderNumber,
              receipt: razorpayOrder.receipt
            }
          });

          createdPayment = payment;
        } catch (err) {
          if (err.code === 11000) {
            // E11000 Duplicate key retry safeguard: Retry with next atomic sequence
            console.warn(
              `[Payment Retry] Duplicate paymentNumber ${paymentNumber} collided. Retrying attempt ${attempts}...`
            );
            continue;
          }
          throw err;
        }
      }

      if (!createdPayment) {
        throw new Error('Failed to generate unique payment record after multiple attempts');
      }

      // Associate Payment ID & Razorpay Order ID with Order
      order.payment = payment._id;
      order.razorpayOrderId = razorpayOrder.id;
      order.paymentStatus = 'CREATED';
      await order.save();
    }

    return {
      paymentId: payment._id,
      paymentNumber: payment.paymentNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise, // Amount in paise for Razorpay JS SDK
      amountINR: trustedAmountINR,
      currency: 'INR',
      keyId: razorpayService.getKeyId(),
      orderNumber: order.orderNumber
    };
  },

  /**
   * Verify Razorpay Payment Signature & Update Status (IDEMPOTENT)
   */
  async verifyAndCapturePayment(userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required Razorpay verification payload parameters');
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id, user: userId });
    if (!payment) {
      throw new Error('Matching payment record not found');
    }

    // Idempotent Check: If already CAPTURED, return existing record
    if (payment.status === 'CAPTURED') {
      const order = await Order.findById(payment.order);
      return { success: true, payment, order, alreadyProcessed: true };
    }

    // Server-Side HMAC SHA256 Signature Verification
    const isValidSignature = paymentVerificationService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValidSignature) {
      payment.status = 'FAILED';
      payment.failureReason = 'Signature verification failed (HMAC SHA256 mismatch)';
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order) {
        order.paymentStatus = 'FAILED';
        await order.save();
      }

      throw new Error('Payment signature verification failed');
    }

    // Update Payment Model
    payment.status = 'CAPTURED';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.paidAt = new Date();
    await payment.save();

    // Update Order Model
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'CAPTURED';
      order.orderStatus = 'CONFIRMED';
      order.paidAt = new Date();
      await order.save();
    }

    return {
      success: true,
      payment,
      order,
      alreadyProcessed: false
    };
  },

  /**
   * Handle Payment Failure
   */
  async markPaymentFailed(userId, paymentId, failureReason = 'Payment attempt failed or cancelled by user') {
    const payment = await Payment.findOne({ _id: paymentId, user: userId });
    if (!payment) throw new Error('Payment not found');

    if (payment.status !== 'CAPTURED') {
      payment.status = 'FAILED';
      payment.failureReason = failureReason;
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order && order.paymentStatus !== 'CAPTURED') {
        order.paymentStatus = 'FAILED';
        await order.save();
      }
    }

    return payment;
  },

  /**
   * Retry Payment for Failed Order
   */
  async retryPayment(userId, paymentId) {
    const existingPayment = await Payment.findOne({ _id: paymentId, user: userId });
    if (!existingPayment) throw new Error('Payment record not found');

    return await this.createPaymentOrder(userId, existingPayment.order);
  },

  /**
   * Get Customer Payments
   */
  async getCustomerPayments(userId) {
    return await Payment.find({ user: userId })
      .populate('order', 'orderNumber total orderStatus paymentStatus items createdAt')
      .sort({ createdAt: -1 })
      .lean();
  },

  /**
   * Get Single Customer Payment
   */
  async getCustomerPaymentById(userId, paymentId) {
    const payment = await Payment.findOne({ _id: paymentId, user: userId })
      .populate('order')
      .lean();

    if (!payment) throw new Error('Payment not found or unauthorized');
    return payment;
  }
};

export default paymentService;
