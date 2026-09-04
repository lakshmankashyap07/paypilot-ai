import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, ShieldCheck, Tag, Zap, DollarSign, Percent, Gift, ArrowRight } from 'lucide-react';
import aiIntelligenceService from '../services/aiIntelligenceService';

export const AICheckoutAssistantBanner = ({ userBudget = 30000, onApplyPromo }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await aiIntelligenceService.getCheckoutAssistantSummary(userBudget);
        setSummary(data);
      } catch (err) {
        console.warn('Checkout assistant error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userBudget]);

  if (loading || !summary || !summary.hasCart) return null;

  const { cartTotal, isOverBudget, budgetDifference, recommendedOffer, potentialSavings, checkoutTip } = summary;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-[#172337] to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-800/50 space-y-4 text-xs">
      
      {/* Banner Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#FFCA28] border border-blue-400/30 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>AI Checkout Assistant</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-[#FFCA28] text-[#172337] rounded-md uppercase">
                Smart Savings Active
              </span>
            </h3>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Pre-payment verification, budget analysis, and available discount optimizer
            </p>
          </div>
        </div>
      </div>

      {/* AI Insight Tip */}
      <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-700/60 text-blue-100 font-medium leading-relaxed text-xs flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-[#FFCA28] flex-shrink-0 mt-0.5" />
        <span>{checkoutTip}</span>
      </div>

      {/* Recommended Offer Card */}
      {recommendedOffer && (
        <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#FFCA28]" />
              <span className="font-extrabold text-white text-xs">Recommended Offer: {recommendedOffer.code}</span>
            </div>
            <p className="text-[11px] text-blue-200">{recommendedOffer.description}</p>
          </div>

          <button
            onClick={() => onApplyPromo && onApplyPromo(recommendedOffer.code)}
            className="px-4 py-2 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs transition-all shadow-md flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Apply & Save ₹{potentialSavings.toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-blue-300 font-bold uppercase">Budget Status</div>
          <div className={`font-black text-xs mt-0.5 ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isOverBudget ? `Over by ₹${budgetDifference.toLocaleString('en-IN')}` : 'Within Target'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-blue-300 font-bold uppercase">Potential Savings</div>
          <div className="font-black text-emerald-400 text-xs mt-0.5">
            ₹{potentialSavings.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
          <div className="text-[10px] text-blue-300 font-bold uppercase">Final Pay Amount</div>
          <div className="font-black text-white text-sm mt-0.5">
            ₹{Math.max(0, cartTotal - potentialSavings).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AICheckoutAssistantBanner;
