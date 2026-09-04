import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Bot, CheckCircle2, FileText } from 'lucide-react';

export const PrivacyPolicyPage = () => {
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
          <div className="w-10 h-10 rounded-2xl bg-[#2874F0] text-white flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-gray-500 font-medium">Last updated: August 2026 • PayPilot AI Data Protection Standard</p>
          </div>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2874F0]" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            At PayPilot AI, we prioritize user data privacy and security. We collect essential information required to process e-commerce orders, facilitate Razorpay payments, and generate personalized shopping recommendations. This includes your name, email address, phone number, shipping address, and order transaction history.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>2. AI & Recommendation Processing</span>
          </h2>
          <p>
            Our proprietary AI Shopping Assistant processes anonymized browsing behavior and order history to suggest products, apply promotional coupons, and compute smart payment recommendations. We never sell your personal shopping data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>3. Payment Gateway & Tokenization</span>
          </h2>
          <p>
            PayPilot AI uses Razorpay PCI-DSS 256-bit bank-grade encrypted payment infrastructure. Raw credit/debit card numbers, PINs, and CVVs are never stored on PayPilot servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>4. User Rights & Data Privacy Center</span>
          </h2>
          <p>
            You have full control over your data. Through the PayPilot Privacy Center under your Account Profile, you can toggle AI personalization, download your full account data archive, or request permanent account deletion.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>Questions regarding privacy? Contact <strong>privacy@paypilot.demo</strong></div>
          <Link to="/profile" className="text-[#2874F0] font-bold hover:underline">
            Manage Privacy Settings →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default PrivacyPolicyPage;
