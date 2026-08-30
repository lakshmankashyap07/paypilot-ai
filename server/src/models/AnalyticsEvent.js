import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'SESSION_STARTED',
        'PRODUCT_VIEWED',
        'SEARCH_PERFORMED',
        'AI_SEARCH_PERFORMED',
        'PRODUCT_RECOMMENDED',
        'PRODUCT_COMPARED',
        'WISHLIST_ADDED',
        'WISHLIST_REMOVED',
        'CART_CREATED',
        'CART_ITEM_ADDED',
        'CART_ITEM_REMOVED',
        'CART_UPDATED',
        'CHECKOUT_STARTED',
        'CHECKOUT_VALIDATED',
        'CHECKOUT_CONFIRMED',
        'ORDER_CREATED',
        'ORDER_CANCELLED',
        'PAYMENT_STARTED',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'PURCHASE_COMPLETED',
        'AI_SESSION_STARTED',
        'AI_ASSISTED_CART',
        'AI_ASSISTED_CHECKOUT',
        'AI_ASSISTED_ORDER',
        'AI_ASSISTED_PAYMENT'
      ],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      index: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      index: true
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      index: true
    },
    sessionId: {
      type: String,
      index: true
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      index: true
    },
    source: {
      type: String,
      enum: ['WEB', 'AI_AGENT', 'SYSTEM'],
      default: 'WEB',
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound Indexes for fast aggregation pipelines
analyticsEventSchema.index({ createdAt: -1, merchant: 1, eventType: 1 });
analyticsEventSchema.index({ merchant: 1, source: 1, createdAt: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;
