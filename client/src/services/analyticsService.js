import api from './api';

export const analyticsService = {
  async getOverview(params = {}) {
    return await api.get('/merchant/analytics/overview', { params });
  },

  async getSales(params = {}) {
    return await api.get('/merchant/analytics/sales', { params });
  },

  async getOrders(params = {}) {
    return await api.get('/merchant/analytics/orders', { params });
  },

  async getProducts(params = {}) {
    return await api.get('/merchant/analytics/products', { params });
  },

  async getCustomers(params = {}) {
    return await api.get('/merchant/analytics/customers', { params });
  },

  async getPayments(params = {}) {
    return await api.get('/merchant/analytics/payments', { params });
  },

  async getFunnel(params = {}) {
    return await api.get('/merchant/analytics/funnel', { params });
  },

  async getSearch(params = {}) {
    return await api.get('/merchant/analytics/search', { params });
  },

  async getCategories(params = {}) {
    return await api.get('/merchant/analytics/categories', { params });
  },

  async getInventory(params = {}) {
    return await api.get('/merchant/analytics/inventory', { params });
  },

  async getCartAbandonment(params = {}) {
    return await api.get('/merchant/analytics/cart-abandonment', { params });
  },

  async getAIMetrics(params = {}) {
    return await api.get('/merchant/analytics/ai', { params });
  },

  async downloadExportCSV(type = 'sales', params = {}) {
    const queryStr = new URLSearchParams({ ...params, type }).toString();
    const response = await fetch(`http://localhost:5000/api/merchant/analytics/export?${queryStr}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('paypilot_auth_token') || ''}`
      }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant_${type}_export.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};

export default analyticsService;
