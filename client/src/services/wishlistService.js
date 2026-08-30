import api from './api';

export const wishlistService = {
  /**
   * Fetch authenticated user's wishlist
   */
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response;
  },

  /**
   * Add a product to wishlist
   */
  async addToWishlist(productId) {
    const response = await api.post(`/wishlist/${productId}`);
    return response;
  },

  /**
   * Remove a product from wishlist
   */
  async removeFromWishlist(productId) {
    const response = await api.delete(`/wishlist/${productId}`);
    return response;
  },

  /**
   * Clear all products from wishlist
   */
  async clearWishlist() {
    const response = await api.delete('/wishlist');
    return response;
  }
};

export default wishlistService;
