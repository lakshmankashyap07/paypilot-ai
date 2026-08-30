import dotenv from 'dotenv';
dotenv.config();

export const aiConfig = {
  provider: process.env.AI_PROVIDER || 'gemini',
  apiKey: process.env.GEMINI_API_KEY || '',
  modelName: process.env.AI_MODEL || 'gemini-1.5-flash',
  maxToolLoops: 5,

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim() !== '' && this.apiKey !== 'your_gemini_api_key_here');
  }
};

export default aiConfig;
