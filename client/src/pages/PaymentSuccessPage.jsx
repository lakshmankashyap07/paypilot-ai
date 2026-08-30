import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, Package, ShoppingBag, ShieldCheck } from 'lucide-react';

export const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  useEffect(() => {
    if (orderId) {
      api.get(`/orders/${orderId}`)
        .then((res) => {
          if (res && res.success && res.data?.order) {
            setOrder(res.data.order);
          }
        })
        .catch((err) => console.warn('Failed to load order details:', err.message));
    }
  }, [orderId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6 text-xs text-[#212121]">
      
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008C45] border border-emerald-300 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-[#008C45] border border-emerald-200 uppercase tracking-widest">
          Payment Successful
        </span>
        <h1 className="text-2xl font-black text-gray-900">Payment Captured!</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          Your payment has been verified by the server. Order reference <strong className="text-gray-900">{order?.orderNumber || orderId}</strong> has been confirmed.
        </p>
      </div>

      {/* Payment Receipt Card */}
      {order && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 text-left text-xs shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold text-gray-900">
            <span>Payment Summary</span>
            <span className="text-[#008C45] font-extrabold text-[11px]">STATUS: CAPTURED</span>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Order Number</span>
              <span className="font-bold text-gray-900">{order.orderNumber}</span>
            </div>
            {order.payment?.paymentNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Reference</span>
                <span className="font-bold text-gray-900">{order.payment.paymentNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="font-black text-gray-900 text-sm">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Date & Time</span>
              <span className="font-semibold">{new Date(order.paidAt || order.updatedAt).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/orders/${orderId}`}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
        >
          <Package className="w-4 h-4" />
          <span>View Order Details</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl border border-gray-300 text-xs flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
};

export default PaymentSuccessPage;
