import React from 'react';
import { Award, Zap, CheckCircle2, ShieldCheck, Crown } from 'lucide-react';

export const PayPilotLevelSystemCard = ({ stats }) => {
  const points = stats?.points || 2450;
  const tier = stats?.tier || 'Gold';

  const nextTierPoints = 3000;
  const pointsNeeded = Math.max(0, nextTierPoints - points);
  const progressPercent = Math.min(100, Math.round((points / nextTierPoints) * 100));

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-5 text-xs text-gray-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>PayPilot VIP Membership Levels</span>
          </h2>
          <p className="text-xs text-gray-500">Earn points on every checkout to unlock premium VIP perks</p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
          VIP TIER SYSTEM
        </span>
      </div>

      {/* Level Progress Visual */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <div className="font-extrabold text-sm text-amber-950">PayPilot {tier} Level</div>
              <div className="text-[11px] text-amber-800 font-bold">⚡ {points.toLocaleString('en-IN')} Earned Points</div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Next Tier</span>
            <div className="font-black text-amber-950 text-xs">Platinum (3,000 pts)</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-amber-200/60 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-amber-900 font-bold">
            <span>{pointsNeeded > 0 ? `${pointsNeeded} points until Platinum` : 'Platinum Unlocked!'}</span>
            <span>{progressPercent}% Complete</span>
          </div>
        </div>
      </div>

      {/* Tier Benefits Grid */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-black text-gray-900 uppercase tracking-wider block">
          Your Unlocked PayPilot {tier} Benefits
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            '✓ Extra 5% Instant Cashback on UPI Checkouts',
            '✓ AI Shopping Assistant & Deal Optimizer',
            '✓ Priority Customer Support & Returns',
            '✓ Exclusive Early Access to Festive Sales'
          ].map((b, idx) => (
            <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PayPilotLevelSystemCard;
