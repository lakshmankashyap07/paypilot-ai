import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Check, Zap, Loader2 } from 'lucide-react';
import agenticCommerceService from '../services/agenticCommerceService';
import { useCart } from '../hooks/useCart';

export const AIDealOptimizerBanner = ({ onSelectOffer }) => {
  const { cart } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const res = await agenticCommerceService.optimizeCartDeals();
        setData(res);
      } catch (err) {
        console.warn('Deal optimizer error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cart?.items && cart.items.length > 0) {
      fetchDeal();
    }
  }, [cart?.total]);

  if (!cart?.items || cart.items.length === 0 || !data || !data.bestOffer) return null;

  const { cartTotal, bestOffer, discountAmount, finalTotal, rationale } = data;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 border border-amber-300 rounded-xl p-4 space-y-3 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF9F00] text-white flex items-center justify-center font-extrabold shadow-2xs">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5">
              <span>AI Deal Optimizer</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-[#388E3C] text-white rounded">
                SAVINGS ACTIVE
              </span>
            </h4>
            <div className="text-[10px] text-gray-500 font-bold">{rationale}</div>
          </div>
        </div>

        <button
          onClick={() => onSelectOffer && onSelectOffer(bestOffer.code)}
          className="px-3.5 py-1.5 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Apply {bestOffer.code}</span>
        </button>
      </div>

      {/* Savings Breakdown Row */}
      <div className="p-2.5 rounded-lg bg-white border border-amber-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500">Cart Total: ₹{cartTotal.toLocaleString('en-IN')}</span>
          <span className="text-gray-300">|</span>
          <span className="font-extrabold text-[#388E3C]">Coupon Discount: -₹{discountAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="font-black text-gray-900 text-sm">
          Pay Only: ₹{finalTotal.toLocaleString('en-IN')}
        </div>
      </div>

    </div>
  );
};

export default AIDealOptimizerBanner;
