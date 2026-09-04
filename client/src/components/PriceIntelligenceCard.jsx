import React, { useState, useEffect } from 'react';
import { TrendingDown, ShieldCheck, Zap, Info, ArrowDown, Star, AlertCircle } from 'lucide-react';
import aiIntelligenceService from '../services/aiIntelligenceService';

export const PriceIntelligenceCard = ({ productId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        setLoading(true);
        const res = await aiIntelligenceService.getPriceIntelligence(productId);
        setData(res);
      } catch (err) {
        console.warn('Price intelligence error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchIntel();
  }, [productId]);

  if (loading || !data) return null;

  const { currentPrice, originalPrice, discountPercentage, priceVerdict, insightText, historicalNotice } = data;

  return (
    <div className="bg-white border border-[#E0E6ED] rounded-xl p-4 shadow-xs space-y-3 text-xs text-[#172337]">
      
      {/* Header Badge & Verdict */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#388E3C] border border-emerald-100 flex items-center justify-center font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-black text-xs text-gray-900">AI Price Intelligence</h4>
            <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
              <span>{priceVerdict}</span>
            </div>
          </div>
        </div>

        {discountPercentage > 0 && (
          <span className="px-2.5 py-1 text-[10px] font-extrabold bg-[#388E3C] text-white rounded-md shadow-2xs">
            {discountPercentage}% BELOW MRP
          </span>
        )}
      </div>

      {/* Insight Text */}
      <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-950 font-medium leading-relaxed text-[11px] flex items-start gap-2">
        <Zap className="w-4 h-4 text-[#388E3C] flex-shrink-0 mt-0.5" />
        <span>{insightText}</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Current Price</div>
          <div className="font-extrabold text-gray-900 text-xs mt-0.5">₹{currentPrice?.toLocaleString('en-IN')}</div>
        </div>

        <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Original MRP</div>
          <div className="font-bold text-gray-400 line-through text-xs mt-0.5">₹{originalPrice?.toLocaleString('en-IN')}</div>
        </div>

        <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 font-bold uppercase">Price Trend</div>
          <div className="font-extrabold text-emerald-600 text-xs mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowDown className="w-3 h-3" />
            <span>Optimal</span>
          </div>
        </div>
      </div>

      {/* Historical Disclaimer */}
      <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 pt-1">
        <Info className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span>{historicalNotice}</span>
      </div>

    </div>
  );
};

export default PriceIntelligenceCard;
