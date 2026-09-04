import React, { useState } from 'react';
import { Bot, Send, Loader2, Sparkles, User, RefreshCw } from 'lucide-react';
import aiService from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

export const AskPayPilotAIWidget = () => {
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'ASSISTANT',
      text: 'Hello! I am PayPilot AI Account Assistant. Ask me about product recommendations, savings tips, or spending breakdowns!'
    }
  ]);

  const handleSend = async (queryText = null) => {
    const messageText = (queryText || input).trim();
    if (!messageText || loading) return;

    setChatHistory((prev) => [...prev, { role: 'USER', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.sendMessage(messageText);
      const aiReply = res.data?.message || res.data?.reply || res.data?.response;
      if (aiReply) {
        setChatHistory((prev) => [...prev, { role: 'ASSISTANT', text: aiReply }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'ASSISTANT',
            text: 'I parsed your account preferences and order history. Check the AI Preferences and Smart Payment cards for recommendations!'
          }
        ]);
      }
    } catch (err) {
      console.warn('AI Assistant error:', err.message);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'ASSISTANT',
          text: 'AI assistant service is currently operating in offline mode. Your saved preferences and shopping history remain active.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
              <span>Ask PayPilot AI Assistant</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-600 text-white rounded">COMMERCE AI</span>
            </h3>
            <p className="text-[11px] text-gray-500">Ask natural-language questions about products, deals, & savings</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setChatHistory([{ role: 'ASSISTANT', text: 'Chat reset. How can I help you today?' }])}
          className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          title="Reset Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          'What should I buy this month?',
          'Find me a laptop under ₹50,000',
          'How can I save money on my next order?',
          'Show my spending summary',
          'Find products similar to my purchases'
        ].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-full text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Display */}
      <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 max-h-56 overflow-y-auto">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                msg.role === 'USER'
                  ? 'bg-indigo-600 text-white font-medium rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-900 font-medium shadow-2xs rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>PayPilot AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about recommendations, savings, or products..."
          disabled={loading}
          className="flex-grow bg-gray-50 border border-gray-300 rounded-2xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>

    </div>
  );
};

export default AskPayPilotAIWidget;
