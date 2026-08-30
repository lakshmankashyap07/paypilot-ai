import React from 'react';
import { ShoppingBag, ShieldCheck, Sparkles, Tag, ArrowRight } from 'lucide-react';

export const CartSummary = ({
  subtotal = 0,
  discount = 0,
  tax = 0,
  shipping = 0,
  total = 0,
  currency = 'INR',
  itemCount = 0,
  onCheckout,
  checkoutButtonText = 'PROCEED TO CHECKOUT',
  isCheckoutDisabled = false
}) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs text-[#212121]">
      
      {/* Header */}
      <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
          PRICE DETAILS ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
        </h3>
      </div>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700">
          <span>Price ({itemCount} items)</span>
          <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-[#008C45] font-bold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Discount
            </span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-gray-600">
          <span>GST (18%)</span>
          <span className="font-semibold text-gray-800">{formatCurrency(tax)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-gray-600">
          <span>Delivery Charges</span>
          {shipping === 0 ? (
            <span className="font-bold text-[#008C45] uppercase tracking-wider">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-gray-800">{formatCurrency(shipping)}</span>
          )}
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal < 2000 && subtotal > 0 && (
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-[#2874F0] space-y-1">
            <div className="flex justify-between font-bold">
              <span>Add {formatCurrency(2000 - subtotal)} for FREE Delivery</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2874F0] rounded-full"
                style={{ width: `${Math.min(100, (subtotal / 2000) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Total Amount */}
      <div className="pt-3 border-t border-gray-200 border-dashed space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-black text-gray-900">Total Amount</span>
          <div className="text-right">
            <span className="text-xl font-black text-[#212121]">{formatCurrency(total)}</span>
          </div>
        </div>

        {discount > 0 && (
          <div className="p-2 bg-emerald-50 text-[#008C45] rounded-lg text-center font-bold text-[11px]">
            You will save {formatCurrency(discount)} on this order
          </div>
        )}

        {/* Checkout Button */}
        {onCheckout && (
          <button
            onClick={onCheckout}
            disabled={isCheckoutDisabled || itemCount === 0}
            className="w-full py-3.5 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>{checkoutButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Security note */}
      <div className="pt-2 text-[10px] text-gray-400 space-y-1 border-t border-gray-100">
        <div className="flex items-center gap-1.5 font-semibold text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#008C45]" />
          <span>Safe and Secure Payments. 100% Authentic Products.</span>
        </div>
      </div>

    </div>
  );
};

export default CartSummary;
