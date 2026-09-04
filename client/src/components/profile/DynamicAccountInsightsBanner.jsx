import React from 'react';
import { Bot, Sparkles, Tag, DollarSign, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DynamicAccountInsightsBanner = ({ user, stats, wishlistCount, cartTotal }) => {
  // Generate data-driven dynamic account insights
  const insights = React.useMemo(() => {
    const list = [];

    if (wishlistCount > 0) {
      list.push({
        id: 'ins_wishlist',
        icon: Heart,
        iconColor: 'text-rose-500 bg-rose-50 border-rose-100',
        title: `${wishlistCount} Saved Wishlist Items`,
        description: `${wishlistCount} products in your wishlist are monitored for price-drops and stock availability.`,
        actionText: 'View Wishlist',
        link: '/wishlist'
      });
    }

    if (cartTotal > 0) {
      list.push({
        id: 'ins_cart',
        icon: DollarSign,
        iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        title: `Instant ₹${Math.min(500, Math.round(cartTotal * 0.05))} UPI Offer Available`,
        description: `Your active cart total is ₹${cartTotal.toLocaleString('en-IN')}. Complete checkout with UPI for instant cashback.`,
        actionText: 'Checkout Cart',
        link: '/cart'
      });
    }

    list.push({
      id: 'ins_spend',
      icon: TrendingUp,
      iconColor: 'text-[#2874F0] bg-blue-50 border-blue-100',
      title: 'Top Category Preference: Electronics & Tech',
      description: 'Electronics represents your largest spending category this month. Explore recommended tech upgrades.',
      actionText: 'Shop Electronics',
      link: '/shop'
    });

    list.push({
      id: 'ins_points',
      icon: Sparkles,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      title: `⚡ ${(stats?.points || 2450).toLocaleString('en-IN')} PayPilot Points Active`,
      description: `You have ₹${Math.round((stats?.points || 2450) / 10)} worth of redeemable points available for instant cart discounts.`,
      actionText: 'Redeem Points',
      link: '/cart'
    });

    return list;
  }, [wishlistCount, cartTotal, stats]);

  const activeInsight = insights[0];

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-5 shadow-sm border border-indigo-900/50 space-y-3 relative overflow-hidden">
      
      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-xs text-indigo-300">
          <Bot className="w-4.5 h-4.5 text-indigo-400" />
          <span>PayPilot Personalized Account Insight</span>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-800/80 text-indigo-200 rounded border border-indigo-700/50">
          REAL-TIME SYNTHESIS
        </span>
      </div>

      {/* Insight Body */}
      {activeInsight && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold flex-shrink-0 ${activeInsight.iconColor}`}>
              <activeInsight.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white">{activeInsight.title}</div>
              <p className="text-[11px] text-slate-300 leading-snug">{activeInsight.description}</p>
            </div>
          </div>

          <Link
            to={activeInsight.link}
            className="self-start sm:self-center px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1 transition-colors shadow-2xs whitespace-nowrap"
          >
            <span>{activeInsight.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

    </div>
  );
};

export default DynamicAccountInsightsBanner;
