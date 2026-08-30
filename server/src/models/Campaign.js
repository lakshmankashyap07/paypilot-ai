import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: [
        'CART_RECOVERY',
        'PRODUCT_PROMOTION',
        'CUSTOMER_RETENTION',
        'NEW_CUSTOMER',
        'CLEARANCE',
        'LOW_STOCK'
      ],
      default: 'CART_RECOVERY'
    },
    description: {
      type: String,
      default: ''
    },
    targetSegment: {
      type: String,
      enum: [
        'NEW_CUSTOMER',
        'RETURNING_CUSTOMER',
        'HIGH_VALUE_CUSTOMER',
        'CART_ABANDONER',
        'RECENT_PURCHASER',
        'INACTIVE_CUSTOMER'
      ],
      default: 'CART_ABANDONER'
    },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED'],
      default: 'PERCENTAGE'
    },
    discountValue: {
      type: Number,
      required: true,
      default: 10
    },
    maxDiscount: {
      type: Number,
      default: 500
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
      index: true
    },
    createdBy: {
      type: String,
      enum: ['MERCHANT', 'AI_COPILOT'],
      default: 'AI_COPILOT'
    },
    metrics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      ordersCount: { type: Number, default: 0 },
      revenueGenerated: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
