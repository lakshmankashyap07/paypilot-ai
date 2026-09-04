import api from './api';

export const aiIntelligenceService = {
  /**
   * Natural Language Search
   */
  async naturalSearch(query) {
    const response = await api.post('/ai-intelligence/natural-search', { query });
    return response.data;
  },

  /**
   * Product Comparison
   */
  async compareProducts(productIds, userCriteria = '') {
    const response = await api.post('/ai-intelligence/compare', { productIds, userCriteria });
    return response.data;
  },

  /**
   * Cart Budget Guard
   */
  async analyzeBudget(userBudget) {
    const response = await api.post('/ai-intelligence/budget-guard', { userBudget });
    return response.data;
  },

  /**
   * Smart Bundles
   */
  async getBundles(productId, userBudget) {
    const response = await api.get(`/ai-intelligence/bundles/${productId}`, {
      params: { userBudget }
    });
    return response.data;
  },

  /**
   * Price Intelligence
   */
  async getPriceIntelligence(productId) {
    const response = await api.get(`/ai-intelligence/price-intelligence/${productId}`);
    return response.data;
  },

  /**
   * Smart Wishlist Tracking
   */
  async getSmartWishlist() {
    const response = await api.get('/ai-intelligence/smart-wishlist');
    return response.data;
  },

  /**
   * Personalized "For You" Feed
   */
  async getPersonalizedFeed(limit = 8) {
    const response = await api.get('/ai-intelligence/for-you', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * AI Checkout Assistant Summary
   */
  async getCheckoutAssistantSummary(userBudget) {
    const response = await api.post('/ai-intelligence/checkout-summary', { userBudget });
    return response.data;
  }
};

export default aiIntelligenceService;
