import React, { useState, useEffect } from 'react';
import agenticCommerceService from '../services/agenticCommerceService';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUtils';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Zap,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

export const AIBudgetGuardCard = ({ onApplyCoupon }) => {
  const { cart, updateQuantity, removeFromCart, addToCart } = useCart();
  const { showToast } = useToast();

  const [userBudgetInput, setUserBudgetInput] = useState('30000');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const cartTotal = cart?.total || 0;

  const fetchAnalysis = async (budgetValue) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setAnalysis(null);
      return;
    }

    try {
      setIsLoading(true);
      setErrorState(null);
      const res = await agenticCommerceService.analyzeBudgetGuard(Number(budgetValue) || 30000);
      if (res && res.data) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.warn('AI Budget Guard notice:', err.message);
      setErrorState('AI optimization is temporarily unavailable.');
    } fontFinally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(userBudgetInput);
  }, [cartTotal, cart?.items?.length]);

  const handleBudgetChange = (e) => {
    const val = e.target.value;
    setUserBudgetInput(val);
    if (val && !isNaN(val)) {
      fetchAnalysis(val);
    }
  };

  const handleOptimizeClick = () => {
    setShowDetails(true);
    fetchAnalysis(userBudgetInput);
  };

  const handleReplaceProduct = async (currentProdId, replacementProduct) => {
    try {
      setIsLoading(true);
      await removeFromCart(currentProdId);
      await addToCart(replacementProduct._id || replacementProduct.id, 1);
      showToast(`Replaced item with ${replacementProduct.name}`, 'success');
      await fetchAnalysis(userBudgetInput);
    } catch (err) {
      showToast(err.message || 'Failed to replace product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyOfferClick = (code) => {
    if (onApplyCoupon) {
      onApplyCoupon(code);
      showToast(`Applied offer coupon "${code}"!`, 'success');
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  if (!cart || !cart.items || cart.items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-5 shadow-xs space-y-4 text-xs text-[#172337]">
      
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-[#2874F0] flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-1.5">
              <span>AI Cart Optimizer</span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-[#2874F0] text-white rounded uppercase tracking-wider">
                SMART GUARD
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">Real-time budget guard & deal optimizer</p>
          </div>
        </div>

        <button
          onClick={() => fetchAnalysis(userBudgetInput)}
          className="p-1.5 text-gray-400 hover:text-[#2874F0] transition-colors cursor-pointer"
          title="Re-analyze cart"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Fallback Notice */}
      {errorState && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-2 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{errorState}</span>
        </div>
      )}

      {/* Main Budget Grid Box */}
      <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200 space-y-3">
        
        {/* Budget Input Row */}
        <div className="flex items-center justify-between gap-3">
          <label className="font-extrabold text-gray-700">Shopping Budget:</label>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 font-bold">₹</span>
            <input
              type="number"
              value={userBudgetInput}
              onChange={handleBudgetChange}
              step="1000"
              min="0"
              className="w-28 bg-white border border-gray-300 rounded-lg px-2.5 py-1 font-bold text-xs text-gray-900 text-right focus:outline-none focus:border-[#2874F0]"
            />
          </div>
        </div>

        {/* Budget Summary Metrics */}
        {analysis && (
          <div className="space-y-1.5 pt-2 border-t border-gray-200/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Cart Total:</span>
              <span className="font-extrabold text-gray-900">{formatCurrency(analysis.cartTotal)}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">
                {analysis.isOverBudget ? 'Over Budget:' : 'Remaining:'}
              </span>
              <span className={`font-black ${analysis.isOverBudget ? 'text-[#D32F2F]' : 'text-[#388E3C]'}`}>
                {analysis.isOverBudget
                  ? `+${formatCurrency(analysis.difference)} ⚠️`
                  : `${formatCurrency(analysis.difference)} ✓`}
              </span>
            </div>

            {analysis.potentialSavings > 0 && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-center justify-between text-xs font-extrabold">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Potential Savings:</span>
                </span>
                <span>{formatCurrency(analysis.potentialSavings)}</span>
              </div>
            )}
          </div>
        )}

        {/* Optimize Button */}
        <button
          onClick={handleOptimizeClick}
          disabled={isLoading}
          className="w-full py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{showDetails ? 'Refresh Optimization' : 'Optimize My Cart'}</span>
        </button>

      </div>

      {/* Detailed Analysis Breakdown Panel */}
      {showDetails && analysis && (
        <div className="space-y-3 pt-2 border-t border-gray-100 animate-in fade-in-50">
          
          {/* Smart Insights */}
          {analysis.insights && analysis.insights.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                Smart Insights
              </span>
              {analysis.insights.map((ins, idx) => (
                <div key={idx} className="p-2 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] font-medium text-[#172337]">
                  • {ins}
                </div>
              ))}
            </div>
          )}

          {/* Applicable Offers */}
          {analysis.bestDeal ? (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Applicable Offer: {analysis.bestDeal.code}</span>
                </div>
                <button
                  onClick={() => handleApplyOfferClick(analysis.bestDeal.code)}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10px] rounded-lg cursor-pointer"
                >
                  Apply Offer
                </button>
              </div>
              <p className="text-[11px] text-emerald-800">{analysis.bestDeal.title} — Saves {formatCurrency(analysis.bestDeal.discount)}</p>
            </div>
          ) : (
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-xs font-medium">
              No additional offers are currently available.
            </div>
          )}

          {/* Cheaper Alternatives */}
          {analysis.cheaperAlternatives && analysis.cheaperAlternatives.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                Cheaper Alternatives Available
              </span>

              {analysis.cheaperAlternatives.map((alt, idx) => {
                const currentId = alt.currentProduct._id || alt.currentProduct.id;
                const replProd = alt.replacementProduct;
                const imgSrc = getImageUrl(replProd.thumbnail || replProd.images?.[0] || replProd.imageUrl || replProd.image);

                return (
                  <div key={idx} className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                    <p className="text-[11px] font-medium text-gray-800">{alt.rationale}</p>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img src={imgSrc} alt={replProd.name} className="w-8 h-8 object-contain rounded bg-gray-50 p-0.5 border" />
                        <div>
                          <div className="font-extrabold text-xs text-gray-900 line-clamp-1">{replProd.name}</div>
                          <div className="text-[10px] text-emerald-700 font-bold">{formatCurrency(replProd.price)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReplaceProduct(currentId, replProd)}
                          className="px-2.5 py-1.5 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => setShowDetails(false)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] rounded-lg cursor-pointer"
                        >
                          Keep Current
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Explanation Summary */}
          {analysis.optimizationSummary && analysis.optimizationSummary.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                AI Optimization Summary
              </span>
              {analysis.optimizationSummary.map((sum, i) => (
                <div key={i} className="text-[11px] text-gray-800 font-medium">
                  {sum}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AIBudgetGuardCard;
