import mongoose from 'mongoose';

const shoppingStateSchema = new mongoose.Schema(
  {
    intent: { type: String, default: 'product_search' },
    category: { type: String, default: '' },
    subcategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    minPrice: { type: Number, default: null },
    maxPrice: { type: Number, default: null },
    minRating: { type: Number, default: null },
    candidateProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    selectedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'Shopping Assistant Session',
      trim: true
    },
    shoppingState: {
      type: shoppingStateSchema,
      default: () => ({})
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
