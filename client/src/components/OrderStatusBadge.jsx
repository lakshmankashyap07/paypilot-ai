import React from 'react';
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  CheckCheck,
  XCircle,
  CreditCard,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

export const OrderStatusBadge = ({ status, type = 'order' }) => {
  if (type === 'payment') {
    const isPaid = status === 'PAID' || status === 'CAPTURED';
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
          isPaid
            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            : 'bg-amber-100 text-amber-900 border border-amber-300'
        }`}
      >
        <CreditCard className="w-3 h-3" />
        <span>{status || 'PENDING'}</span>
      </span>
    );
  }

  const getStatusConfig = (st) => {
    switch (st) {
      case 'PENDING':
        return {
          label: 'Pending',
          icon: Clock,
          color: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          icon: CheckCircle2,
          color: 'bg-blue-100 text-blue-900 border-blue-300'
        };
      case 'PROCESSING':
        return {
          label: 'Processing',
          icon: Package,
          color: 'bg-indigo-100 text-indigo-900 border-indigo-300'
        };
      case 'SHIPPED':
        return {
          label: 'Shipped',
          icon: Truck,
          color: 'bg-purple-100 text-purple-900 border-purple-300'
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: 'Out for Delivery',
          icon: MapPin,
          color: 'bg-teal-100 text-teal-900 border-teal-300'
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          icon: CheckCheck,
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          color: 'bg-rose-100 text-rose-900 border-rose-300'
        };
      case 'RETURN_REQUESTED':
        return {
          label: 'Return Requested',
          icon: RotateCcw,
          color: 'bg-rose-100 text-rose-900 border-rose-300'
        };
      case 'RETURN_APPROVED':
        return {
          label: 'Return Approved',
          icon: CheckCircle2,
          color: 'bg-indigo-100 text-indigo-900 border-indigo-300'
        };
      case 'RETURN_REJECTED':
        return {
          label: 'Return Rejected',
          icon: XCircle,
          color: 'bg-red-100 text-red-900 border-red-300'
        };
      case 'RETURN_PICKUP_SCHEDULED':
        return {
          label: 'Pickup Scheduled',
          icon: Truck,
          color: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'RETURNED':
        return {
          label: 'Returned',
          icon: RotateCcw,
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'REPLACEMENT_REQUESTED':
        return {
          label: 'Replacement Requested',
          icon: RefreshCw,
          color: 'bg-purple-100 text-purple-900 border-purple-300'
        };
      case 'REPLACEMENT_APPROVED':
        return {
          label: 'Replacement Approved',
          icon: CheckCircle2,
          color: 'bg-blue-100 text-blue-900 border-blue-300'
        };
      case 'REPLACEMENT_REJECTED':
        return {
          label: 'Replacement Rejected',
          icon: XCircle,
          color: 'bg-red-100 text-red-900 border-red-300'
        };
      case 'REPLACED':
        return {
          label: 'Replacement Completed',
          icon: CheckCheck,
          color: 'bg-teal-100 text-teal-900 border-teal-300'
        };
      default:
        return {
          label: st,
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider border ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
