import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import orderService from '../services/orderService';
import { CheckoutAddressSelector } from '../components/CheckoutAddressSelector';
import { CartSummary } from '../components/CartSummary';
import { ShoppingBag, ArrowLeft, MapPin, ShieldCheck, User, CheckCircle2 } from 'lucide-react';

import { getImageUrl } from '../utils/imageUtils';
import { AICheckoutAssistantBanner } from '../components/AICheckoutAssistantBanner';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartCount, clearCart } = useCart();
  const {
    addresses,
    defaultAddress,
    isLoading: isLoadingAddresses,
    addAddress,
    editAddress
  } = useAddresses();
  const { showToast } = useToast();

  const [selectedShippingId, setSelectedShippingId] = useState('');
  const [selectedBillingId, setSelectedBillingId] = useState('');
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Automatically select default or first available address on load
  useEffect(() => {
    if (defaultAddress && !selectedShippingId) {
      setSelectedShippingId(defaultAddress._id);
      setSelectedBillingId(defaultAddress._id);
    } else if (addresses.length > 0 && !selectedShippingId) {
      setSelectedShippingId(addresses[0]._id);
      setSelectedBillingId(addresses[0]._id);
    }
  }, [defaultAddress, addresses, selectedShippingId]);

  const items = cart?.items || [];
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: cart?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);

  const handlePlaceOrder = async () => {
    if (!selectedShippingId) {
      showToast('Please select a delivery address to proceed', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your shopping cart is empty', 'error');
      return;
    }

    try {
      setIsPlacingOrder(true);

      // Validate checkout on backend
      await orderService.validateCheckout(selectedShippingId, selectedBillingId || selectedShippingId);

      // Create Order
      const res = await orderService.createOrder(
        selectedShippingId,
        selectedBillingId || selectedShippingId,
        notes
      );

      if (res && res.success && res.data?.order) {
        const createdOrder = res.data.order;
        await clearCart(); // Clear cart after order creation
        showToast('Order created successfully! Redirecting to secure payment...', 'success');
        navigate(`/payment/${createdOrder._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0 && !isPlacingOrder) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2874F0] text-white font-extrabold rounded-xl text-xs"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Link to="/cart" className="text-gray-500 hover:text-[#2874F0]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-black text-gray-900">Marketplace Checkout</h1>
          </div>
          <p className="text-xs text-gray-500 pl-6">
            Complete your order steps to launch Razorpay Secure Checkout
          </p>
        </div>
      </div>

      {/* AI CHECKOUT ASSISTANT BANNER */}
      <AICheckoutAssistantBanner userBudget={30000} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: 4 Checkout Step Cards */}
        <div className="lg:col-span-2 space-y-4 text-xs text-[#212121]">
          
          {/* STEP 1: Account Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">1</span>
                <span>LOGIN / ACCOUNT</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#008C45]" />
            </div>
            <div className="pl-8 text-gray-700 font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-[#2874F0]" />
              <span>Logged in as <strong>{user?.name}</strong> ({user?.email})</span>
            </div>
          </div>

          {/* STEP 2: Delivery Address Selector Card */}
          <div className="bg-white p-5 rounded-xl border-2 border-[#2874F0] shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">2</span>
              <MapPin className="w-4 h-4 text-[#2874F0]" />
              <span>DELIVERY ADDRESS</span>
            </div>

            {isLoadingAddresses ? (
              <div className="h-28 rounded-lg bg-gray-100 animate-pulse"></div>
            ) : (
              <CheckoutAddressSelector
                addresses={addresses}
                selectedAddressId={selectedShippingId}
                onSelectAddress={setSelectedShippingId}
                onAddAddress={addAddress}
                onEditAddress={editAddress}
              />
            )}
          </div>

          {/* STEP 3: Order Items Summary */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">3</span>
                <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
                <span>ORDER SUMMARY ({cartCount} Items)</span>
              </div>
              <Link to="/cart" className="text-xs text-[#2874F0] font-bold hover:underline">
                Change Cart
              </Link>
            </div>

            <div className="space-y-2">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div
                    key={product._id}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getImageUrl(product.thumbnail || product.images?.[0] || product.imageUrl || product.image)}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200 p-0.5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 text-xs truncate">{product.name}</div>
                        <div className="text-[10px] text-gray-500">Qty: {item.quantity} × {formatCurrency(product.price)}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 font-black text-gray-900 text-xs">
                      {formatCurrency(product.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Special Instructions & Notes */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">4</span>
              <span>DELIVERY NOTES (OPTIONAL)</span>
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call before delivery, drop with security desk..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
            />
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <CartSummary
            subtotal={cart.subtotal}
            discount={cart.discount}
            tax={cart.tax}
            shipping={cart.shipping}
            total={cart.total}
            currency={cart.currency}
            itemCount={cartCount}
            onCheckout={handlePlaceOrder}
            checkoutButtonText={isPlacingOrder ? 'CREATING ORDER...' : 'PROCEED TO PAYMENT'}
            isCheckoutDisabled={isPlacingOrder || !selectedShippingId}
          />

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#2874F0] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-[#008C45]" />
              <span>Razorpay Sandbox Security</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Order confirmation launches official Razorpay Modal for instant payment verification.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
