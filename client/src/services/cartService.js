import api from './api';

export const cartService = {
  /**
   * Fetch authenticated user's shopping cart
   */
  async getCart() {
    const response = await api.get('/cart');
    return response;
  },

  /**
   * Add item to cart
   */
  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/items', { productId, quantity });
    return response;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(productId, quantity) {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response;
  },

  /**
   * Remove item from cart
   */
  async removeCartItem(productId) {
    const response = await api.delete(`/cart/items/${productId}`);
    return response;
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    const response = await api.delete('/cart');
    return response;
  },

  /**
   * Validate cart items, pricing, and stock
   */
  async validateCart() {
    const response = await api.post('/cart/validate');
    return response;
  }
};

export default cartService;
