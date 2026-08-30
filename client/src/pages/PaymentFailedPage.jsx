import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export const PaymentFailedPage = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 text-xs text-[#212121]">
      
      {/* Failure Badge */}
      <div className="w-16 h-16 rounded-full bg-rose-100 text-[#D32F2F] border border-rose-300 flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="w-9 h-9" />
      </div>

      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-[#D32F2F] border border-rose-200 uppercase tracking-widest">
          Payment Unsuccessful
        </span>
        <h1 className="text-2xl font-black text-gray-900">Payment Failed</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Your payment could not be processed. Your order is safely preserved in your account with status <strong className="text-[#D32F2F]">UNPAID / FAILED</strong>.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/payment/${orderId}`}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Payment Again</span>
        </Link>

        <Link
          to="/cart"
          className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl border border-gray-300 text-xs flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

    </div>
  );
};

export default PaymentFailedPage;
