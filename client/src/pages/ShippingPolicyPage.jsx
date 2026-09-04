import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowLeft, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const ShippingPolicyPage = () => {
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
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Policy</h1>
            <p className="text-xs text-gray-500 font-medium">Pan-India Express Logistics & Order Tracking</p>
          </div>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>1. Delivery Timelines & Processing</span>
          </h2>
          <p>
            Orders placed on PayPilot AI are dispatched within 24 hours of payment authorization. Standard express delivery across major metro cities takes 2-4 business days, while tier-2 and tier-3 regions take 4-6 business days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2874F0]" />
            <span>2. Shipping Charges & Free Shipping Threshold</span>
          </h2>
          <p>
            PayPilot AI offers <strong>FREE Express Shipping</strong> on all orders above ₹499. Orders below ₹499 incur a nominal ₹40 standard delivery charge.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>3. Order Tracking & Real-Time Updates</span>
          </h2>
          <p>
            Once dispatched, customers receive real-time SMS updates and tracking links. You can also view live tracking updates directly in the <strong>My Orders</strong> section of your PayPilot Account.
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <div>Shipping query? Email <strong>logistics@paypilot.demo</strong></div>
          <Link to="/orders" className="text-[#2874F0] font-bold hover:underline">
            Track Active Orders →
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ShippingPolicyPage;
