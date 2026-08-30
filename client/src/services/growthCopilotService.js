import api from './api';

export const growthCopilotService = {
  async sendMessage(message, conversationId = null) {
    const response = await api.post('/merchant/ai/chat', { message, conversationId });
    return response;
  },

  async getConversations() {
    const response = await api.get('/merchant/ai/conversations');
    return response;
  },

  async getConversation(id) {
    const response = await api.get(`/merchant/ai/conversations/${id}`);
    return response;
  },

  async getOpportunities() {
    const response = await api.get('/merchant/ai/opportunities');
    return response;
  },

  async getDailySummary() {
    const response = await api.get('/merchant/ai/daily-summary');
    return response;
  }
};

export default growthCopilotService;
