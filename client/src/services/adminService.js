import api from './api';

export const adminService = {
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response;
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response;
  },

  async updateUserStatus(id, active) {
    const response = await api.patch(`/admin/users/${id}/status`, { active });
    return response;
  },

  async getMerchants(params = {}) {
    const response = await api.get('/admin/merchants', { params });
    return response;
  },

  async updateMerchantStatus(id, active) {
    const response = await api.patch(`/admin/merchants/${id}/status`, { active });
    return response;
  },

  async approveMerchant(id) {
    const response = await api.patch(`/admin/merchants/${id}/approve`);
    return response;
  },

  async rejectMerchant(id) {
    const response = await api.patch(`/admin/merchants/${id}/reject`);
    return response;
  },

  async suspendMerchant(id) {
    const response = await api.patch(`/admin/merchants/${id}/suspend`);
    return response;
  },

  async getProducts(params = {}) {
    const response = await api.get('/admin/products', { params });
    return response;
  },

  async updateProductStatus(id, active) {
    const response = await api.patch(`/admin/products/${id}/status`, { active });
    return response;
  },

  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response;
  },

  async getAIObservability(params = {}) {
    const response = await api.get('/admin/ai', { params });
    return response;
  },

  async getSecurityEvents() {
    const response = await api.get('/admin/security-events');
    return response;
  },

  async getAuditLogs() {
    const response = await api.get('/admin/audit-logs');
    return response;
  },

  async getHealth() {
    const response = await api.get('/admin/health');
    return response;
  }
};

export default adminService;
