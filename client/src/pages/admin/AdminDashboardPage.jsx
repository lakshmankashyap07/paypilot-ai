import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { showToast } = useToast();

  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => {
        if (res?.success && res.data) {
          setOverview(res.data);
        }
      })
      .catch((e) => showToast(e.message || 'Failed to load admin overview', 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">Dashboard Overview</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Real-time platform metrics, revenue telemetry, and system operational health.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span>Captured Revenue</span>
                <DollarSign className="w-4 h-4 text-[#00875A]" />
              </div>
              <div className="text-2xl font-black text-gray-900">{formatCurrency(overview?.capturedRevenue)}</div>
              <div className="text-[11px] text-[#00875A] font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Verified Payment Volume</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
              </div>
              <div className="text-2xl font-black text-gray-900">{overview?.totalOrders || 0}</div>
              <div className="text-[11px] text-gray-500 font-medium">{overview?.aiAssistedOrdersCount || 0} AI-assisted orders</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span>Payment Success Rate</span>
                <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
              </div>
              <div className="text-2xl font-black text-[#00875A]">{overview?.paymentSuccessRate || 100}%</div>
              <div className="text-[11px] text-gray-500 font-medium">Razorpay HMAC Verified</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span>Active Merchants</span>
                <Store className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">{overview?.totalMerchants || 0}</div>
              <div className="text-[11px] text-gray-500 font-medium">{overview?.totalProducts || 0} products in catalog</div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
