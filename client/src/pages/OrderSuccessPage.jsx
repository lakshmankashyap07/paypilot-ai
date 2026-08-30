import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { CheckCircle2, ShoppingBag, Eye, CreditCard, MapPin } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrder(id)
      .then((res) => {
        if (res && res.success && res.data?.order) {
          setOrder(res.data.order);
        }
      })
      .catch((err) => console.warn('Failed to load order details:', err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto"></div>
        <div className="h-6 w-3/4 bg-slate-800 rounded mx-auto"></div>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  const isPaid = order?.paymentStatus === 'CAPTURED' || order?.paymentStatus === 'PAID';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-center">
      
      {/* Checkmark Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-widest">
          Order Created Successfully
        </span>
        <h1 className="text-3xl font-extrabold text-white">Thank You For Your Order!</h1>
        <p className="text-sm text-slate-400">
          Order Reference: <strong className="text-teal-300 font-mono">{order?.orderNumber}</strong>
        </p>
      </div>

      {/* Order Summary Snapshot Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 text-left space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Total Order Amount</span>
            <div className="text-2xl font-extrabold text-white">{formatCurrency(order?.total)}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <OrderStatusBadge status={order?.orderStatus || 'PENDING'} />
            <OrderStatusBadge status={order?.paymentStatus || 'PENDING'} type="payment" />
          </div>
        </div>

        {/* Razorpay Payment CTA Callout */}
        {!isPaid && (
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-teal-300 text-xs uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-teal-400" />
              <span>Razorpay Payment Required</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Payment is currently <strong className="text-amber-300">PENDING</strong>. Click below to pay securely using Razorpay Test Mode.
            </p>
            <Link
              to={`/payment/${order?._id}`}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Securely Now with Razorpay</span>
            </Link>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Items Included ({order?.items?.length || 0})
          </h4>
          {order?.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=100&q=80'}
                  alt={item.productName}
                  className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800"
                />
                <div>
                  <div className="font-bold text-white line-clamp-1">{item.productName}</div>
                  <div className="text-slate-400 text-[11px]">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="font-bold text-white">{formatCurrency(item.subtotal)}</div>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        {order?.shippingAddress && (
          <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              Delivery Destination
            </h4>
            <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p className="text-slate-400">Phone: {order.shippingAddress.phone}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/orders/${order?._id}`}
          className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs inline-flex items-center justify-center gap-2 border border-slate-700"
        >
          <Eye className="w-4 h-4" />
          <span>View Order Details</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-2xl text-xs hover:border-slate-700 inline-flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccessPage;
