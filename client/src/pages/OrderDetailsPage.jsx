import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrderTimeline } from '../components/OrderTimeline';
import {
  ArrowLeft,
  Package,
  MapPin,
  Trash2,
  Calendar,
  CreditCard,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchOrderDetails = () => {
    setIsLoading(true);
    setIsError(false);
    orderService
      .getOrder(id)
      .then((res) => {
        if (res && res.success && res.data?.order) {
          setOrder(res.data.order);
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.warn('Failed to load order:', err.message);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  const handleCopyOrderId = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      showToast('Order ID copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCancelOrderConfirm = async () => {
    if (!order) return;

    try {
      setIsCancelling(true);
      setShowCancelModal(false);
      const res = await orderService.cancelOrder(order._id);
      if (res && res.success && res.data?.order) {
        setOrder(res.data.order);
        showToast('Order cancelled successfully. Inventory restored.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel order', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleBuyAgain = async () => {
    if (!order?.items) return;
    try {
      for (const item of order.items) {
        if (item.product || item.productId) {
          await addToCart(item.product || item.productId, item.quantity);
        }
      }
      showToast('Items added to cart!', 'success');
      navigate('/cart');
    } catch (err) {
      showToast(err.message || 'Failed to add items to cart', 'error');
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
        <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
          <div className="lg:col-span-1 h-64 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Not Found / Error State
  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm text-center space-y-4 text-xs text-[#212121]">
        <AlertCircle className="w-12 h-12 text-[#D32F2F] mx-auto" />
        <h2 className="text-xl font-black text-gray-900">Unable to Load Order</h2>
        <p className="text-xs text-gray-500">The requested order details could not be found or fetched.</p>
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={fetchOrderDetails}
            className="px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-lg text-xs hover:bg-gray-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link
            to="/orders"
            className="px-4 py-2 bg-[#2874F0] text-white font-extrabold rounded-lg text-xs hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const {
    orderNumber,
    createdAt,
    orderStatus,
    paymentStatus,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    items = [],
    shippingAddress,
    payment,
    notes
  } = order;

  const canCancel = orderStatus === 'PENDING' || orderStatus === 'CONFIRMED';
  const isDelivered = orderStatus === 'DELIVERED';
  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs text-[#212121]">
      
      {/* 1. TOP ORDER HEADER CARD */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Link to="/orders" className="text-[#2874F0] font-bold text-xs hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-gray-900">Order #{orderNumber}</h1>
            <button
              onClick={handleCopyOrderId}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-[11px] flex items-center gap-1 transition-all"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3 h-3 text-[#008C45]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <OrderStatusBadge status={orderStatus} />
          <OrderStatusBadge status={paymentStatus} type="payment" />
        </div>
      </div>

      {/* 2. ORDER STATUS TIMELINE */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <OrderTimeline orderStatus={orderStatus} />
      </div>

      {/* 3. MAIN CONTENT 2-COLUMN GRID (DESKTOP) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Order Items & Shipping Address */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
                <Package className="w-4 h-4 text-[#2874F0]" />
                <span>ORDER ITEMS ({items.length})</span>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const prodId = item.product?._id || item.product || item.productId;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=150&q=80'}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-contain bg-white border border-gray-200 p-1 flex-shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-bold text-gray-900 text-xs truncate">{item.productName}</h4>
                        <div className="text-xs text-gray-500 font-medium">
                          Quantity: <strong className="text-gray-900">{item.quantity}</strong> × {formatCurrency(item.price)}
                        </div>
                        {prodId && (
                          <Link
                            to={`/product/${prodId}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2874F0] hover:underline"
                          >
                            <span>View Product Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="text-right font-black text-gray-900 text-sm self-end sm:self-center">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-black text-gray-900 text-sm pb-2 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-[#2874F0]" />
              <span>DELIVERY ADDRESS</span>
            </div>

            {shippingAddress && (
              <div className="text-xs text-gray-700 leading-relaxed space-y-1">
                <p className="font-bold text-gray-900 text-sm">{shippingAddress.fullName}</p>
                <p className="text-gray-600">{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p className="text-gray-600">{shippingAddress.addressLine2}</p>}
                <p className="font-bold text-gray-800">
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
                </p>
                <p className="text-gray-500">{shippingAddress.country || 'India'}</p>
                <p className="text-gray-500 font-medium pt-1">Phone: {shippingAddress.phone}</p>
              </div>
            )}

            {notes && (
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                <strong className="text-gray-800">Delivery Notes:</strong> {notes}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Price Details, Payment Info, & Order Actions */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          
          {/* Price Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider pb-2 border-b border-gray-100">
              PRICE DETAILS
            </h3>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>Price ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#008C45] font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-bold text-[#008C45]">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>

              <div className="flex justify-between font-black text-gray-900 text-sm pt-3 border-t border-gray-200 border-dashed">
                <span>Total Amount</span>
                <span className="text-base text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-black text-gray-900 text-xs uppercase tracking-wider pb-2 border-b border-gray-100">
              <CreditCard className="w-4 h-4 text-[#2874F0]" />
              <span>PAYMENT INFORMATION</span>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Payment Status</span>
                <span className="font-black text-[#008C45] uppercase text-[10px] px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                  {paymentStatus}
                </span>
              </div>

              {payment?.paymentNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Payment Reference</span>
                  <span className="font-mono font-bold text-gray-900">{payment.paymentNumber}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Payment Provider</span>
                <span className="font-bold text-gray-900">Razorpay Secured</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="font-black text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Order Actions Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider pb-2 border-b border-gray-100">
              ORDER ACTIONS
            </h3>

            <div className="space-y-2">
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={isCancelling}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-[#D32F2F] font-extrabold rounded-xl text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isCancelling ? 'Cancelling...' : 'Cancel Order'}</span>
                </button>
              )}

              {isDelivered && (
                <button
                  onClick={handleBuyAgain}
                  className="w-full py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Items Again</span>
                </button>
              )}

              <Link
                to="/shop"
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xl relative text-xs text-[#212121]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#D32F2F] font-bold text-sm">
                <Trash2 className="w-5 h-5" />
                <span>Confirm Order Cancellation</span>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to cancel order <strong>#{orderNumber}</strong>? Reserved product inventory will be restored to the merchant catalog immediately.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-xs cursor-pointer"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={handleCancelOrderConfirm}
                disabled={isCancelling}
                className="px-4 py-2 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold rounded-lg text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderDetailsPage;
