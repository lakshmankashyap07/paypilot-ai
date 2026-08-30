import React from 'react';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AICartContextPanel = ({ candidateProducts = [] }) => {
  const { cart, cartCount } = useCart();
  const items = cart?.items || [];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: cart?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 flex flex-col h-full overflow-y-auto text-xs text-[#212121] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
          <h3 className="font-black text-gray-900 text-xs">Shopping Context</h3>
        </div>
        <span className="text-[10px] font-black bg-blue-50 text-[#2874F0] px-2 py-0.5 rounded border border-blue-200">
          CART ({cartCount})
        </span>
      </div>

      {/* Cart Items List */}
      <div className="space-y-2 flex-1 min-h-[100px]">
        {items.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs space-y-1">
            <p className="font-bold text-gray-700">Your cart is empty</p>
            <p className="text-[11px] text-gray-500">Ask PayPilot AI to add products to your cart!</p>
          </div>
        ) : (
          items.map((item, idx) => {
            const p = item.product;
            if (!p) return null;

            return (
              <div
                key={idx}
                className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={p.thumbnail || p.images?.[0]}
                    alt={p.name}
                    className="w-8 h-8 rounded object-contain bg-white border border-gray-200 p-0.5 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-[11px] truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>

                <div className="font-black text-gray-900 text-[11px] flex-shrink-0">
                  {formatCurrency(p.price * item.quantity)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pricing Summary */}
      {items.length > 0 && (
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">{formatCurrency(cart.subtotal)}</span>
          </div>
          {cart.discount > 0 && (
            <div className="flex justify-between text-[#008C45] font-bold">
              <span>Discount</span>
              <span>-{formatCurrency(cart.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-gray-900 text-xs pt-1.5 border-t border-gray-200">
            <span>Total</span>
            <span>{formatCurrency(cart.total)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full mt-2 py-2 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Candidate Products Spotlight */}
      {candidateProducts.length > 0 && (
        <div className="pt-2 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <Filter className="w-3 h-3 text-[#2874F0]" />
            <span>AI Context Candidates ({candidateProducts.length})</span>
          </div>

          <div className="space-y-1">
            {candidateProducts.slice(0, 3).map((cp, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded bg-gray-50 border border-gray-200 text-[11px] flex items-center justify-between"
              >
                <span className="font-medium text-gray-800 truncate max-w-[130px]">{cp.name || cp.title}</span>
                <span className="font-bold text-[#2874F0]">₹{cp.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AICartContextPanel;
