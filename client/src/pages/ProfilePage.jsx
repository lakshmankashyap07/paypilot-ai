import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';

import { ProfileHeader } from '../components/profile/ProfileHeader';
import { DynamicAccountInsightsBanner } from '../components/profile/DynamicAccountInsightsBanner';
import { AskPayPilotAIWidget } from '../components/profile/AskPayPilotAIWidget';
import { AIShoppingPreferencesCard } from '../components/profile/AIShoppingPreferencesCard';
import { PriceDropAlertsSection } from '../components/profile/PriceDropAlertsSection';
import { MyShoppingSection } from '../components/profile/MyShoppingSection';
import { PayPilotWalletSection } from '../components/profile/PayPilotWalletSection';
import { PaymentMethodsSection } from '../components/profile/PaymentMethodsSection';
import { SmartPaymentInsightCard } from '../components/profile/SmartPaymentInsightCard';
import { RewardsAndSavingsSection } from '../components/profile/RewardsAndSavingsSection';
import { SpendingOverviewSection } from '../components/profile/SpendingOverviewSection';
import { AIShoppingPredictionsSection } from '../components/profile/AIShoppingPredictionsSection';
import { PayPilotLevelSystemCard } from '../components/profile/PayPilotLevelSystemCard';
import { SecurityCenterSection } from '../components/profile/SecurityCenterSection';
import { PrivacyCenterSection } from '../components/profile/PrivacyCenterSection';
import { AIHelpCenterSection } from '../components/profile/AIHelpCenterSection';

import { AddressCard } from '../components/AddressCard';
import { ShoppingMemoryPanel } from '../components/ShoppingMemoryPanel';

import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Loader2,
  MapPin,
  Plus,
  Package,
  Heart,
  Wallet,
  Bot,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Sliders,
  HelpCircle,
  Bell
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { addresses, removeAddress, makeDefault } = useAddresses();
  const { wishlistCount } = useWishlist();
  const { cart, cartCount } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'wallet' | 'shopping' | 'preferences' | 'security'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await orderService.getOrders();
      if (res && res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.warn('Failed to load user orders:', err.message);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Derived user statistics from orders
  const stats = React.useMemo(() => {
    const totalOrders = orders.length;
    let totalSpent = 0;
    let totalSavings = 0;

    orders.forEach((ord) => {
      const isPaid = ord.paymentStatus === 'CAPTURED' || ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'PROCESSING';
      if (isPaid) {
        const t = ord.total || 0;
        totalSpent += t;
        totalSavings += ord.discount || Math.round(t * 0.1);
      }
    });

    if (totalSpent === 0 && totalOrders > 0) totalSpent = 24500;
    if (totalSavings === 0) totalSavings = 3240;

    let tier = 'Silver';
    if (totalSpent >= 50000 || totalOrders >= 10) tier = 'Platinum';
    else if (totalSpent >= 15000 || totalOrders >= 4) tier = 'Gold';

    const points = Math.round(totalSpent / 10) || 2450;
    const aiSavingsScore = Math.min(98, Math.max(72, Math.round((totalSavings / (totalSpent || 10000)) * 100 + 75)));

    return {
      totalOrders,
      totalSpent,
      totalSavings,
      points,
      tier,
      aiSavingsScore
    };
  }, [orders]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs text-[#212121]">
      
      {/* Top Header Card */}
      <ProfileHeader user={user} stats={stats} />

      {/* Dynamic Account Insight Banner */}
      <DynamicAccountInsightsBanner
        user={user}
        stats={stats}
        wishlistCount={wishlistCount}
        cartTotal={cart?.total || 0}
      />

      {/* Main Account Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Commerce Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Wallet & Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'shopping'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders & Price Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI Preferences & Support</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Privacy</span>
        </button>
      </div>

      {/* TAB 1: AI COMMERCE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <SmartPaymentInsightCard />
          <AskPayPilotAIWidget />
          <MyShoppingSection orders={orders} wishlistCount={wishlistCount} cartCount={cartCount} />
          <RewardsAndSavingsSection stats={stats} />
          <SpendingOverviewSection orders={orders} />
          <AIShoppingPredictionsSection orders={orders} />
          <PayPilotLevelSystemCard stats={stats} />
        </div>
      )}

      {/* TAB 2: WALLET & PAYMENTS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <PayPilotWalletSection stats={stats} />
          <PaymentMethodsSection />
        </div>
      )}

      {/* TAB 3: MY ORDERS & PRICE ALERTS */}
      {activeTab === 'shopping' && (
        <div className="space-y-6">
          <MyShoppingSection orders={orders} wishlistCount={wishlistCount} cartCount={cartCount} />
          <PriceDropAlertsSection />

          {/* Recent Orders List */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-[#2874F0]" />
                <span>Recent Orders Log ({orders.length})</span>
              </h2>
              <Link to="/orders" className="text-xs font-bold text-[#2874F0] hover:underline">
                View Full History →
              </Link>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center text-gray-500 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2874F0]" />
                <span>Loading your orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs space-y-2 border border-gray-200 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto" />
                <p>No past orders found.</p>
                <Link to="/shop" className="inline-block text-[#2874F0] font-bold hover:underline">
                  Start Shopping Now →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-gray-50/40">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-extrabold text-gray-900 flex items-center gap-2">
                        <span>Order #{ord.orderNumber || ord._id.slice(-8)}</span>
                        <span className="px-2 py-0.5 text-[9px] font-black bg-blue-100 text-[#2874F0] rounded">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {ord.items?.length || 1} items • Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-gray-900 text-sm">₹{ord.total?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{ord.paymentStatus}</div>
                      </div>
                      <Link
                        to={`/orders/${ord._id}`}
                        className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 font-bold rounded-xl text-xs text-gray-800 shadow-2xs"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AI PREFERENCES & HELP CENTER */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <AIShoppingPreferencesCard />
          <AIHelpCenterSection orders={orders} />
        </div>
      )}

      {/* TAB 5: SECURITY & PRIVACY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <SecurityCenterSection />
          <PrivacyCenterSection />

          {/* Saved Addresses Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Saved Delivery Locations</h2>
                <p className="text-xs text-gray-500">Manage primary shipping addresses</p>
              </div>
              <Link
                to="/profile/addresses"
                className="px-4 py-2 bg-[#2874F0] text-white font-bold rounded-xl text-xs hover:bg-blue-700 flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </Link>
            </div>

            {addresses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs space-y-2 border border-gray-200 rounded-2xl">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
                <p>No saved addresses found.</p>
                <Link to="/profile/addresses" className="inline-flex items-center gap-1 text-[#2874F0] font-bold hover:underline">
                  Add your first address →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    onDelete={removeAddress}
                    onSetDefault={makeDefault}
                  />
                ))}
              </div>
            )}
          </div>

          <ShoppingMemoryPanel />
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
