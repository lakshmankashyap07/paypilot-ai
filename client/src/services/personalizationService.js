import api from './api';

export const personalizationService = {
  async getHomePageFeeds() {
    const response = await api.get('/personalization/home');
    return response;
  },

  async getSimilarProducts(productId) {
    const response = await api.get(`/personalization/products/${productId}/similar`);
    return response;
  },

  async getPreferences() {
    const response = await api.get('/personalization/preferences');
    return response;
  },

  async updatePreferences(data) {
    const response = await api.put('/personalization/preferences', data);
    return response;
  },

  async resetPreferences() {
    const response = await api.post('/personalization/preferences/reset');
    return response;
  },

  async togglePersonalization(enabled) {
    const response = await api.patch('/personalization/preferences/toggle', { enabled });
    return response;
  }
};

export default personalizationService;
