import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      index: true
    },
    subcategory: {
      type: String,
      default: '',
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      index: true
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    images: {
      type: [String],
      default: []
    },
    thumbnail: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
      index: true
    },
    reviewCount: {
      type: Number,
      min: [0, 'Review count cannot be negative'],
      default: 0
    },
    stock: {
      type: Number,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Automatically generate fallback slug if missing before schema validation
productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '') || `product-${Date.now()}`;
  }
  next();
});

// Compound Text Index for fast Mongo full-text & keyword search
productSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  subcategory: 'text',
  description: 'text',
  tags: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;
