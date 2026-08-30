import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { OrderCard } from '../components/OrderCard';
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders()
      .then((res) => {
        if (res && res.success && res.data?.orders) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => console.warn('Failed to load user orders:', err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#2874F0]" />
            My Orders ({orders.length})
          </h1>
          <p className="text-xs text-gray-500">Track and manage your order history</p>
        </div>

        <Link
          to="/shop"
          className="px-4 py-2 bg-[#2874F0] text-white font-bold rounded-lg text-xs hover:bg-blue-700 inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">No orders placed yet</h3>
            <p className="text-xs text-gray-500">
              When you place orders, they will appear here with live tracking.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2874F0] text-white font-extrabold rounded-xl text-xs shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
