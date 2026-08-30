import React from 'react';
import { Link } from 'react-router-dom';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Eye, Calendar, Package } from 'lucide-react';

export const OrderCard = ({ order }) => {
  if (!order) return null;

  const {
    _id,
    orderNumber,
    createdAt,
    total,
    currency = 'INR',
    orderStatus,
    paymentStatus,
    items = []
  } = order;

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(total);

  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:border-blue-400 transition-all text-xs text-[#212121]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-gray-900 text-base">{orderNumber}</span>
            <OrderStatusBadge status={orderStatus} />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-gray-400" />
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right space-y-1">
          <div className="text-lg font-black text-gray-900">{formattedTotal}</div>
          <OrderStatusBadge status={paymentStatus} type="payment" />
        </div>
      </div>

      {/* Item Thumbnails Preview */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {items.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 p-1"
              title={`${item.productName} (x${item.quantity})`}
            >
              <img
                src={item.productImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80'}
                alt={item.productName}
                className="w-full h-full object-contain rounded"
              />
            </div>
          ))}
          {items.length > 4 && (
            <span className="text-xs font-bold text-gray-400 pl-1">+{items.length - 4} more</span>
          )}
        </div>

        <Link
          to={`/orders/${_id}`}
          className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874F0] text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1 transition-colors flex-shrink-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </Link>
      </div>

    </div>
  );
};

export default OrderCard;
