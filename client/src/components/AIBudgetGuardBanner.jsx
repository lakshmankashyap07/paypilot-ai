import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, DollarSign, Sliders, RefreshCw, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import aiIntelligenceService from '../services/aiIntelligenceService';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUtils';

export const AIBudgetGuardBanner = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { showToast } = useToast();

  const [userBudget, setUserBudget] = useState(30000);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const fetchBudgetAnalysis = async (budgetVal) => {
    try {
      setLoading(true);
      const data = await aiIntelligenceService.analyzeBudget(budgetVal);
      setAnalysis(data);
    } catch (err) {
      console.warn('Budget guard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cart?.items && cart.items.length > 0) {
      fetchBudgetAnalysis(userBudget);
    }
  }, [cart?.total, userBudget]);

  const handleBudgetChange = (e) => {
    const val = Number(e.target.value);
    setUserBudget(val);
  };

  const handleApplySwap = async (replacementProduct) => {
    try {
      setSwapping(true);
      await addToCart(replacementProduct._id, 1);
      showToast(`Swapped for ${replacementProduct.name}!`, 'success');
      fetchBudgetAnalysis(userBudget);
    } catch (err) {
      showToast(err.message || 'Swap failed', 'error');
    } finally {
      setSwapping(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) return null;

  return (
    <div className="bg-white border border-[#E0E6ED] rounded-xl p-5 shadow-xs space-y-4 text-xs text-[#172337]">
      
      {/* Header & Budget Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
            analysis?.isOverBudget ? 'bg-rose-50 text-[#D32F2F] border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#172337] flex items-center gap-1.5">
              <span>AI Budget Guard</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-blue-50 text-[#2874F0] border border-blue-100 rounded-md">LIVE</span>
            </h4>
            <p className="text-[11px] text-[#5F6B76]">
              Set your shopping budget and let AI keep your checkout within target
            </p>
          </div>
        </div>

        {/* Budget Input & Slider */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-[#E0E6ED]">
          <span className="font-bold text-gray-700 text-xs">Target Budget:</span>
          <span className="font-black text-[#2874F0] text-sm">₹{userBudget.toLocaleString('en-IN')}</span>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={userBudget}
            onChange={handleBudgetChange}
            className="w-24 sm:w-32 accent-[#2874F0] cursor-pointer"
          />
        </div>
      </div>

      {/* Analysis Status Alert */}
      {analysis && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          analysis.isOverBudget ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {analysis.isOverBudget ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-xs">
                {analysis.isOverBudget
                  ? `Over Budget by ₹${analysis.difference.toLocaleString('en-IN')}`
                  : 'Cart is Under Budget!'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">{analysis.message}</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Cart Total</span>
            <div className="font-black text-base">₹{analysis.cartTotal?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}

      {/* Smart Cost-Saving Suggestions */}
      {analysis?.isOverBudget && analysis.suggestions?.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Cost-Optimization Suggestions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.suggestions.map((s, idx) => (
              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="font-extrabold text-gray-900 text-xs">{s.title}</div>
                  <p className="text-[11px] text-gray-600 leading-snug">{s.description}</p>
                </div>

                {s.replacementProduct && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <img
                        src={getImageUrl(s.replacementProduct.thumbnail)}
                        alt={s.replacementProduct.name}
                        className="w-8 h-8 object-contain rounded bg-white border border-gray-200 p-0.5"
                      />
                      <div>
                        <div className="font-bold text-[11px] text-gray-900 truncate max-w-[120px]">
                          {s.replacementProduct.name}
                        </div>
                        <div className="text-[10px] font-black text-emerald-700">
                          Save ₹{s.savings.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplySwap(s.replacementProduct)}
                      disabled={swapping}
                      className="px-3 py-1.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-md text-[11px] transition-all cursor-pointer"
                    >
                      Swap Item
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AIBudgetGuardBanner;
