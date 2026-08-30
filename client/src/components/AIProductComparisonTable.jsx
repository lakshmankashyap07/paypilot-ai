import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';

export const AIProductComparisonTable = ({ products = [] }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!products || products.length === 0) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  const handleAdd = async (productId, name) => {
    try {
      await addToCart(productId, 1);
      showToast(`Added ${name} to cart!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add to cart', 'error');
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden my-3 shadow-xl">
      <div className="p-3 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-teal-400 flex items-center justify-between">
        <span>Side-by-Side Product Comparison</span>
        <span className="text-[10px] text-slate-400 font-normal">Comparing {products.length} Products</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
              <th className="p-3">Feature</th>
              {products.map((p, idx) => (
                <th key={p.id || p._id || idx} className="p-3 min-w-[140px]">
                  {p.brand} {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {/* Price */}
            <tr>
              <td className="p-3 font-bold text-slate-400">Price</td>
              {products.map((p, idx) => (
                <td key={idx} className="p-3 font-bold text-white">
                  {formatCurrency(p.price)}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-3 font-bold text-slate-400">Rating</td>
              {products.map((p, idx) => (
                <td key={idx} className="p-3 font-semibold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {p.rating ? p.rating.toFixed(1) : '4.5'}
                </td>
              ))}
            </tr>

            {/* Discount */}
            <tr>
              <td className="p-3 font-bold text-slate-400">Discount</td>
              {products.map((p, idx) => (
                <td key={idx} className="p-3 font-semibold text-teal-400">
                  {p.discount > 0 ? `${p.discount}% OFF` : 'Standard'}
                </td>
              ))}
            </tr>

            {/* Stock */}
            <tr>
              <td className="p-3 font-bold text-slate-400">Stock Status</td>
              {products.map((p, idx) => (
                <td key={idx} className="p-3 font-medium">
                  {p.stock > 0 ? (
                    <span className="text-emerald-400 font-bold">In Stock ({p.stock})</span>
                  ) : (
                    <span className="text-rose-400 font-bold">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-3 font-bold text-slate-400">Action</td>
              {products.map((p, idx) => (
                <td key={idx} className="p-3">
                  <button
                    onClick={() => handleAdd(p.id || p._id, p.name)}
                    className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold rounded-lg text-[11px] border border-teal-500/30 inline-flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AIProductComparisonTable;
