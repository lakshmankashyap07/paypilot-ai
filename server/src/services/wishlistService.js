import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const wishlistService = {
  /**
   * Get user's wishlist populated with product details
   */
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      match: { active: true }
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    return wishlist;
  },

  /**
   * Add a product to wishlist (idempotent, prevents duplicates)
   */
  async addToWishlist(userId, productId) {
    const product = await Product.findById(productId);
    if (!product || !product.active) {
      throw new Error('Product not found or unavailable');
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] });
    } else {
      const exists = wishlist.products.some(
        (pId) => pId.toString() === productId.toString()
      );
      if (!exists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    return await this.getWishlist(userId);
  },

  /**
   * Remove a product from wishlist
   */
  async removeFromWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (pId) => pId.toString() !== productId.toString()
      );
      await wishlist.save();
    }

    return await this.getWishlist(userId);
  },

  /**
   * Clear all items from wishlist
   */
  async clearWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }

    return await this.getWishlist(userId);
  },

  /**
   * Check if a product is in user's wishlist
   */
  async isInWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return false;

    return wishlist.products.some((pId) => pId.toString() === productId.toString());
  }
};

export default wishlistService;
