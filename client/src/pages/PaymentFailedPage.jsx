import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft, ShieldCheck, ShoppingBag, CreditCard } from 'lucide-react';

export const PaymentFailedPage = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 text-xs text-[#172337]">
      
      {/* Failure Icon */}
      <div className="w-16 h-16 rounded-full bg-rose-50 text-[#D32F2F] border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-[#D32F2F] border border-rose-200 uppercase tracking-widest">
          Razorpay Transaction Unsuccessful
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Payment Failed</h1>
        <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
          Your transaction could not be completed. Your order <strong className="text-gray-900">#{orderId ? orderId.slice(-6).toUpperCase() : '000000'}</strong> remains saved as <strong className="text-[#D32F2F]">PENDING</strong>. Your cart items are safe and intact.
        </p>
      </div>

      {/* Payment Recovery Options Card */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left space-y-3 shadow-2xs">
        <div className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
          <CreditCard className="w-4 h-4 text-[#2874F0]" />
          <span>Recommended Recovery Actions</span>
        </div>

        <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
          <li className="flex items-start gap-2">
            <span className="text-[#2874F0] font-black">•</span>
            <span><strong>Retry with Razorpay:</strong> Relaunch secure checkout using UPI, NetBanking, Cards, or Wallet.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2874F0] font-black">•</span>
            <span><strong>Change Payment Method:</strong> Select a different card or UPI VPA to avoid gateway timeouts.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2874F0] font-black">•</span>
            <span><strong>Return to Cart:</strong> Modify cart items or quantities before attempting payment again.</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {orderId && (
          <Link
            to={`/payment/${orderId}`}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment with Razorpay</span>
          </Link>
        )}

        <Link
          to="/cart"
          className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl border border-gray-200 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Cart (Items Intact)</span>
        </Link>
      </div>

    </div>
  );
};

export default PaymentFailedPage;
