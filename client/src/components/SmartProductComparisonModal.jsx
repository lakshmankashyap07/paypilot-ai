import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, DollarSign, Star, Zap, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUtils';
import aiIntelligenceService from '../services/aiIntelligenceService';

export const SmartProductComparisonModal = ({ productIds = [], onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        setLoading(true);
        const res = await aiIntelligenceService.compareProducts(productIds);
        setData(res);
      } catch (err) {
        showToast(err.message || 'Failed to compare products', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (productIds.length > 0) {
      fetchComparison();
    }
  }, [productIds]);

  const handleAdd = async (productId, name) => {
    try {
      setAddingId(productId);
      await addToCart(productId, 1);
      showToast(`Added ${name} to cart!`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'error');
    } finally {
      setAddingId(null);
    }
  };

  if (productIds.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-[#E0E6ED] p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs text-[#172337]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#172337]">Smart AI Product Comparison</h3>
              <p className="text-xs text-[#5F6B76] mt-0.5">
                Side-by-side specification, pricing, rating, and AI value breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#2874F0] animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-bold">Analyzing specifications & computing AI value badges...</p>
          </div>
        ) : !data || !data.products ? (
          <div className="py-12 text-center text-gray-500">Could not generate comparison.</div>
        ) : (
          <div className="space-y-6">
            
            {/* AI Summary Card */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl space-y-1">
              <div className="font-extrabold text-[#2874F0] text-xs flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>AI Recommendation Summary</span>
              </div>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                {data.summaryText}
              </p>
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.products.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-gray-50 rounded-xl border border-[#E0E6ED] p-4 flex flex-col justify-between space-y-4 relative hover:border-[#2874F0] transition-colors"
                >
                  {/* AI Badge Tags */}
                  <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                    {prod.badges?.map((b, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md shadow-2xs ${
                          b.type === 'overall'
                            ? 'bg-[#388E3C] text-white'
                            : b.type === 'budget'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : b.type === 'performance'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        ★ {b.label}
                      </span>
                    ))}
                  </div>

                  {/* Product Image & Info */}
                  <div className="space-y-2 text-center">
                    <img
                      src={getImageUrl(prod.thumbnail || prod.images?.[0])}
                      alt={prod.name}
                      className="w-24 h-24 mx-auto object-contain bg-white rounded-lg p-1 border border-gray-200"
                    />
                    <div className="font-bold text-gray-900 text-xs line-clamp-2 leading-tight">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{prod.brand}</div>
                  </div>

                  {/* Specs & Pricing Details */}
                  <div className="space-y-2 pt-2 border-t border-gray-200 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Selling Price:</span>
                      <span className="font-extrabold text-gray-900 text-sm">
                        ₹{prod.price?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {prod.originalPrice > prod.price && (
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-gray-400">MRP:</span>
                        <span className="text-gray-400 line-through">
                          ₹{prod.originalPrice?.toLocaleString('en-IN')} ({prod.discount}% OFF)
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Rating:</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{prod.rating || '4.2'}★</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-semibold text-gray-700">{prod.category}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Stock Status:</span>
                      <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {prod.stock > 0 ? `In Stock (${prod.stock})` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAdd(prod._id, prod.name)}
                    disabled={prod.stock === 0 || addingId === prod._id}
                    className="w-full py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {addingId === prod._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Select & Add to Cart</span>
                      </>
                    )}
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SmartProductComparisonModal;
