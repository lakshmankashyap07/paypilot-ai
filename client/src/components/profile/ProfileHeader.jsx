import React from 'react';
import { Award, Zap, DollarSign, Package, Bot, ShieldCheck, Mail, Phone, User as UserIcon } from 'lucide-react';

export const ProfileHeader = ({ user, stats }) => {
  const {
    totalOrders = 0,
    totalSpent = 0,
    totalSavings = 0,
    points = 0,
    tier = 'Gold',
    aiSavingsScore = 87
  } = stats || {};

  const getTierColor = (t) => {
    switch (t?.toUpperCase()) {
      case 'PLATINUM':
        return 'from-[#7928CA] to-[#FF0080] text-white border-purple-300';
      case 'GOLD':
        return 'from-[#F59E0B] to-[#D97706] text-white border-amber-300';
      default:
        return 'from-[#2874F0] to-[#1E56A0] text-white border-blue-300';
    }
  };

  const getTierBadge = (t) => {
    switch (t?.toUpperCase()) {
      case 'PLATINUM':
        return '👑 PayPilot Platinum Member';
      case 'GOLD':
        return '⚡ PayPilot Gold Member';
      default:
        return '🛡️ PayPilot Silver Member';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Top Banner & User Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-6 border-b border-gray-100">
        
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2874F0] to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900">{user?.name || 'Valued Member'}</h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r ${getTierColor(tier)} shadow-2xs`}>
                {getTierBadge(tier)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap font-medium">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Savings Score Pill */}
        <div className="w-full md:w-auto bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border border-indigo-100 p-3.5 rounded-2xl flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black text-indigo-950 tracking-wider">AI Savings Score</div>
              <div className="text-xs text-gray-600 font-medium">Optimized by PayPilot Intelligence</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-indigo-600">{aiSavingsScore}</span>
            <span className="text-xs font-bold text-gray-400">/100</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Tier Stats */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Membership</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-black text-amber-950">PayPilot {tier}</div>
          <div className="text-[10px] text-amber-800 font-medium">Auto-renewed</div>
        </div>

        {/* PayPilot Points */}
        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1">
          <div className="flex items-center justify-between text-purple-900">
            <span className="text-[10px] font-black uppercase tracking-wider">PayPilot Points</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-black text-purple-950">⚡ {points.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-purple-800 font-medium">≈ ₹{Math.round(points / 10).toLocaleString('en-IN')} Redeemable</div>
        </div>

        {/* Total Savings */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-black text-emerald-950">💰 ₹{totalSavings.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-800 font-medium">Coupons & Payment Offers</div>
        </div>

        {/* Total Orders */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
          <div className="flex items-center justify-between text-blue-900">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-base font-black text-blue-950">📦 {totalOrders} Orders</div>
          <div className="text-[10px] text-blue-800 font-medium">₹{totalSpent.toLocaleString('en-IN')} Lifetime Spent</div>
        </div>

      </div>
    </div>
  );
};

export default ProfileHeader;
