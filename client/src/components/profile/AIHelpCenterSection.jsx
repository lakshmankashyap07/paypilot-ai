import React, { useState } from 'react';
import { HelpCircle, Package, RotateCcw, DollarSign, CreditCard, Tag, AlertCircle, Bot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export const AIHelpCenterSection = ({ orders = [] }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [helpResponse, setHelpResponse] = useState(null);

  const handleAction = (actionKey) => {
    const latestOrder = orders[0];
    const orderId = latestOrder?._id ? `#${latestOrder.orderNumber || latestOrder._id.slice(-8)}` : 'your latest order';

    switch (actionKey) {
      case 'TRACK':
        if (latestOrder) {
          setHelpResponse(`📦 Order Status for ${orderId}: Currently "${latestOrder.orderStatus || 'PROCESSING'}". Estimated delivery in 2-3 business days.`);
        } else {
          setHelpResponse('📦 You currently have no active orders. Explore the Shop page to place your first order!');
        }
        break;

      case 'RETURN':
        if (latestOrder) {
          setHelpResponse(`↩️ Return Eligible for ${orderId}: You can request a 7-day hassle-free return directly from the Order Details page.`);
        } else {
          setHelpResponse('↩️ Returns can be initiated for delivered orders within 7 days of delivery.');
        }
        break;

      case 'REFUND':
        setHelpResponse('💰 Refunds are credited within 24 hours to your PayPilot Wallet or original payment method upon return confirmation.');
        break;

      case 'PAYMENT_FAIL':
        setHelpResponse('💳 If money was deducted during a failed checkout, RazorPay automatically refunds the amount within 3-5 business days.');
        break;

      case 'COUPONS':
        setHelpResponse('🎟️ Available System Coupons: Use "FESTIVE15" for 15% off orders over ₹20,000 or "PAYPILOT10" for 10% off.');
        break;

      case 'PRODUCT_ISSUE':
        setHelpResponse('🛍️ Have an issue with a product? Submit a product inquiry through the order details page for instant AI support resolution.');
        break;

      default:
        setHelpResponse('PayPilot Customer Support is available 24/7. Ask PayPilot AI Assistant above for custom inquiries!');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-5 text-xs text-gray-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#2874F0]" />
            <span>AI Customer Support & Help Center</span>
          </h2>
          <p className="text-xs text-gray-500">1-click order resolution and instant AI support responses</p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-black bg-blue-50 text-[#2874F0] border border-blue-100 rounded-full">
          24/7 SUPPORT
        </span>
      </div>

      {/* Quick Trigger Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { key: 'TRACK', icon: Package, title: 'Where is my order?', color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { key: 'RETURN', icon: RotateCcw, title: 'Start a return', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { key: 'REFUND', icon: DollarSign, title: 'Where is my refund?', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { key: 'PAYMENT_FAIL', icon: CreditCard, title: 'Payment failed?', color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { key: 'COUPONS', icon: Tag, title: 'Find my coupons', color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { key: 'PRODUCT_ISSUE', icon: AlertCircle, title: 'Report product issue', color: 'text-amber-600 bg-amber-50 border-amber-100' }
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleAction(item.key)}
            className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-2 text-left cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold ${item.color}`}>
              <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-gray-900 text-xs">{item.title}</div>
          </button>
        ))}
      </div>

      {/* Response Display Box */}
      {helpResponse && (
        <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-black text-[#172337]">
            <Bot className="w-4.5 h-4.5 text-[#2874F0]" />
            <span>AI Support Resolution</span>
          </div>
          <p className="text-xs text-gray-800 leading-relaxed font-medium">
            {helpResponse}
          </p>
        </div>
      )}

    </div>
  );
};

export default AIHelpCenterSection;
