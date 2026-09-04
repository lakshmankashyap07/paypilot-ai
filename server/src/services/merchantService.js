import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Merchant from '../models/Merchant.js';
import { generateUniqueSlug } from '../utils/slugify.js';

const ALLOWED_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['RETURN_REQUESTED', 'REPLACEMENT_REQUESTED'],
  RETURN_REQUESTED: ['RETURN_APPROVED', 'RETURN_REJECTED'],
  RETURN_APPROVED: ['RETURN_PICKUP_SCHEDULED', 'RETURNED'],
  RETURN_PICKUP_SCHEDULED: ['RETURNED'],
  RETURN_REJECTED: [],
  RETURNED: [],
  REPLACEMENT_REQUESTED: ['REPLACEMENT_APPROVED', 'REPLACEMENT_REJECTED'],
  REPLACEMENT_APPROVED: ['SHIPPED', 'REPLACED'],
  REPLACEMENT_REJECTED: [],
  REPLACED: [],
  CANCELLED: []
};

export const merchantService = {
  /**
   * Register New Merchant Account
   */
  async registerMerchant({
    fullName,
    email,
    phone,
    storeName,
    category,
    description,
    businessEmail,
    businessPhone,
    address,
    city,
    state,
    pincode,
    password
  }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    // Force server assignment of role = MERCHANT for security
    const user = await User.create({
      name: fullName,
      email,
      password,
      phone,
      role: 'MERCHANT'
    });

    const merchant = await Merchant.create({
      user: user._id,
      storeName,
      category,
      description: description || '',
      businessEmail: businessEmail || email,
      businessPhone: businessPhone || phone,
      address,
      city,
      state,
      pincode,
      status: 'PENDING'
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      merchant: {
        id: merchant._id,
        storeName: merchant.storeName,
        category: merchant.category,
        status: merchant.status
      }
    };
  },

  /**
   * Calculate Real-time Merchant Dashboard Analytics including Payment Statistics
   */
  async getMerchantDashboard(merchantId, role = 'MERCHANT') {
    const productQuery = role === 'ADMIN' ? {} : { merchant: merchantId };

    const [totalProducts, activeProducts, lowStockProducts] = await Promise.all([
      Product.countDocuments(productQuery),
      Product.countDocuments({ ...productQuery, active: true }),
      Product.find({ ...productQuery, stock: { $lte: 5 } }).select('name sku stock price category brand').lean()
    ]);

    const orderQuery = role === 'ADMIN' ? {} : {};

    const [totalOrders, pendingOrders, deliveredOrders, ordersList] = await Promise.all([
      Order.countDocuments(orderQuery),
      Order.countDocuments({ ...orderQuery, orderStatus: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } }),
      Order.countDocuments({ ...orderQuery, orderStatus: 'DELIVERED' }),
      Order.find(orderQuery).select('total orderStatus').lean()
    ]);

    const grossOrderValue = ordersList.reduce((acc, o) => acc + (o.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(grossOrderValue / totalOrders) : 0;

    // Real-time Payment Statistics from Payment Model
    const [totalPaymentAttempts, successfulPayments, failedPayments, pendingPayments, refundedPayments] = await Promise.all([
      Payment.countDocuments({}),
      Payment.countDocuments({ status: 'CAPTURED' }),
      Payment.countDocuments({ status: 'FAILED' }),
      Payment.countDocuments({ status: { $in: ['CREATED', 'PENDING'] } }),
      Payment.countDocuments({ status: 'REFUNDED' })
    ]);

    const paymentSuccessRate = totalPaymentAttempts > 0
      ? Math.round((successfulPayments / totalPaymentAttempts) * 100)
      : 100;

    return {
      products: {
        total: totalProducts,
        active: activeProducts
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        delivered: deliveredOrders
      },
      revenue: {
        grossOrderValue,
        averageOrderValue
      },
      payments: {
        attempts: totalPaymentAttempts,
        successful: successfulPayments,
        failed: failedPayments,
        pending: pendingPayments,
        refunded: refundedPayments,
        successRate: paymentSuccessRate
      },
      lowStock: lowStockProducts
    };
  },

  /**
   * Get Paginated Merchant Products with Category Filtering
   */
  async getMerchantProducts(merchantId, role = 'MERCHANT', query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = role === 'ADMIN' ? {} : { merchant: merchantId };

    if (query.category) {
      filter.category = query.category;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { sku: { $regex: query.search, $options: 'i' } },
        { brand: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Create Product assigned to Merchant
   */
  async createProduct(merchantId, productData) {
    const {
      name,
      description,
      category,
      subcategory = '',
      brand,
      price,
      originalPrice,
      stock = 0,
      sku,
      thumbnail = '',
      images = [],
      featured = false,
      active = true
    } = productData;

    if (!name || price === undefined || price === '' || !category || !brand || !description) {
      throw new Error('Name, brand, category, price, and description are required fields');
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      throw new Error('Price must be a valid non-negative number');
    }

    const numericStock = Number(stock);
    if (isNaN(numericStock) || numericStock < 0) {
      throw new Error('Stock must be a valid non-negative number');
    }

    const generatedSlug = productData.slug && productData.slug.trim() !== ''
      ? productData.slug.trim()
      : await generateUniqueSlug(name);

    const generatedSku = sku && sku.trim() !== ''
      ? sku.trim().toUpperCase()
      : `SKU-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const product = await Product.create({
      merchant: merchantId,
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim(),
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : '',
      brand: brand.trim(),
      price: numericPrice,
      originalPrice: originalPrice ? Number(originalPrice) : numericPrice,
      stock: numericStock,
      sku: generatedSku,
      thumbnail: thumbnail ? thumbnail.trim() : '',
      images: Array.isArray(images) && images.length > 0 ? images : (thumbnail ? [thumbnail.trim()] : []),
      featured: Boolean(featured),
      active: active !== undefined ? Boolean(active) : true
    });

    return product;
  },

  /**
   * Update Product owned by Merchant
   */
  async updateProduct(merchantId, productId, role = 'MERCHANT', updateData) {
    const filter = role === 'ADMIN' ? { _id: productId } : { _id: productId, merchant: merchantId };

    if (updateData.name && (!updateData.slug || updateData.slug.trim() === '')) {
      updateData.slug = await generateUniqueSlug(updateData.name, productId);
    }

    if (updateData.sku) {
      updateData.sku = updateData.sku.trim().toUpperCase();
    }

    const product = await Product.findOneAndUpdate(filter, { $set: updateData }, { new: true, runValidators: true });

    if (!product) {
      throw new Error('Product not found or access denied');
    }

    return product;
  },

  /**
   * Fast Update Stock
   */
  async updateProductStock(merchantId, productId, role = 'MERCHANT', stock) {
    const filter = role === 'ADMIN' ? { _id: productId } : { _id: productId, merchant: merchantId };
    const product = await Product.findOneAndUpdate(filter, { $set: { stock: Math.max(0, parseInt(stock, 10)) } }, { new: true });

    if (!product) {
      throw new Error('Product not found or access denied');
    }

    return product;
  },

  /**
   * Fast Update Active Status
   */
  async updateProductStatus(merchantId, productId, role = 'MERCHANT', active) {
    const filter = role === 'ADMIN' ? { _id: productId } : { _id: productId, merchant: merchantId };
    const product = await Product.findOneAndUpdate(filter, { $set: { active: Boolean(active) } }, { new: true });

    if (!product) {
      throw new Error('Product not found or access denied');
    }

    return product;
  },

  /**
   * Delete Product
   */
  async deleteProduct(merchantId, productId, role = 'MERCHANT') {
    const filter = role === 'ADMIN' ? { _id: productId } : { _id: productId, merchant: merchantId };
    const product = await Product.findOneAndDelete(filter);

    if (!product) {
      throw new Error('Product not found or access denied');
    }

    return true;
  },

  /**
   * Get Merchant Orders
   */
  async getMerchantOrders(merchantId, role = 'MERCHANT', query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.status) filter.orderStatus = query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter)
    ]);

    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  },

  /**
   * Update Order Status with Allowed Transition Validation
   */
  async updateOrderStatus(merchantId, orderId, role = 'MERCHANT', newStatus) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const currentStatus = order.orderStatus;
    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'None'}`);
    }

    order.orderStatus = newStatus;
    if (newStatus === 'DELIVERED') {
      order.deliveredAt = new Date();
    }
    await order.save();

    return order;
  },

  /**
   * Get Merchant Payments
   */
  async getMerchantPayments(merchantId, role = 'MERCHANT', query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.status) filter.status = query.status;

    const [payments, total] = await Promise.all([
      Payment.find(filter).populate('user', 'name email').populate('order', 'orderNumber total').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Payment.countDocuments(filter)
    ]);

    return {
      payments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  },

  /**
   * Get Single Merchant Payment
   */
  async getMerchantPaymentById(merchantId, role = 'MERCHANT', paymentId) {
    const payment = await Payment.findById(paymentId).populate('user', 'name email phone').populate('order').lean();
    if (!payment) {
      throw new Error('Payment transaction not found');
    }
    return payment;
  }
};

export default merchantService;
