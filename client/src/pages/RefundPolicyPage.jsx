import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ArrowLeft, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RefundPolicyPage = () => {
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
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Refund Policy</h1>
            <p className="text-xs text-gray-500 font-medium">Instant PayPilot Wallet & Razorpay Direct Settlement Standard</p>
          </div>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>1. 7-Day Hassle-Free Returns & Refunds</span>
          </h2>
          <p>
            Customers are eligible for full refunds on returns requested within 7 days of order delivery. Returned items must be unused, in original manufacturer packaging, and include all tags and accessories.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#2874F0]" />
            <span>2. Refund Settlement Timelines</span>
          </h2>
          <p>
            Upon return verification by the merchant or logistics carrier:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-medium text-gray-700">
            <li><strong>PayPilot Wallet:</strong> Instant settlement (credited immediately upon return approval).</li>
            <li><strong>UPI & Net Banking:</strong> 24-48 business hours.</li>
            <li><strong>Credit / Debit Cards:</strong> 3-5 business days via Razorpay banking channels.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>3. Order Cancellation Refunds</span>
          </h2>
          <p>
            If an order is cancelled prior to shipment dispatch, a 100% full refund is initiated automatically to your original payment mode or PayPilot Wallet.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>Need assistance with a refund? Contact <strong>support@paypilot.demo</strong></div>
          <Link to="/orders" className="text-[#2874F0] font-bold hover:underline">
            Check Order & Refund Status →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default RefundPolicyPage;
