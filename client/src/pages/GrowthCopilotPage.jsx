import React, { useState, useEffect, useRef } from 'react';
import growthCopilotService from '../services/growthCopilotService';
import campaignService from '../services/campaignService';
import { useToast } from '../context/ToastContext';
import { GrowthInsightCard } from '../components/GrowthInsightCard';
import {
  Bot,
  Send,
  Plus,
  Sparkles,
  Loader2,
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const SUGGESTED_GROWTH_PROMPTS = [
  "Why did sales change this month?",
  "How to recover abandoned carts?",
  "Which searches return no results?",
  "Which products run out of stock soon?",
  "What are my top growth opportunities?",
  "Create a 10% cart recovery offer"
];

export const GrowthCopilotPage = () => {
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoadingOpp, setIsLoadingOpp] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Load Sessions & Opportunities
  useEffect(() => {
    growthCopilotService.getConversations()
      .then((res) => {
        if (res?.success && res.data?.conversations) {
          setConversations(res.data.conversations);
          if (res.data.conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(res.data.conversations[0]._id);
          }
        }
      })
      .catch((e) => console.warn(e.message));

    growthCopilotService.getOpportunities()
      .then((res) => {
        if (res?.success && res.data?.opportunities) {
          setOpportunities(res.data.opportunities);
        }
      })
      .catch((e) => console.warn(e.message))
      .finally(() => setIsLoadingOpp(false));
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    growthCopilotService.getConversation(activeConversationId)
      .then((res) => {
        if (res?.success && res.data?.messages) {
          setMessages(res.data.messages);
        }
      })
      .catch((e) => console.warn(e.message));
  }, [activeConversationId]);

  const handleNewSession = async () => {
    try {
      const res = await growthCopilotService.sendMessage('Hello Growth Copilot!', null);
      if (res?.success && res.data) {
        setConversations([res.data.conversation, ...conversations]);
        setActiveConversationId(res.data.conversationId);
      }
    } catch (e) {
      showToast(e.message || 'Failed to create session', 'error');
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isSending) return;

    setInputMessage('');

    const tempUserMsg = {
      _id: `temp_${Date.now()}`,
      role: 'MERCHANT',
      content: query,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setIsSending(true);
      const res = await growthCopilotService.sendMessage(query, activeConversationId);

      if (res?.success && res.data) {
        const { conversationId, message } = res.data;
        if (!activeConversationId) {
          setActiveConversationId(conversationId);
        }
        setMessages((prev) => [...prev.filter((m) => m._id !== tempUserMsg._id), tempUserMsg, message]);
      }
    } catch (err) {
      showToast(err.message || 'Failed to send prompt', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateDraftFromOpportunity = async (type) => {
    try {
      const res = await campaignService.createCampaign({
        name: `AI ${type.replace(/_/g, ' ')} Draft`,
        type: type || 'CART_RECOVERY',
        targetSegment: 'CART_ABANDONER',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        status: 'DRAFT'
      });

      if (res?.success) {
        showToast('Campaign draft created successfully! Visit AI Campaigns to confirm and activate.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to create campaign draft', 'error');
    }
  };

  return (
    <div className="space-y-6 text-xs text-[#172337] flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#172337]">AI Growth Copilot</h1>
            <span className="px-2 py-0.5 text-[9px] font-black bg-[#2874F0] text-white rounded uppercase">
              AI STORE ADVISOR
            </span>
          </div>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Your AI-powered assistant for growing store sales, cart recovery, and inventory optimization.
          </p>
        </div>

        <button
          onClick={handleNewSession}
          className="px-4 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Strategy Session</span>
        </button>
      </div>

      {/* 3-Column Layout Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* COLUMN 1: Sessions Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E0E6ED] p-4 flex flex-col justify-between hidden md:flex overflow-hidden shadow-xs">
          <div className="space-y-3 flex-1 overflow-y-auto">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1 block border-b border-gray-100 pb-2">
              Strategy Sessions ({conversations.length})
            </span>

            <div className="space-y-1.5 pt-1">
              {conversations.map((c) => {
                const isActive = activeConversationId === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveConversationId(c._id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-50 border-l-4 border-l-[#2874F0] border-gray-200 text-[#2874F0] font-bold shadow-xs'
                        : 'bg-white border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#2874F0]' : 'text-gray-400'}`} />
                      <span className="text-xs truncate">{c.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
            <span>Encrypted AI Advisor</span>
          </div>
        </div>

        {/* COLUMN 2: Main Growth Copilot Chat Thread */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E0E6ED] p-4 sm:p-5 flex flex-col justify-between flex-1 min-h-0 overflow-hidden shadow-xs">
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 && !isSending ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-7 h-7 text-[#2874F0]" />
                </div>

                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-xl font-black text-[#172337]">How can I grow your store today?</h3>
                  <p className="text-xs text-[#5F6B76] leading-relaxed">
                    Ask me about sales trends, cart recovery, inventory risks, or campaign recommendations.
                  </p>
                </div>

                <div className="w-full max-w-lg space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-left">
                    Suggested Merchant Prompts:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTED_GROWTH_PROMPTS.map((prompt, idx) => (
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
                const isMerchant = msg.role === 'MERCHANT';

                return (
                  <div
                    key={msg._id || idx}
                    className={`flex flex-col ${isMerchant ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    <div
                      className={`rounded-2xl p-4 space-y-2.5 text-xs leading-relaxed ${
                        isMerchant
                          ? 'bg-[#2874F0] text-white font-medium rounded-br-xs max-w-[80%] shadow-xs'
                          : 'bg-gray-50 border border-[#E0E6ED] text-[#172337] rounded-bl-xs max-w-[88%] shadow-xs'
                      }`}
                    >
                      {!isMerchant && (
                        <div className="flex items-center gap-1.5 pb-2 border-b border-gray-200 font-bold text-[#2874F0]">
                          <Bot className="w-4 h-4 text-[#2874F0]" />
                          <span>PayPilot Growth Copilot</span>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Evidence Cards */}
                      {!isMerchant && msg.evidenceCards && msg.evidenceCards.length > 0 && (
                        <div className="pt-2 space-y-2">
                          {msg.evidenceCards.map((card, cIdx) => (
                            <div key={cIdx} className="p-3 rounded-lg bg-white border border-[#E0E6ED] space-y-1 text-xs">
                              <span className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wider">
                                {card.title}
                              </span>
                              <div className="font-black text-gray-900 text-sm">{card.metric}</div>
                              {card.points?.map((pt, pIdx) => (
                                <div key={pIdx} className="text-[11px] text-gray-700 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2874F0]"></span>
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isSending && (
              <div className="flex items-center gap-2 text-[#2874F0] text-xs font-bold animate-pulse p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Growth Copilot analyzing store data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Message Composer */}
          <div className="pt-3 border-t border-gray-100 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Growth Copilot (e.g., 'Why did sales change?', 'Create cart offer')..."
                disabled={isSending}
                className="flex-1 bg-white border border-[#D9E0E8] rounded-2xl px-4 py-3 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0] shadow-xs disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-5 py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-xs transition-all disabled:opacity-50 flex-shrink-0 flex items-center gap-1.5 text-xs cursor-pointer"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

        </div>

        {/* COLUMN 3: Growth Opportunity Feeds */}
        <div className="lg:col-span-3 hidden lg:block space-y-3 overflow-y-auto pr-1">
          <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">
            Detected Opportunities ({opportunities.length})
          </span>

          {isLoadingOpp ? (
            <div className="h-40 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
          ) : (
            opportunities.map((opp, idx) => (
              <GrowthInsightCard
                key={idx}
                opportunity={opp}
                onCreateDraft={handleCreateDraftFromOpportunity}
              />
            ))
          )}
        </div>

      </div>

    </div>
  );
};

export default GrowthCopilotPage;
