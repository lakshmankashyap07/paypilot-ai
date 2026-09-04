import React, { useState, useEffect } from 'react';
import { PackageCheck, Plus, ShoppingBag, Check, Loader2, Sparkles, Zap } from 'lucide-react';
import aiIntelligenceService from '../services/aiIntelligenceService';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUtils';

export const SmartBundleBuilderCard = ({ productId }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        const data = await aiIntelligenceService.getBundles(productId);
        setBundle(data);
      } catch (err) {
        console.warn('Bundle builder error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchBundle();
  }, [productId]);

  const handleAddFullBundle = async () => {
    if (!bundle || !bundle.bundleItems) return;
    try {
      setAdding(true);
      // Add primary product + all bundle items
      await addToCart(bundle.primaryProduct._id, 1);
      for (const item of bundle.bundleItems) {
        await addToCart(item._id, 1);
      }
      setAdded(true);
      showToast(`Added Complete ${bundle.primaryProduct.name} Smart Bundle to cart!`, 'success');
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      showToast(err.message || 'Failed to add bundle', 'error');
    } finally {
      setAdding(false);
    }
  };

  if (loading || !bundle || !bundle.bundleItems || bundle.bundleItems.length === 0) return null;

  const allItems = [bundle.primaryProduct, ...bundle.bundleItems];

  return (
    <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 border border-blue-100 rounded-xl p-5 shadow-xs space-y-4 text-xs text-[#172337]">
      
      {/* Bundle Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#172337] flex items-center gap-1.5">
              <span>Smart Companion Bundle</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-[#388E3C] text-white rounded-md">
                SAVE {bundle.discountPercent}%
              </span>
            </h4>
            <p className="text-[11px] text-[#5F6B76]">
              {bundle.compatibilityReason}
            </p>
          </div>
        </div>
      </div>

      {/* Items Preview Grid */}
      <div className="flex items-center justify-start gap-3 overflow-x-auto pb-2">
        {allItems.map((item, idx) => (
          <React.Fragment key={item._id}>
            <div className="bg-white border border-[#E0E6ED] rounded-xl p-3 flex-shrink-0 w-36 text-center space-y-2 shadow-2xs relative">
              {idx === 0 && (
                <span className="absolute -top-2 left-2 px-1.5 py-0.5 text-[8px] font-black bg-[#2874F0] text-white rounded">
                  MAIN ITEM
                </span>
              )}
              <img
                src={getImageUrl(item.thumbnail || item.images?.[0])}
                alt={item.name}
                className="w-16 h-16 mx-auto object-contain bg-gray-50 rounded-lg p-1 border border-gray-100"
              />
              <div className="font-bold text-gray-900 text-[11px] truncate">{item.name}</div>
              <div className="font-extrabold text-xs text-[#2874F0]">₹{item.price?.toLocaleString('en-IN')}</div>
            </div>

            {idx < allItems.length - 1 && (
              <div className="text-gray-400 font-black text-base flex-shrink-0">+</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pricing & Call to Action */}
      <div className="pt-2 border-t border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-gray-900">
              Bundle Total: ₹{bundle.discountedTotal?.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 line-through font-bold">
              ₹{bundle.originalTotal?.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-[#388E3C]">
            Instant Bundle Savings: ₹{bundle.savings?.toLocaleString('en-IN')}
          </p>
        </div>

        <button
          onClick={handleAddFullBundle}
          disabled={adding}
          className={`px-5 py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            added
              ? 'bg-[#388E3C] text-white'
              : 'bg-[#FF9F00] hover:bg-amber-600 text-white'
          }`}
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Smart Bundle Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add Full Bundle to Cart</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default SmartBundleBuilderCard;
