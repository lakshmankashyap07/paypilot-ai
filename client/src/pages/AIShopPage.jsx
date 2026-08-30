import React, { useState, useEffect, useRef } from 'react';
import aiService from '../services/aiService';
import { useToast } from '../context/ToastContext';
import { AIProductCard } from '../components/AIProductCard';
import { AIProductComparisonTable } from '../components/AIProductComparisonTable';
import { AICartContextPanel } from '../components/AICartContextPanel';
import { AgentActivityTimeline } from '../components/AgentActivityTimeline';
import { SuggestedActionsChips } from '../components/SuggestedActionsChips';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Find a laptop under ₹50,000",
  "Best phone for photography",
  "Compare these products",
  "Find cheaper options",
  "What's in my cart?"
];

export const AIShopPage = () => {
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorState, setErrorState] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const fetchConversations = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await aiService.getConversations();
      if (res && res.success && res.data?.conversations) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0 && !activeConversationId) {
          setActiveConversationId(res.data.conversations[0]._id);
        }
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    aiService
      .getConversation(activeConversationId)
      .then((res) => {
        if (res && res.success && res.data?.messages) {
          setMessages(res.data.messages);
          setErrorState(null);
        }
      })
      .catch((err) => console.warn('Failed to load conversation details:', err.message));
  }, [activeConversationId]);

  const handleNewSession = async () => {
    try {
      const res = await aiService.createConversation('New Shopping Session');
      if (res && res.success && res.data?.conversation) {
        const newConv = res.data.conversation;
        setConversations([newConv, ...conversations]);
        setActiveConversationId(newConv._id);
        setMessages([]);
        setErrorState(null);
        setShowMobileSidebar(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create new session', 'error');
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isSending) return;

    setInputMessage('');
    setErrorState(null);

    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: 'USER',
      content: query,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setIsSending(true);
      const res = await aiService.sendMessage(query, activeConversationId);

      if (res && res.success && res.data) {
        const { conversationId, message } = res.data;
        if (!activeConversationId) {
          setActiveConversationId(conversationId);
          fetchConversations();
        }
        setMessages((prev) => [...prev.filter((m) => m._id !== tempUserMsg._id), tempUserMsg, message]);
      }
    } catch (err) {
      console.error('Gemini error:', err);
      setErrorState("Sorry, I couldn't process that request right now.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConversation = async (convId, e) => {
    e.stopPropagation();
    try {
      await aiService.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConversationId === convId) {
        setActiveConversationId(null);
        setMessages([]);
      }
      showToast('Session deleted', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete session', 'error');
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'ASSISTANT');
  const activeCandidateProducts = lastAssistantMsg?.products || [];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 h-[calc(100vh-4.25rem)] flex flex-col space-y-3 bg-[#F1F3F6] text-[#172337] text-xs font-sans overflow-hidden">
      
      {/* Top Mobile Bar Controls */}
      <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-xl border border-[#E0E6ED] shadow-xs">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="px-3 py-1.5 bg-gray-100 font-bold rounded-lg text-xs flex items-center gap-1.5 text-gray-800"
        >
          <Menu className="w-4 h-4" />
          <span>Sessions ({conversations.length})</span>
        </button>

        <div className="font-extrabold text-[#172337] text-xs flex items-center gap-1">
          <Bot className="w-4 h-4 text-[#2874F0]" />
          <span>PayPilot AI Assistant</span>
        </div>

        <button
          onClick={() => setShowMobileCart(!showMobileCart)}
          className="px-3 py-1.5 bg-blue-50 text-[#2874F0] font-bold rounded-lg text-xs flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
        </button>
      </div>

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 flex-1 min-h-0 items-stretch">
        
        {/* LEFT SESSION SIDEBAR */}
        <div
          className={`lg:col-span-3 md:col-span-1 bg-white rounded-xl border border-[#E0E6ED] p-4 flex flex-col justify-between overflow-hidden shadow-xs ${
            showMobileSidebar ? 'fixed inset-4 z-50 flex' : 'hidden md:flex'
          }`}
        >
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#2874F0]" />
                <h3 className="font-extrabold text-[#172337] text-xs">AI Shopping</h3>
              </div>
              {showMobileSidebar && (
                <button onClick={() => setShowMobileSidebar(false)} className="text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewSession}
              className="w-full py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Chat</span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            {/* Session Items List */}
            <div className="space-y-1 pt-1">
              {isLoadingHistory ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-9 rounded-lg bg-gray-100 animate-pulse"></div>
                ))
              ) : filteredConversations.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-6">No saved chats.</div>
              ) : (
                filteredConversations.map((c) => {
                  const isActive = activeConversationId === c._id;
                  return (
                    <div
                      key={c._id}
                      onClick={() => {
                        setActiveConversationId(c._id);
                        setShowMobileSidebar(false);
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-blue-50 border-l-4 border-l-[#2874F0] border-gray-200 text-[#2874F0] font-bold shadow-xs'
                          : 'bg-white border-transparent hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#2874F0]' : 'text-gray-400'}`} />
                        <span className="text-xs truncate max-w-[150px]">{c.title}</span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteConversation(c._id, e)}
                        className="p-1 text-gray-400 hover:text-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
            <span>256-Bit SSL Encrypted AI Checkout</span>
          </div>
        </div>

        {/* CENTER CHAT AREA */}
        <div className="lg:col-span-6 md:col-span-3 bg-white rounded-xl border border-[#E0E6ED] p-4 sm:p-5 flex flex-col justify-between flex-1 min-h-0 overflow-hidden shadow-xs">
          
          {/* Top Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-[#172337]">PayPilot AI Assistant</h2>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-[#2874F0] text-white rounded uppercase tracking-wider">
                    AI SHOPPING AGENT
                  </span>
                </div>
                <p className="text-[11px] text-[#5F6B76]">Your intelligent shopping copilot</p>
              </div>
            </div>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-2">
            
            {/* WELCOME STATE */}
            {messages.length === 0 && !isSending ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-7 h-7 text-[#2874F0]" />
                </div>

                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-xl font-black text-[#172337]">PayPilot AI Assistant</h3>
                  <p className="text-xs font-bold text-[#2874F0]">Your AI shopping copilot</p>
                  <p className="text-xs text-[#5F6B76] leading-relaxed">
                    Find products, compare prices, discover better alternatives, and build your cart with AI.
                  </p>
                </div>

                <div className="w-full max-w-md space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-left">
                    Suggested prompts:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="p-3 bg-gray-50 hover:bg-blue-50/60 border border-gray-200 hover:border-[#2874F0] text-[#172337] rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between shadow-2xs group cursor-pointer"
                      >
                        <span>"{prompt}"</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#2874F0] opacity-70 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.role === 'USER';
                const isCompare = msg.content?.toLowerCase().includes('compare') || (msg.products && msg.products.length >= 2 && idx === messages.length - 1 && msg.content?.toLowerCase().includes('side-by-side'));

                return (
                  <div
                    key={msg._id || idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    <div
                      className={`rounded-2xl p-4 space-y-3 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#2874F0] text-white font-medium rounded-br-xs max-w-[80%] shadow-xs'
                          : 'bg-white border border-[#E0E6ED] text-[#172337] rounded-bl-xs max-w-[88%] shadow-xs'
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100 font-bold text-[#2874F0]">
                          <Bot className="w-4 h-4 text-[#2874F0]" />
                          <span>PayPilot AI Assistant</span>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Optional Expandable AI Telemetry Log */}
                      {!isUser && msg.agentActivity && msg.agentActivity.length > 0 && (
                        <AgentActivityTimeline activity={msg.agentActivity} />
                      )}

                      {/* Comparison Table */}
                      {!isUser && isCompare && msg.products && msg.products.length >= 2 && (
                        <AIProductComparisonTable products={msg.products} />
                      )}

                      {/* Product Recommendations Cards Grid */}
                      {!isUser && msg.products && msg.products.length > 0 && !isCompare && (
                        <div className="pt-2 space-y-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                            Recommended Products ({msg.products.length})
                          </span>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {msg.products.map((prod, pIdx) => (
                              <AIProductCard key={prod.id || prod._id || pIdx} product={prod} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contextual Action Chips */}
                      {!isUser && idx === messages.length - 1 && (
                        <SuggestedActionsChips onSelectAction={(actText) => handleSendMessage(actText)} />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Thinking / Loading State */}
            {isSending && (
              <div className="flex flex-col items-start space-y-2">
                <div className="rounded-2xl p-4 bg-white border border-[#E0E6ED] text-[#172337] rounded-bl-xs shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#2874F0] font-bold text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Finding the best products for you...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Friendly Error State */}
            {errorState && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-[#D32F2F] font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorState}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="px-3 py-1 bg-[#2874F0] text-white font-bold rounded text-xs cursor-pointer"
                >
                  Try again
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CHAT INPUT MESSAGE COMPOSER */}
          <div className="pt-3 border-t border-gray-100 flex-shrink-0 space-y-2">
            
            {/* Quick Action Pills above Composer */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['Compare products', 'Find cheaper', 'Best rated', 'What\'s in my cart?', 'Checkout'].map((act, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(act)}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874F0] font-bold rounded-full text-[11px] whitespace-nowrap transition-all cursor-pointer"
                >
                  {act}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask PayPilot anything about shopping..."
                  disabled={isSending}
                  className="w-full bg-white border border-[#D9E0E8] rounded-2xl px-4 py-3 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] shadow-xs disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-5 py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-xs disabled:opacity-50 flex-shrink-0 flex items-center gap-1.5 text-xs cursor-pointer"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>

        </div>

        {/* RIGHT SHOPPING CONTEXT PANEL */}
        <div
          className={`lg:col-span-3 hidden lg:block overflow-hidden h-full ${
            showMobileCart ? 'fixed inset-4 z-50 flex bg-white rounded-xl p-4' : ''
          }`}
        >
          <AICartContextPanel candidateProducts={activeCandidateProducts} />
        </div>

      </div>

    </div>
  );
};

export default AIShopPage;
