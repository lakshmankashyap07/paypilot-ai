import mongoose from 'mongoose';

const cartEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'CART_CREATED',
        'ITEM_ADDED',
        'ITEM_REMOVED',
        'QUANTITY_UPDATED',
        'CART_CLEARED',
        'CHECKOUT_STARTED'
      ],
      index: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const CartEvent = mongoose.model('CartEvent', cartEventSchema);
export default CartEvent;
