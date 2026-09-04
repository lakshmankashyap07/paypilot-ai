import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CancellationPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-xs text-gray-800">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-gray-200">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cancellation Policy</h1>
            <p className="text-xs text-gray-500 font-medium">Instant Pre-Shipment Order Cancellation Standard</p>
          </div>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>1. Instant Pre-Shipment Cancellation</span>
          </h2>
          <p>
            Customers can cancel any order prior to merchant dispatch directly from the <strong>My Orders</strong> section. Pre-shipment cancellations are processed instantly with zero cancellation fee.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span>2. Post-Shipment Cancellation</span>
          </h2>
          <p>
            Once an order has been dispatched and handed to logistics carriers, direct cancellation is no longer available. In such cases, you can refuse package acceptance at delivery time or initiate a return upon receipt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>3. Automated Refund Credit</span>
          </h2>
          <p>
            Upon successful cancellation, 100% of the paid order amount is credited immediately to your PayPilot Wallet or refunded to your original payment account.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>Need cancellation support? Contact <strong>support@paypilot.demo</strong></div>
          <Link to="/orders" className="text-[#2874F0] font-bold hover:underline">
            Manage Active Orders →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default CancellationPolicyPage;
