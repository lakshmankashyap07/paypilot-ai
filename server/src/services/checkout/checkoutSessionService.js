import CheckoutSession from '../../models/CheckoutSession.js';
import Order from '../../models/Order.js';
import cartService from '../cartService.js';
import addressService from '../addressService.js';
import orderService from '../orderService.js';
import paymentService from '../payment/paymentService.js';

export const checkoutSessionService = {
  /**
   * Prepare Agentic Checkout Session & Return Server-Calculated Summary
   */
  async prepareCheckout(userId, conversationId = null, addressId = null) {
    // 1. Get and Validate Cart
    const cart = await cartService.getCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Your shopping cart is empty. Please add products before checking out.');
    }

    const validation = await cartService.validateCart(userId);
    if (!validation.isValid) {
      throw new Error(`Checkout validation failed: ${validation.warnings.join(' ')}`);
    }

    // 2. Select Shipping Address
    let address = null;
    if (addressId) {
      address = await addressService.getAddressById(userId, addressId);
    }
    if (!address) {
      const addresses = await addressService.getAddresses(userId);
      if (addresses.length > 0) {
        address = addresses.find((a) => a.isDefault) || addresses[0];
      }
    }

    if (!address) {
      throw new Error('Please add a delivery address to your account before proceeding to checkout.');
    }

    // 3. Server-side summary calculation
    const summary = {
      subtotal: cart.subtotal,
      discount: cart.discount,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      itemCount: cart.items.length,
      addressSnapshot: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode
      },
      addressId: address._id.toString()
    };

    // 4. Create or Update CheckoutSession
    const checkoutSession = await CheckoutSession.create({
      user: userId,
      conversation: conversationId,
      cart: cart._id,
      state: 'AWAITING_CONFIRMATION',
      checkoutSummary: summary
    });

    return {
      checkoutSessionId: checkoutSession._id.toString(),
      summary,
      message: `Your order summary is ready: Subtotal ₹${summary.subtotal}, Tax ₹${summary.tax}, Shipping ₹${summary.shipping}, Total ₹${summary.total}. Shipping to ${summary.addressSnapshot.fullName}, ${summary.addressSnapshot.city}. Would you like me to place this order?`
    };
  },

  /**
   * Confirm Checkout and Create Order (Only after explicit user confirmation)
   */
  async confirmCheckout(userId, checkoutSessionId = null) {
    let session;
    if (checkoutSessionId) {
      session = await CheckoutSession.findOne({ _id: checkoutSessionId, user: userId });
    } else {
      session = await CheckoutSession.findOne({ user: userId, state: 'AWAITING_CONFIRMATION' }).sort({ createdAt: -1 });
    }

    if (!session) {
      // Fallback: Validate cart and address directly to create order
      const addresses = await addressService.getAddresses(userId);
      if (addresses.length === 0) throw new Error('No delivery address found');
      const addressId = addresses[0]._id.toString();
      const order = await orderService.createOrder(userId, { shippingAddressId: addressId });
      return { order, message: `Order ${order.orderNumber} created successfully for ₹${order.total}.` };
    }

    if (session.state === 'ORDER_CREATED' && session.order) {
      const existingOrder = await Order.findById(session.order);
      return { order: existingOrder, message: `Order ${existingOrder.orderNumber} is already created.` };
    }

    const addressId = session.checkoutSummary?.addressId;
    const order = await orderService.createOrder(userId, { shippingAddressId: addressId });

    session.order = order._id;
    session.state = 'ORDER_CREATED';
    session.confirmedAt = new Date();
    await session.save();

    return {
      order,
      checkoutSessionId: session._id.toString(),
      message: `Order ${order.orderNumber} has been created for ₹${order.total}! You can now complete the payment securely through Razorpay.`
    };
  },

  /**
   * Create Razorpay Payment Session for Order
   */
  async createPaymentSession(userId, orderId) {
    const paymentData = await paymentService.createPaymentOrder(userId, orderId);

    // Update CheckoutSession state if available
    await CheckoutSession.updateOne(
      { order: orderId, user: userId },
      { state: 'PAYMENT_READY', payment: paymentData.paymentId }
    );

    return paymentData;
  },

  /**
   * Get Real Backend Payment Status
   */
  async getPaymentStatus(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate('payment');
    if (!order) throw new Error('Order not found');

    return {
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      amount: order.total,
      paymentNumber: order.payment?.paymentNumber || 'N/A',
      paidAt: order.paidAt || order.payment?.paidAt || null
    };
  }
};

export default checkoutSessionService;
