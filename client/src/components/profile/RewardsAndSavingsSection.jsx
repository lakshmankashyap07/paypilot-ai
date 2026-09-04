import React from 'react';
import { Gift, Tag, DollarSign, Zap, Bot, CheckCircle2, TrendingUp } from 'lucide-react';

export const RewardsAndSavingsSection = ({ stats }) => {
  const {
    totalSavings = 3240,
    couponsSaved = 1450,
    paymentSavings = 1200,
    cashbackEarned = 590
  } = stats || {};

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-600" />
            <span>Rewards, Coupons & Savings Intelligence</span>
          </h2>
          <p className="text-xs text-gray-500">Track your total money saved across all PayPilot orders</p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-100 rounded-full">
          SAVINGS HUB
        </span>
      </div>

      {/* AI Savings Synthesis Card */}
      <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-100 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-purple-950">
            <Bot className="w-4.5 h-4.5 text-purple-600" />
            <span>🤖 AI Savings Insight</span>
          </div>
          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
            Live Synthesis
          </span>
        </div>

        <p className="text-xs text-gray-800 leading-relaxed font-medium">
          "You saved <strong className="text-purple-900">₹{totalSavings.toLocaleString('en-IN')}</strong> on PayPilot AI. Your biggest savings came from promotional coupons (<strong className="text-purple-900">₹{couponsSaved.toLocaleString('en-IN')}</strong>) and instant UPI checkout offers (<strong className="text-purple-900">₹{paymentSavings.toLocaleString('en-IN')}</strong>)."
        </p>
      </div>

      {/* Savings Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* Coupons Saved */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
          <div className="flex items-center justify-between text-blue-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Coupons Saved</span>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-base font-black text-blue-950">₹{couponsSaved.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-blue-800 font-medium">FESTIVE15 & PAYPILOT10</div>
        </div>

        {/* Payment Offers */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Payment Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-black text-emerald-950">₹{paymentSavings.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-800 font-medium">Instant UPI Discounts</div>
        </div>

        {/* Wallet Cashback */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Cashback Earned</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-black text-amber-950">₹{cashbackEarned.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-800 font-medium">Credited to Wallet</div>
        </div>

        {/* Net Total Savings */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-purple-200">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Savings</span>
            <Gift className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-black text-white">₹{totalSavings.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-purple-100 font-medium">Lifetime Benefit</div>
        </div>

      </div>

    </div>
  );
};

export default RewardsAndSavingsSection;
