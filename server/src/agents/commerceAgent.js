import aiService from '../services/ai/aiService.js';
import { getToolDefinitions } from './tools/toolRegistry.js';
import { COMMERCE_AGENT_SYSTEM_PROMPT } from './commerceAgentPrompt.js';

export const commerceAgent = {
  name: 'PayPilot AI Commerce Agent',
  systemPrompt: COMMERCE_AGENT_SYSTEM_PROMPT,

  /**
   * Return list of registered tool definitions
   */
  getRegisteredTools() {
    return getToolDefinitions();
  },

  /**
   * Process customer message through agent service
   */
  async processMessage({ userId, conversationId, message }) {
    return await aiService.processChatMessage({
      userId,
      conversationId,
      userMessageText: message
    });
  }
};

export default commerceAgent;
