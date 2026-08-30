import mongoose from 'mongoose';

const checkoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      index: true
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    state: {
      type: String,
      enum: [
        'BROWSING',
        'CART_READY',
        'CHECKOUT_VALIDATED',
        'AWAITING_CONFIRMATION',
        'ORDER_CREATED',
        'PAYMENT_READY',
        'PAYMENT_IN_PROGRESS',
        'PAYMENT_VERIFIED',
        'COMPLETED',
        'CHECKOUT_FAILED',
        'ORDER_FAILED',
        'PAYMENT_FAILED',
        'PAYMENT_CANCELLED'
      ],
      default: 'CHECKOUT_VALIDATED',
      index: true
    },
    checkoutSummary: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    confirmedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const CheckoutSession = mongoose.model('CheckoutSession', checkoutSessionSchema);
export default CheckoutSession;
