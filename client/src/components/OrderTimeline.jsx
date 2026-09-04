import React from 'react';
import {
  Check,
  Clock,
  Package,
  Truck,
  MapPin,
  CheckCheck,
  XCircle
} from 'lucide-react';

import { RotateCcw, RefreshCw, AlertCircle } from 'lucide-react';

export const OrderTimeline = ({ orderStatus }) => {
  if (orderStatus === 'CANCELLED') {
    return (
      <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-1.5 text-xs text-[#212121]">
        <XCircle className="w-8 h-8 text-[#D32F2F] mx-auto" />
        <h4 className="font-extrabold text-[#D32F2F] text-sm">Order Cancelled</h4>
        <p className="text-xs text-gray-600">
          This order was cancelled and product inventory has been restored.
        </p>
      </div>
    );
  }

  // Return & Replacement Special Status Banners
  if (orderStatus?.startsWith('RETURN') || orderStatus?.startsWith('REPLACEMENT')) {
    const isReturn = orderStatus.startsWith('RETURN');
    const title = isReturn ? 'Return Lifecycle Progress' : 'Replacement Lifecycle Progress';
    const Icon = isReturn ? RotateCcw : RefreshCw;

    const returnSteps = [
      { key: 'REQUESTED', label: isReturn ? 'Return Requested' : 'Replacement Requested' },
      { key: 'APPROVED', label: isReturn ? 'Return Approved' : 'Approved' },
      { key: 'FULFILLED', label: isReturn ? 'Item Returned' : 'Replaced' }
    ];

    let stepIndex = 0;
    if (orderStatus.includes('APPROVED') || orderStatus.includes('SCHEDULED')) stepIndex = 1;
    if (orderStatus === 'RETURNED' || orderStatus === 'REPLACED') stepIndex = 2;
    if (orderStatus.includes('REJECTED')) stepIndex = -1;

    return (
      <div className="p-5 rounded-xl bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border border-purple-200 space-y-3 text-xs text-[#212121]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm">{title}</h4>
              <p className="text-[11px] text-gray-600">Current Status: <strong className="text-purple-700">{orderStatus.replace(/_/g, ' ')}</strong></p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-black bg-purple-600 text-white rounded-full">
            BUYER PROTECTION
          </span>
        </div>

        {/* Step Progress */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {returnSteps.map((st, idx) => {
            const isDone = idx <= stepIndex;
            return (
              <div
                key={st.key}
                className={`p-2.5 rounded-lg border text-center font-bold text-[11px] transition-all ${
                  isDone
                    ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {st.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: Check },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCheck }
  ];

  const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentIndex = statusOrder.indexOf(orderStatus);

  return (
    <div className="space-y-3 text-xs text-[#212121]">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          ORDER STATUS TIMELINE
        </h4>
        <span className="text-[11px] font-bold text-gray-500">
          {currentIndex >= 3 ? 'In Transit' : 'Processing Order'}
        </span>
      </div>

      {/* Responsive Step Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center gap-1.5 ${
                isCurrent
                  ? 'bg-blue-50 border-2 border-[#2874F0] text-[#2874F0] font-black shadow-xs'
                  : isDone
                  ? 'bg-emerald-50/60 border border-emerald-200 text-[#008C45]'
                  : 'bg-gray-50 border border-gray-200 text-gray-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isCurrent
                    ? 'bg-[#2874F0] text-white shadow-xs'
                    : isDone
                    ? 'bg-[#008C45] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-[11px] font-bold leading-tight">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Shipment & Tracking Subtext */}
      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
        <span>
          {currentIndex >= 3
            ? 'Package is with our delivery partner'
            : 'Tracking will be available once the order is shipped.'}
        </span>
        <span>
          {currentIndex === 5 ? 'Delivered successfully' : 'Delivery estimate will appear after shipment.'}
        </span>
      </div>
    </div>
  );
};

export default OrderTimeline;
