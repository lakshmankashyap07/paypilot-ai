import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    storeName: {
      type: String,
      required: [true, 'Please provide a business or store name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a business category'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    businessEmail: {
      type: String,
      default: '',
      trim: true
    },
    businessPhone: {
      type: String,
      default: '',
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide business address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

const Merchant = mongoose.model('Merchant', merchantSchema);

export default Merchant;
