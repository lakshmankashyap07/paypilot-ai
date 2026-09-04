import React, { useState, useEffect } from 'react';
import { Bot, AlertTriangle, TrendingUp, Package, ShieldCheck, Zap, RefreshCw, Loader2, Send, CheckCircle2 } from 'lucide-react';
import agenticCommerceService from '../services/agenticCommerceService';
import { useToast } from '../context/ToastContext';

export const MerchantCopilotWidget = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Q&A State
  const [qaInput, setQaInput] = useState('');
  const [qaThread, setQaThread] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const fetchCopilot = async () => {
    try {
      setLoading(true);
      const res = await agenticCommerceService.getMerchantCopilot();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Merchant copilot error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCopilot();
  }, []);

  const handleAskQA = async (queryText = null) => {
    const question = (queryText || qaInput).trim();
    if (!question || isAsking) return;

    setQaThread((prev) => [...prev, { role: 'USER', content: question }]);
    setQaInput('');

    try {
      setIsAsking(true);
      const res = await agenticCommerceService.askMerchantCopilotQA(question);
      if (res && res.data?.answer) {
        setQaThread((prev) => [...prev, { role: 'ASSISTANT', content: res.data.answer }]);
      }
    } catch (err) {
      showToast(err.message || 'Failed to ask Copilot', 'error');
    } finally {
      setIsAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] flex items-center justify-center gap-2 text-xs text-gray-500 font-bold">
        <Loader2 className="w-4 h-4 animate-spin text-[#2874F0]" />
        <span>Loading AI Merchant Copilot Insights...</span>
      </div>
    );
  }

  if (!data) return null;

  const {
    totalProducts,
    activeProducts,
    lowStockCount,
    outOfStockCount,
    totalRevenue,
    totalOrders,
    averageOrderValue,
    unitsSold,
    topSellingProduct,
    salesExplanation,
    listingQualityScore,
    demandSignal,
    priorityActions,
    insights
  } = data;

  return (
    <div className="bg-white border border-[#E0E6ED] rounded-xl p-5 shadow-xs space-y-5 text-xs text-[#172337]">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#172337] flex items-center gap-1.5">
              <span>AI Merchant Copilot</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-600 text-white rounded uppercase tracking-wider">
                LIVE INSIGHTS
              </span>
            </h3>
            <p className="text-[11px] text-[#5F6B76]">
              Real-time sales, inventory risks, & demand signals derived from MongoDB
            </p>
          </div>
        </div>

        <button
          onClick={fetchCopilot}
          className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-pointer transition-colors"
          title="Refresh Copilot Insights"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* AI Business Explanation Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/90 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>AI Business Performance Summary</span>
          </span>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded">
            Listing Score: {listingQualityScore}/100
          </span>
        </div>

        <div className="space-y-1 text-xs text-gray-800 leading-relaxed font-medium">
          <p>• Store Generated: <strong>₹{totalRevenue?.toLocaleString('en-IN')}</strong> across <strong>{totalOrders}</strong> customer orders (AOV: ₹{averageOrderValue?.toLocaleString('en-IN')}).</p>
          <p>• {salesExplanation}</p>
          <p>• Demand Signal: <span className="text-indigo-900 font-bold">{demandSignal}</span></p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Active Listings</div>
          <div className="font-black text-gray-900 text-sm mt-0.5">{activeProducts} / {totalProducts}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Captured Revenue</div>
          <div className="font-black text-emerald-700 text-sm mt-0.5">₹{totalRevenue?.toLocaleString('en-IN')}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Total Orders</div>
          <div className="font-black text-gray-900 text-sm mt-0.5">{totalOrders}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Units Sold</div>
          <div className="font-black text-gray-900 text-sm mt-0.5">{unitsSold}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Avg Order Value</div>
          <div className="font-black text-gray-900 text-sm mt-0.5">₹{averageOrderValue?.toLocaleString('en-IN')}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Low Stock</div>
          <div className={`font-black text-sm mt-0.5 ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {lowStockCount} items
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="text-[9px] text-gray-500 font-bold uppercase">Stockouts</div>
          <div className={`font-black text-sm mt-0.5 ${outOfStockCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {outOfStockCount} items
          </div>
        </div>
      </div>

      {/* AI Recommended Actions */}
      {priorityActions && priorityActions.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
            AI Recommended Actions ({priorityActions.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {priorityActions.map((act) => (
              <div key={act.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/60 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="font-extrabold text-xs text-gray-900">{act.title}</div>
                  <p className="text-[11px] text-gray-600 leading-snug">{act.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Opening action center for: ${act.title}`, 'info')}
                  className="self-start px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-md cursor-pointer transition-colors"
                >
                  {act.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ask the Copilot Q&A Section */}
      <div className="pt-3 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>Ask Merchant Copilot a Question</span>
        </div>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            'Which product sold the most?',
            'Which products should I restock?',
            'How much revenue did I generate?',
            'Which products need better listings?'
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAskQA(q)}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-full text-[11px] whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Thread History */}
        {qaThread.length > 0 && (
          <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
            {qaThread.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    m.role === 'USER'
                      ? 'bg-indigo-600 text-white font-medium rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-900 font-medium shadow-2xs rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQA();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={qaInput}
            onChange={(e) => setQaInput(e.target.value)}
            placeholder="Ask Copilot about sales, top products, or inventory..."
            disabled={isAsking}
            className="flex-grow bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
          />
          <button
            type="submit"
            disabled={isAsking || !qaInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isAsking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default MerchantCopilotWidget;
