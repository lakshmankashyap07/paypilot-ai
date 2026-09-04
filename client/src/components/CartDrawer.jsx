import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

import { getImageUrl } from '../utils/imageUtils';

export const CartDrawer = () => {
  const { cart, cartCount, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart } = useCart();

  if (!isDrawerOpen) return null;

  const items = cart?.items || [];
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: cart?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-[#0b101d] h-full flex flex-col justify-between border-l border-slate-800 shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Your Shopping Cart</h3>
              <p className="text-xs text-slate-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-400">Add products from our marketplace</p>
              </div>
              <Link
                to="/shop"
                onClick={closeDrawer}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold rounded-xl text-xs"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={product._id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={getImageUrl(product.thumbnail || product.images?.[0] || product.imageUrl || product.image)}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                  />

                  <div className="flex-grow min-w-0 space-y-1">
                    <h5 className="font-bold text-white text-xs truncate">{product.name}</h5>
                    <span className="text-[11px] text-teal-400 font-semibold">{product.brand}</span>
                    <div className="text-xs font-extrabold text-slate-100">
                      {formatCurrency(product.price)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est. Tax & Shipping</span>
                <span className="font-medium text-slate-200">
                  {formatCurrency(cart.tax + cart.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-teal-400">{formatCurrency(cart.total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl text-center border border-slate-700 flex items-center justify-center gap-1"
              >
                <span>View Full Cart</span>
              </Link>

              <Link
                to="/cart"
                onClick={closeDrawer}
                className="py-3 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1 shadow-md shadow-teal-500/20"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
