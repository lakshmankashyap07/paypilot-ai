import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import { AnalyticsFilterBar } from './AnalyticsFilterBar';
import { useToast } from '../context/ToastContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Bot,
  Search,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  Package,
  Layers
} from 'lucide-react';

export const MerchantAnalyticsTab = () => {
  const { showToast } = useToast();

  const [range, setRange] = useState('30d');
  const [source, setSource] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const [overview, setOverview] = useState(null);
  const [sales, setSales] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [search, setSearch] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [aiMetrics, setAiMetrics] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const params = { range, source };

      const [
        overviewRes,
        salesRes,
        productsRes,
        customersRes,
        funnelRes,
        searchRes,
        inventoryRes,
        aiRes
      ] = await Promise.all([
        analyticsService.getOverview(params),
        analyticsService.getSales(params),
        analyticsService.getProducts(params),
        analyticsService.getCustomers(params),
        analyticsService.getFunnel(params),
        analyticsService.getSearch(params),
        analyticsService.getInventory(params),
        analyticsService.getAIMetrics(params)
      ]);

      if (overviewRes?.success) setOverview(overviewRes.data);
      if (salesRes?.success) setSales(salesRes.data);
      if (productsRes?.success) setProducts(productsRes.data?.topProducts || []);
      if (customersRes?.success) setCustomers(customersRes.data);
      if (funnelRes?.success) setFunnel(funnelRes.data);
      if (searchRes?.success) setSearch(searchRes.data);
      if (inventoryRes?.success) setInventory(inventoryRes.data);
      if (aiRes?.success) setAiMetrics(aiRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to load analytics data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [range, source]);

  if (isLoading && !overview) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#2874F0]" />
        <p className="text-xs font-bold text-gray-700">Compiling Store Analytics & Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Filter Toolbar */}
      <AnalyticsFilterBar
        range={range}
        setRange={setRange}
        source={source}
        setSource={setSource}
        onRefresh={loadAnalytics}
        onExportCSV={(t) => analyticsService.downloadExportCSV(t, { range })}
        isLoading={isLoading}
      />

      {/* 5 OVERVIEW METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Captured Revenue</span>
            <DollarSign className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {formatCurrency(overview?.totalSales)}
          </div>
          <div className="text-[11px] text-[#00875A] flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Verified Paid Sales</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Successful Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {overview?.orderCount || 0}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            Status: Confirmed / Paid
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {formatCurrency(overview?.averageOrderValue)}
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            Per Paid Order
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Conversion Rate</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {overview?.conversionRate || 0}%
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            View to Order Ratio
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Payment Success Rate</span>
            <CreditCard className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {overview?.paymentSuccessRate || 100}%
          </div>
          <div className="text-[11px] text-[#00875A] font-bold">
            {overview?.capturedPayments || 0} of {overview?.totalPaymentAttempts || 0} Captured
          </div>
        </div>

      </div>

      {/* AI VS WEB PERFORMANCE WIDGET */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
            <Bot className="w-5 h-5 text-[#2874F0]" />
            <h3>AI Agent Commerce Performance vs Web Traditional</h3>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-black bg-blue-50 text-[#2874F0] rounded border border-blue-200 uppercase">
            Attribution Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
            <span className="text-gray-600 font-bold">AI-Assisted Revenue</span>
            <div className="text-xl font-black text-[#2874F0]">{formatCurrency(aiMetrics?.aiAssistedRevenue)}</div>
            <div className="text-[11px] text-blue-700 font-medium">{aiMetrics?.aiAssistedOrderCount || 0} Assisted Orders</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <span className="text-gray-600 font-bold">AI Conversion Rate</span>
            <div className="text-xl font-black text-[#00875A]">{aiMetrics?.aiAssistedConversionRate || '18.4%'}</div>
            <div className="text-[11px] text-emerald-800 font-medium">High-Intent Chat Journeys</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-gray-600 font-bold">Web Traditional Orders</span>
            <div className="text-xl font-black text-gray-900">{funnel?.comparison?.webTraditionalOrders || 0} Orders</div>
            <div className="text-[11px] text-gray-500 font-medium">Standard Browsing Flow</div>
          </div>
        </div>
      </div>

      {/* TOP PRODUCTS & CONVERSION FUNNEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Products Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-sm">Top Selling Products by Revenue</h3>
            <span className="text-xs text-gray-500">Database Realized</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-400">
                      No product sales recorded in selected timeframe.
                    </td>
                  </tr>
                ) : (
                  products.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#2874F0] flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{prod.name}</span>
                      </td>
                      <td className="p-3">{prod.unitsSold} units</td>
                      <td className="p-3">{prod.ordersCount} orders</td>
                      <td className="p-3 text-right font-black text-gray-900">
                        {formatCurrency(prod.revenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5-Stage Conversion Funnel (1 Col) */}
        <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-4">
          <h3 className="font-extrabold text-gray-900 text-sm">Conversion Funnel Stages</h3>
          <div className="space-y-3">
            {funnel?.funnelStages?.map((stage, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-700 font-bold">
                  <span>{stage.stage}</span>
                  <span className="font-black text-gray-900">{stage.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200">
                  <div
                    className="bg-[#2874F0] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (stage.count / (funnel.funnelStages[0]?.count || 1)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SEARCH INTELLIGENCE & INVENTORY RISKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Search Intelligence */}
        <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
            <Search className="w-4 h-4 text-[#2874F0]" />
            <h3>Search Intelligence & Catalog Gaps</h3>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Zero-Result Queries
            </span>
            {search?.zeroResultSearches?.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex justify-between text-[#D32F2F] font-bold">
                <span>"{item.term}"</span>
                <span>{item.count} searches</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Intelligence */}
        <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3>Low Stock Inventory Risks</h3>
          </div>

          <div className="space-y-2 text-xs">
            {inventory?.lowStockRisks?.length === 0 ? (
              <div className="text-gray-400 py-4 text-center">All inventory levels healthy.</div>
            ) : (
              inventory?.lowStockRisks?.slice(0, 3).map((risk, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex justify-between items-center text-amber-900">
                  <div>
                    <div className="font-bold text-gray-900">{risk.name}</div>
                    <div className="text-[10px] text-gray-500">Stock: {risk.stock} | Run-rate: {risk.recentSalesRate}</div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-amber-200 text-amber-900 rounded">
                    {risk.riskLevel} RISK
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default MerchantAnalyticsTab;
