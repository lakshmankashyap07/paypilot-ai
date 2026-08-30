import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { RazorpayCheckout } from './RazorpayCheckout';

export const AIPaymentActionCard = ({
  paymentData,
  orderNumber,
  totalAmount,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  if (!paymentData) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 my-2 text-xs shadow-xl max-w-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
        <span className="flex items-center gap-1.5 text-teal-400">
          <CreditCard className="w-4 h-4" />
          Razorpay Payment Ready
        </span>
        <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-black">
          TEST MODE
        </span>
      </div>

      <div className="space-y-1 text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Order Number</span>
          <span className="font-bold text-white">{orderNumber}</span>
        </div>
        <div className="flex justify-between font-extrabold text-white text-sm pt-1">
          <span>Amount Due</span>
          <span className="text-teal-400">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <RazorpayCheckout
        paymentData={paymentData}
        onSuccess={onPaymentSuccess}
        onFailure={onPaymentFailure}
      />
    </div>
  );
};

export default AIPaymentActionCard;
