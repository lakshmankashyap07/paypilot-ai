import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    personalizationEnabled: {
      type: Boolean,
      default: true
    },
    preferredCategories: [
      {
        category: String,
        score: { type: Number, default: 1 }
      }
    ],
    preferredBrands: [
      {
        brand: String,
        score: { type: Number, default: 1 }
      }
    ],
    pricePreference: {
      min: Number,
      max: Number,
      avg: Number
    },
    viewedProducts: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        viewedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);
export default UserPreference;
