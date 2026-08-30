import api from './api';

export const orderService = {
  /**
   * Validate checkout address and recalculate totals
   */
  async validateCheckout(shippingAddressId, billingAddressId) {
    const response = await api.post('/orders/validate-checkout', {
      shippingAddressId,
      billingAddressId
    });
    return response;
  },

  /**
   * Create order
   */
  async createOrder(shippingAddressId, billingAddressId, notes = '') {
    const response = await api.post('/orders', {
      shippingAddressId,
      billingAddressId,
      notes
    });
    return response;
  },

  /**
   * Get user order history
   */
  async getOrders() {
    const response = await api.get('/orders');
    return response;
  },

  /**
   * Get order details by ID
   */
  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`);
    return response;
  },

  /**
   * Cancel customer order
   */
  async cancelOrder(orderId) {
    const response = await api.patch(`/orders/${orderId}/cancel`);
    return response;
  }
};

export default orderService;
