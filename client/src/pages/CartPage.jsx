import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { CartSummary } from '../components/CartSummary';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft
} from 'lucide-react';

import { getImageUrl } from '../utils/imageUtils';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();

  const items = cart?.items || [];
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: cart?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);

  const handleCheckoutClick = () => {
    if (items.length === 0) {
      showToast('Your shopping cart is empty', 'error');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#2874F0]" />
            My Cart ({cartCount})
          </h1>
          <p className="text-xs text-gray-500">
            Review items in your cart before proceeding to payment
          </p>
        </div>

        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="px-3 py-1.5 bg-white border border-gray-300 text-[#D32F2F] text-xs font-bold rounded-lg hover:bg-rose-50"
            >
              Clear Cart
            </button>
          )}

          <Link
            to="/shop"
            className="px-3.5 py-1.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg text-xs hover:bg-gray-50 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      {items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Your cart is empty!</h3>
            <p className="text-xs text-gray-500">
              Explore our wide range of products and add items to your cart.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2874F0] text-white font-extrabold rounded-xl text-xs shadow-md"
          >
            <span>Shop Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div
                    key={product._id}
                    className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={getImageUrl(product.thumbnail || product.images?.[0] || product.imageUrl || product.image)}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 flex-shrink-0"
                      />

                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <Link
                          to={`/product/${product.slug || product._id}`}
                          className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-[#2874F0] transition-colors block"
                        >
                          {product.name}
                        </Link>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>
                            Stock: <strong className="text-emerald-700">{product.stock} available</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Quantity Controls */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:text-black"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          disabled={item.quantity >= product.stock}
                          className="p-1 text-gray-600 hover:text-black disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price total */}
                      <div className="text-right">
                        <div className="text-base font-black text-gray-900">
                          {formatCurrency(product.price * item.quantity)}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium">
                          {formatCurrency(product.price)} each
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="p-1.5 text-gray-400 hover:text-[#D32F2F] transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary Side Column */}
          <div className="lg:col-span-1 sticky top-24">
            <CartSummary
              subtotal={cart.subtotal}
              discount={cart.discount}
              tax={cart.tax}
              shipping={cart.shipping}
              total={cart.total}
              currency={cart.currency}
              itemCount={cartCount}
              onCheckout={handleCheckoutClick}
              checkoutButtonText="PROCEED TO CHECKOUT"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
