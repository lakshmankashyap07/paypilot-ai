import api from './api';

export const agenticCommerceService = {
  /**
   * AI Deal Optimizer
   */
  async optimizeCartDeals() {
    const response = await api.post('/agentic/deal-optimizer');
    return response.data;
  },

  /**
   * AI Budget Guard & Smart Cart Optimizer Analysis
   */
  async analyzeBudgetGuard(userBudget) {
    const response = await api.post('/agentic/budget-guard', { userBudget });
    return response.data;
  },

  /**
   * Post-Purchase AI Order Query
   */
  async queryPostPurchaseOrder(orderId, query) {
    const response = await api.post('/agentic/post-purchase', { orderId, query });
    return response.data;
  },

  /**
   * AI Return Request
   */
  async submitReturnRequest(orderId, productId, issueCategory, reasonDetails) {
    const response = await api.post('/agentic/return-request', {
      orderId,
      productId,
      issueCategory,
      reasonDetails
    });
    return response.data;
  },

  /**
   * Merchant AI Copilot Insights
   */
  async getMerchantCopilot() {
    const response = await api.get('/agentic/merchant/copilot');
    return response.data;
  },

  /**
   * Merchant Copilot Natural Language Q&A
   */
  async askMerchantCopilotQA(question) {
    const response = await api.post('/agentic/merchant/copilot-qa', { question });
    return response.data;
  },

  /**
   * AI Generate Product Listing
   */
  async generateProductListing(productDetails) {
    const response = await api.post('/agentic/merchant/generate-listing', productDetails);
    return response.data;
  },

  /**
   * Order Risk Evaluation
   */
  async getOrderRisk(orderId) {
    const response = await api.get(`/agentic/order-risk/${orderId}`);
    return response.data;
  },

  /**
   * Reset AI Shopping Memory
   */
  async resetShoppingMemory() {
    const response = await api.delete('/agentic/shopping-memory');
    return response.data;
  }
};

export default agenticCommerceService;
