import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, CheckCircle2, Clock, Truck, PackageCheck, Search, DollarSign } from 'lucide-react';
import { OrderStatusBadge } from '../../components/OrderStatusBadge';

export const AdminOrdersPage = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  useEffect(() => {
    adminService.getOrders()
      .then((res) => {
        if (res?.success && res.data?.orders) {
          setOrders(res.data.orders);
        }
      })
      .catch((e) => showToast(e.message || 'Failed to load global orders', 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPayment = paymentStatusFilter === 'ALL' || o.paymentStatus?.toUpperCase() === paymentStatusFilter;
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus?.toUpperCase() === orderStatusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.orderStatus === 'PENDING').length;
  const processingCount = orders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PROCESSING').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'CAPTURED' ? (o.total || 0) : 0), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">Order Management</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Monitor platform-wide customer orders, Razorpay payment status, and fulfillment execution.
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">All platform orders</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting confirmation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Processing</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{processingCount}</div>
          <div className="text-[11px] text-indigo-700 font-medium">In preparation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Delivered</span>
            <PackageCheck className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{deliveredCount}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Successfully completed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Gross GOV</span>
            <DollarSign className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{formatCurrency(totalRevenue)}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Captured revenue</div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by order #, customer name, email..."
            className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="CAPTURED">Captured</option>
            <option value="CREATED">Created</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No orders found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 font-black text-gray-900">
                      #{o.orderNumber}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-gray-900">{o.user?.name || 'Customer'}</div>
                      <div className="text-[10px] text-gray-500">{o.user?.email}</div>
                    </td>

                    <td className="p-3.5 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>

                    <td className="p-3.5 font-black text-gray-900">₹{o.total?.toLocaleString('en-IN')}</td>

                    <td className="p-3.5">
                      <OrderStatusBadge status={o.paymentStatus} type="payment" />
                    </td>

                    <td className="p-3.5">
                      <OrderStatusBadge status={o.orderStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing {filteredOrders.length} global orders</span>
          <span>PayPilot Fulfillment Telemetry</span>
        </div>
      </div>

    </div>
  );
};

export default AdminOrdersPage;
