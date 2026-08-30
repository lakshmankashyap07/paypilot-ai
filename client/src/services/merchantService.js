import api from './api';

export const merchantService = {
  /**
   * Get merchant dashboard analytics
   */
  async getDashboard() {
    const response = await api.get('/merchant/dashboard');
    return response;
  },

  /**
   * Get merchant products list
   */
  async getProducts(params = {}) {
    const response = await api.get('/merchant/products', { params });
    return response;
  },

  /**
   * Create product
   */
  async createProduct(productData) {
    const response = await api.post('/merchant/products', productData);
    return response;
  },

  /**
   * Update product
   */
  async updateProduct(productId, productData) {
    const response = await api.put(`/merchant/products/${productId}`, productData);
    return response;
  },

  /**
   * Fast update stock
   */
  async updateStock(productId, stock) {
    const response = await api.patch(`/merchant/products/${productId}/stock`, { stock });
    return response;
  },

  /**
   * Fast update active status
   */
  async updateStatus(productId, active) {
    const response = await api.patch(`/merchant/products/${productId}/status`, { active });
    return response;
  },

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    const response = await api.delete(`/merchant/products/${productId}`);
    return response;
  },

  /**
   * Get merchant orders
   */
  async getOrders(params = {}) {
    const response = await api.get('/merchant/orders', { params });
    return response;
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, orderStatus) {
    const response = await api.patch(`/merchant/orders/${orderId}/status`, { orderStatus });
    return response;
  }
};

export default merchantService;
