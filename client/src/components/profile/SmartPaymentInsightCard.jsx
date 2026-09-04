import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Smartphone, CreditCard, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const SmartPaymentInsightCard = () => {
  const navigate = useNavigate();
  const { cart, cartCount } = useCart();

  const cartTotal = cart?.total || 0;
  const hasItems = cartCount > 0 && cartTotal > 0;

  // Calculate evidence-based payment offer savings
  const upiSavings = hasItems ? Math.min(500, Math.round(cartTotal * 0.05)) : 0;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-black">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center gap-1.5">
              <span>Smart Payment Intelligence</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-500 text-slate-950 rounded-md uppercase">
                AI OPTIMIZED
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Live checkout recommendation based on current cart items
            </p>
          </div>
        </div>

        <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
      </div>

      {/* Main Content */}
      {hasItems ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Active Cart Amount</span>
              <div className="text-xl font-black text-white">₹{cartTotal.toLocaleString('en-IN')}</div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-xl">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-emerald-200 font-bold uppercase">Recommended Method</div>
                <div className="font-black text-white text-xs">PayPilot Instant UPI</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Potential Savings</span>
              <div className="text-lg font-black text-emerald-400">₹{upiSavings.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              5% Instant Cashback + Zero Payment Gateway Convenience Fee
            </span>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Use Recommended Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-xs text-slate-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-indigo-300 flex-shrink-0" />
            <div>
              <div className="font-extrabold text-white">No active items in cart</div>
              <p className="text-[11px] opacity-80">Add items to your cart to receive AI smart payment offer recommendations & instant cashback insights.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-3.5 py-1.5 bg-white text-slate-900 font-bold rounded-xl text-xs flex-shrink-0 hover:bg-slate-100 transition-colors"
          >
            Shop Catalogue
          </button>
        </div>
      )}

    </div>
  );
};

export default SmartPaymentInsightCard;
