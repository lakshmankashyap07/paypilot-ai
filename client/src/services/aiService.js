import api from './api';

export const aiService = {
  /**
   * Send user message to AI Agent
   */
  async sendMessage(message, conversationId = null) {
    const response = await api.post('/ai/chat', {
      message,
      conversationId
    });
    return response;
  },

  /**
   * Create conversation
   */
  async createConversation(title = 'New Shopping Session') {
    const response = await api.post('/ai/conversations', { title });
    return response;
  },

  /**
   * Get user conversation threads
   */
  async getConversations() {
    const response = await api.get('/ai/conversations');
    return response;
  },

  /**
   * Get conversation details with message history
   */
  async getConversation(id) {
    const response = await api.get(`/ai/conversations/${id}`);
    return response;
  },

  /**
   * Delete conversation thread
   */
  async deleteConversation(id) {
    const response = await api.delete(`/ai/conversations/${id}`);
    return response;
  }
};

export default aiService;
