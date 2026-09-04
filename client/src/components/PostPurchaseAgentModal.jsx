import React, { useState } from 'react';
import { X, Bot, Send, Loader2, Package, Truck, HelpCircle, CheckCircle2 } from 'lucide-react';
import agenticCommerceService from '../services/agenticCommerceService';
import { useToast } from '../context/ToastContext';

export const PostPurchaseAgentModal = ({ orderId, onClose }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'ASSISTANT',
      content: `Hi! I'm your PayPilot AI Order Assistant. I can track delivery, show item details, explain cancellation options, or check your total spend on this order. What would you like to know?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK_QUESTIONS = [
    'Where is my order?',
    'When will it arrive?',
    'What did I buy?',
    'Can I cancel this?'
  ];

  const handleSendQuery = async (queryStr) => {
    const text = (queryStr || inputText).trim();
    if (!text || loading) return;

    // Add User Message
    setMessages((prev) => [...prev, { role: 'USER', content: text }]);
    setInputText('');

    try {
      setLoading(true);
      const res = await agenticCommerceService.queryPostPurchaseOrder(orderId, text);
      const answer = res.answerText || 'Query processed.';

      setMessages((prev) => [...prev, { role: 'ASSISTANT', content: answer }]);
    } catch (err) {
      showToast(err.message || 'Order query failed', 'error');
      setMessages((prev) => [...prev, { role: 'ASSISTANT', content: 'Sorry, I could not query your order status at this time.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E0E6ED] p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col text-xs text-[#172337]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#172337]">AI Post-Purchase Order Assistant</h3>
              <p className="text-xs text-[#5F6B76]">Live order status, tracking & cancellation help</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-grow overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[220px] max-h-[340px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'ASSISTANT' && (
                <div className="w-7 h-7 rounded-lg bg-[#2874F0] text-white flex items-center justify-center font-bold flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                  m.role === 'USER'
                    ? 'bg-[#2874F0] text-white font-medium rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-2xs font-medium rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500 font-bold p-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#2874F0]" />
              <span>Querying database order records...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q)}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874F0] border border-blue-200 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about your order..."
            className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2874F0]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-[#2874F0] hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default PostPurchaseAgentModal;
