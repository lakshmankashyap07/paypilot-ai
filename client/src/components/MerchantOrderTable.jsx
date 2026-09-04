import React, { useState } from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ShoppingBag, Search, Eye, CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

const ALLOWED_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['RETURN_REQUESTED', 'REPLACEMENT_REQUESTED'],
  RETURN_REQUESTED: ['RETURN_APPROVED', 'RETURN_REJECTED'],
  RETURN_APPROVED: ['RETURN_PICKUP_SCHEDULED', 'RETURNED'],
  RETURN_PICKUP_SCHEDULED: ['RETURNED'],
  RETURN_REJECTED: [],
  RETURNED: [],
  REPLACEMENT_REQUESTED: ['REPLACEMENT_APPROVED', 'REPLACEMENT_REJECTED'],
  REPLACEMENT_APPROVED: ['SHIPPED', 'REPLACED'],
  REPLACEMENT_REJECTED: [],
  REPLACED: [],
  CANCELLED: []
};

export const MerchantOrderTable = ({
  orders = [],
  isLoading = false,
  onUpdateStatus,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dynamic KPI summary counts from real orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const processingOrders = orders.filter(
    (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PROCESSING'
  ).length;
  const shippedOrders = orders.filter(
    (o) => o.orderStatus === 'SHIPPED' || o.orderStatus === 'OUT_FOR_DELIVERY'
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* 1. SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>All Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalOrders}</div>
          <div className="text-[11px] text-gray-500 font-medium">Total customer orders</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{pendingOrders}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting confirmation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Processing</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{processingOrders}</div>
          <div className="text-[11px] text-indigo-700 font-medium">In preparation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Shipped</span>
            <Truck className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{shippedOrders}</div>
          <div className="text-[11px] text-blue-700 font-medium">In transit to customer</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Delivered</span>
            <PackageCheck className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{deliveredOrders}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Successfully completed</div>
        </div>

      </div>

      {/* 2. ORDER FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search orders by order #, customer name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="RETURN_REQUESTED">Return Requested</option>
            <option value="RETURNED">Returned</option>
            <option value="REPLACEMENT_REQUESTED">Replacement Requested</option>
            <option value="REPLACED">Replaced</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

      </div>

      {/* 3. ORDER TABLE / EMPTY STATE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          
          /* EMPTY STATE CARD */
          <div className="py-12 px-6 text-center space-y-3 max-w-sm mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900">No orders found</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {orders.length === 0
                  ? 'No customer orders have been placed yet.'
                  : 'No orders matched your search or status filter.'}
              </p>
            </div>
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-gray-700">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-3.5">Order</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((o) => {
                  const allowedNext = ALLOWED_TRANSITIONS[o.orderStatus] || [];
                  const formattedTotal = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: o.currency || 'INR',
                    maximumFractionDigits: 0
                  }).format(o.total);

                  const formattedDate = new Date(o.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Order Number */}
                      <td className="p-3.5 font-black text-gray-900">
                        <button
                          onClick={() => onViewDetails && onViewDetails(o)}
                          className="hover:text-[#2874F0] underline underline-offset-2 cursor-pointer"
                        >
                          #{o.orderNumber}
                        </button>
                      </td>

                      {/* Customer */}
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900">
                          {o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                        </div>
                        <div className="text-[10px] text-gray-500">{o.shippingAddress?.city}</div>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-gray-500 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Items */}
                      <td className="p-3.5 text-gray-700 font-medium whitespace-nowrap">
                        {o.items?.length || 1} {o.items?.length === 1 ? 'item' : 'items'}
                      </td>

                      {/* Total */}
                      <td className="p-3.5 font-black text-gray-900 whitespace-nowrap">
                        {formattedTotal}
                      </td>

                      {/* Payment Status */}
                      <td className="p-3.5">
                        <OrderStatusBadge status={o.paymentStatus} type="payment" />
                      </td>

                      {/* Order Status */}
                      <td className="p-3.5">
                        <OrderStatusBadge status={o.orderStatus} />
                      </td>

                      {/* Update Status Dropdown & Action */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {allowedNext.length > 0 ? (
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value && onUpdateStatus) {
                                  onUpdateStatus(o._id, e.target.value);
                                }
                              }}
                              className="bg-gray-50 border border-gray-300 text-[#2874F0] text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#2874F0] cursor-pointer"
                            >
                              <option value="" disabled>
                                Update...
                              </option>
                              {allowedNext.map((st) => (
                                <option key={st} value={st}>
                                  {st.replace(/_/g, ' ')}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 italic">
                              Finalized
                            </span>
                          )}

                          <button
                            onClick={() => onViewDetails && onViewDetails(o)}
                            className="p-1.5 text-gray-500 hover:text-[#2874F0] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Details</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info bar */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span>PayPilot Seller Fulfillment</span>
        </div>
      </div>

    </div>
  );
};

export default MerchantOrderTable;
