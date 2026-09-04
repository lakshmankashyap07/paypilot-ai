import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export const TermsOfServicePage = () => {
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
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-gray-500 font-medium">Effective Date: August 2026 • PayPilot AI Terms of Agreement</p>
          </div>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>1. Platform Usage & Account Responsibility</span>
          </h2>
          <p>
            By accessing or placing orders on PayPilot AI, you agree to comply with these Terms of Service. Customers are responsible for maintaining the confidentiality of their account credentials and for all activities conducted under their registered account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2874F0]" />
            <span>2. Marketplace Merchant Ecosystem</span>
          </h2>
          <p>
            PayPilot AI connects verified independent merchants with consumers. Product descriptions, specifications, inventory stock, and merchant warranties are managed directly by respective store owners. PayPilot AI enforces strict listing quality checks and seller verification standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>3. Order Acceptance & Pricing Integrity</span>
          </h2>
          <p>
            All checkout totals and applicable promotion discounts are validated on the backend prior to Razorpay order generation. PayPilot AI reserves the right to cancel orders placed under pricing errors or fraudulent transactions.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>For legal inquiries, contact <strong>legal@paypilot.demo</strong></div>
          <Link to="/shop" className="text-[#2874F0] font-bold hover:underline">
            Explore Marketplace Catalog →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default TermsOfServicePage;
