import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import CartEvent from '../models/CartEvent.js';
import { calculateCartTotals } from './cartCalculationService.js';

/**
 * Generate a unique human-readable order number
 * Format: PP-YYYYMMDD-XXXXX (e.g. PP-20260826-84920)
 */
export const generateOrderNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let isUnique = false;
  let orderNum = '';

  while (!isUnique) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    orderNum = `PP-${dateStr}-${randomDigits}`;
    const existing = await Order.findOne({ orderNumber: orderNum });
    if (!existing) isUnique = true;
  }

  return orderNum;
};

export const orderService = {
  /**
   * Validate checkout state, items, stock, and addresses before placing order
   */
  async validateCheckout(userId, { shippingAddressId, billingAddressId }) {
    if (!shippingAddressId) {
      throw new Error('Shipping address is required');
    }

    const shippingAddress = await Address.findOne({ _id: shippingAddressId, user: userId });
    if (!shippingAddress) {
      throw new Error('Selected shipping address was not found');
    }

    let billingAddress = shippingAddress;
    if (billingAddressId && billingAddressId !== shippingAddressId) {
      const foundBilling = await Address.findOne({ _id: billingAddressId, user: userId });
      if (foundBilling) billingAddress = foundBilling;
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new Error('Your shopping cart is empty');
    }

    const validatedItems = [];
    const warnings = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.active) {
        throw new Error(`Product '${product?.name || 'Item'}' is no longer available`);
      }

      if (item.quantity > product.stock) {
        throw new Error(`Requested quantity (${item.quantity}) for '${product.name}' exceeds stock (${product.stock})`);
      }

      validatedItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.thumbnail || product.images?.[0] || '',
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity
      });
    }

    const totals = calculateCartTotals(cart.items);

    return {
      valid: true,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      currency: totals.currency || 'INR',
      items: validatedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India'
      },
      billingAddress: {
        fullName: billingAddress.fullName,
        phone: billingAddress.phone,
        addressLine1: billingAddress.addressLine1,
        addressLine2: billingAddress.addressLine2 || '',
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country || 'India'
      }
    };
  },

  /**
   * Create an order with safe atomic inventory reduction
   */
  async createOrder(userId, { shippingAddressId, billingAddressId, notes = '' }) {
    const validatedData = await this.validateCheckout(userId, {
      shippingAddressId,
      billingAddressId
    });

    const deductedItems = [];

    try {
      // 1. Atomic Stock Reduction with rollback safeguard
      for (const item of validatedData.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity }, active: true },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for '${item.productName}'. Please update your cart.`);
        }

        deductedItems.push({ productId: item.product, quantity: item.quantity });
      }

      // 2. Generate Order Number
      const orderNumber = await generateOrderNumber();

      // 3. Save Order Document
      const order = await Order.create({
        orderNumber,
        user: userId,
        items: validatedData.items,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress,
        subtotal: validatedData.subtotal,
        discount: validatedData.discount,
        tax: validatedData.tax,
        shipping: validatedData.shipping,
        total: validatedData.total,
        currency: validatedData.currency,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        notes: notes.trim()
      });

      // 4. Clear User Cart
      await Cart.findOneAndUpdate({ user: userId }, { items: [], subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 });

      // 5. Log Cart Event
      try {
        await CartEvent.create({
          user: userId,
          order: order._id,
          eventType: 'ORDER_CREATED',
          quantity: validatedData.items.reduce((acc, i) => acc + i.quantity, 0),
          metadata: { orderNumber: order.orderNumber, total: order.total }
        });
      } catch (e) {
        console.warn('Failed to log ORDER_CREATED cart event:', e.message);
      }

      return order;
    } catch (error) {
      // Rollback any stock deducted prior to failure
      for (const item of deductedItems) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
      }
      throw error;
    }
  },

  /**
   * Get Customer Order History (Newest first)
   */
  async getUserOrders(userId) {
    return await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  },

  /**
   * Get Single Order Details by ID or Order Number
   */
  async getOrderById(userId, orderId, userRole = 'CUSTOMER') {
    let query = { _id: orderId };
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      query = { orderNumber: orderId };
    }

    const order = await Order.findOne(query).lean();
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user.toString() !== userId.toString() && userRole !== 'ADMIN' && userRole !== 'MERCHANT') {
      throw new Error('Forbidden: You are not authorized to view this order');
    }

    return order;
  },

  /**
   * Customer Order Cancellation & Inventory Restoration
   */
  async cancelOrder(userId, orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.user.toString() !== userId.toString()) {
      throw new Error('Forbidden: You can only cancel your own orders');
    }

    if (order.orderStatus !== 'PENDING' && order.orderStatus !== 'CONFIRMED') {
      throw new Error(`Order cannot be cancelled because it is already ${order.orderStatus}`);
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    // Restore Inventory Stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    return order;
  }
};

export default orderService;
