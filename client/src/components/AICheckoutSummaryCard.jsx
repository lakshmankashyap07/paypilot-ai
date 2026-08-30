import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AICheckoutSummaryCard = ({ summary, onConfirmOrder }) => {
  const { showToast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!summary) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      if (onConfirmOrder) {
        await onConfirmOrder();
      }
    } catch (err) {
      showToast(err.message || 'Failed to confirm order', 'error');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 my-2 text-xs shadow-xl max-w-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
        <span className="flex items-center gap-1.5 text-teal-400">
          <ShoppingBag className="w-4 h-4" />
          Checkout Summary
        </span>
        <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20 uppercase font-black">
          Grounded Prices
        </span>
      </div>

      {/* Address */}
      {summary.addressSnapshot && (
        <div className="space-y-1 text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-teal-400" />
            Shipping To
          </span>
          <div className="font-bold text-white text-[11px]">{summary.addressSnapshot.fullName}</div>
          <div className="text-[10px] text-slate-400">
            {summary.addressSnapshot.addressLine1}, {summary.addressSnapshot.city} - {summary.addressSnapshot.postalCode}
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-1.5 text-slate-300">
        <div className="flex justify-between">
          <span>Subtotal ({summary.itemCount} items)</span>
          <span>{formatCurrency(summary.subtotal)}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-teal-400">
            <span>Discount</span>
            <span>-{formatCurrency(summary.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-400">
          <span>GST Tax (18%)</span>
          <span>{formatCurrency(summary.tax)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Shipping</span>
          <span>{summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}</span>
        </div>
        <div className="flex justify-between font-extrabold text-white text-sm pt-2 border-t border-slate-800">
          <span>Total</span>
          <span className="text-teal-400">{formatCurrency(summary.total)}</span>
        </div>
      </div>

      {/* Explicit Confirmation CTA */}
      <button
        onClick={handleConfirm}
        disabled={isConfirming}
        className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
      >
        {isConfirming ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Creating Order...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Place Order ({formatCurrency(summary.total)})</span>
          </>
        )}
      </button>

      <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3 text-teal-400" />
        <span>Explicit confirmation required before order creation</span>
      </div>
    </div>
  );
};

export default AICheckoutSummaryCard;
