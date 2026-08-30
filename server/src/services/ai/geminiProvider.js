import { GoogleGenerativeAI } from '@google/generative-ai';
import aiConfig from './aiConfig.js';
import { getToolDefinitions } from '../../agents/tools/toolRegistry.js';
import { COMMERCE_AGENT_SYSTEM_PROMPT } from '../../agents/commerceAgentPrompt.js';

export const geminiProvider = {
  /**
   * Format tool definitions into Google Generative AI FunctionDeclarations
   */
  getFormattedTools() {
    const rawTools = getToolDefinitions();
    const functionDeclarations = rawTools.map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }));

    return [{ functionDeclarations }];
  },

  /**
   * Format message history array into Gemini Content objects with proper roles ('user', 'model', 'function')
   */
  formatHistory(history = []) {
    const formatted = [];

    for (const msg of history) {
      if (msg.role === 'USER') {
        if (msg.content && typeof msg.content === 'string' && msg.content.trim()) {
          formatted.push({ role: 'user', parts: [{ text: msg.content.trim() }] });
        }
      } else if (msg.role === 'ASSISTANT') {
        const parts = [];
        if (msg.content && typeof msg.content === 'string' && msg.content.trim()) {
          parts.push({ text: msg.content.trim() });
        }
        if (msg.toolCalls && Array.isArray(msg.toolCalls) && msg.toolCalls.length > 0) {
          for (const tc of msg.toolCalls) {
            parts.push({
              functionCall: {
                name: tc.name,
                args: tc.args || {}
              }
            });
          }
        }
        if (parts.length > 0) {
          formatted.push({ role: 'model', parts });
        }
      } else if (msg.role === 'TOOL' && msg.toolResults && Array.isArray(msg.toolResults)) {
        const parts = [];
        for (const tr of msg.toolResults) {
          // Clean JSON serialization to prevent BSON/circular object errors
          const cleanResult = tr.result ? JSON.parse(JSON.stringify(tr.result)) : {};
          parts.push({
            functionResponse: {
              name: tr.name,
              response: cleanResult
            }
          });
        }
        if (parts.length > 0) {
          // Gemini SDK requires role: 'function' for functionResponse parts
          formatted.push({ role: 'function', parts });
        }
      }
    }

    return formatted;
  },

  /**
   * Generate AI response using Google Gemini API
   */
  async generateResponse({ history = [], userMessage, systemInstruction }) {
    if (!aiConfig.isConfigured()) {
      throw new Error('AI service is not configured. Please set GEMINI_API_KEY in server/.env.');
    }

    const genAI = new GoogleGenerativeAI(aiConfig.apiKey);
    const model = genAI.getGenerativeModel({
      model: aiConfig.modelName || 'gemini-2.5-flash',
      systemInstruction: systemInstruction || COMMERCE_AGENT_SYSTEM_PROMPT,
      tools: this.getFormattedTools()
    });

    const formattedHistory = this.formatHistory(history);

    // If userMessage is provided and is not already the last message in history, append it
    if (userMessage && typeof userMessage === 'string' && userMessage.trim()) {
      const lastMsg = history[history.length - 1];
      if (!lastMsg || lastMsg.role !== 'USER' || lastMsg.content !== userMessage) {
        formattedHistory.push({ role: 'user', parts: [{ text: userMessage.trim() }] });
      }
    }

    const result = await model.generateContent({ contents: formattedHistory });
    const response = await result.response;

    const functionCalls = response.functionCalls();
    let textContent = '';
    try {
      textContent = response.text();
    } catch (e) {
      // Text extraction can throw if content only contains functionCalls
    }

    return {
      text: textContent || '',
      functionCalls: functionCalls || []
    };
  }
};

export default geminiProvider;
