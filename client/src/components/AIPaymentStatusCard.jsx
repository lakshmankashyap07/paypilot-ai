import React from 'react';
import { CheckCircle2, AlertCircle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIPaymentStatusCard = ({ statusData }) => {
  if (!statusData) return null;

  const { orderId, orderNumber, paymentNumber, paymentStatus, orderStatus, amount, paidAt } = statusData;

  const isSuccess = paymentStatus === 'CAPTURED' || paymentStatus === 'PAID';

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);

  return (
    <div
      className={`glass-panel p-4 sm:p-5 rounded-2xl border ${
        isSuccess ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'
      } space-y-3 my-2 text-xs shadow-xl max-w-sm`}
    >
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400" />
        )}
        <h4 className="font-extrabold text-white text-sm">
          {isSuccess ? 'Payment Verified & Order Confirmed!' : 'Payment Failed / Unpaid'}
        </h4>
      </div>

      <div className="space-y-1.5 text-slate-300 text-[11px] p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="flex justify-between">
          <span className="text-slate-400">Order Number</span>
          <span className="font-bold text-white">{orderNumber}</span>
        </div>
        {paymentNumber && (
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Reference</span>
            <span className="font-bold text-white">{paymentNumber}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Total Amount</span>
          <span className="font-extrabold text-teal-400">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Status</span>
          <span className={`font-bold ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
            {paymentStatus}
          </span>
        </div>
      </div>

      <div className="pt-1 flex items-center gap-2">
        <Link
          to={`/orders/${orderId}`}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
        >
          <Package className="w-3.5 h-3.5" />
          <span>View Order</span>
        </Link>
      </div>
    </div>
  );
};

export default AIPaymentStatusCard;
