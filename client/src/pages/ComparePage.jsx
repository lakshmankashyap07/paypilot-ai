import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../utils/imageUtils';
import aiIntelligenceService from '../services/aiIntelligenceService';
import aiService from '../services/aiService';
import { WishlistButton } from '../components/WishlistButton';
import {
  Scale,
  Sparkles,
  ShoppingBag,
  Eye,
  Trash2,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Zap,
  Tag,
  ArrowLeft,
  Bot
} from 'lucide-react';

export const ComparePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { compareItems, compareCount, removeFromCompare, clearCompare } = useCompare();

  const [userCriteria, setUserCriteria] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Q&A Follow-up State
  const [qaMessages, setQaMessages] = useState([]);
  const [qaInput, setQaInput] = useState('');
  const [isAskingQA, setIsAskingQA] = useState(false);

  const productIds = compareItems.map((p) => p._id || p.id);

  // Fetch AI Comparison Analysis when compare items or criteria change
  useEffect(() => {
    const fetchAIComparison = async () => {
      if (productIds.length < 2) {
        setAiAnalysis(null);
        return;
      }

      try {
        setIsLoadingAI(true);
        setAiError(null);
        const res = await aiIntelligenceService.compareProducts(productIds, userCriteria);
        if (res && res.data) {
          setAiAnalysis(res.data);
        }
      } catch (err) {
        console.warn('AI comparison notice:', err.message);
        setAiError('AI comparison is temporarily unavailable. You can still compare specifications below.');
      } finally {
        setIsLoadingAI(false);
      }
    };

    fetchAIComparison();
  }, [productIds.join(','), userCriteria]);

  const handleCriteriaSubmit = (e) => {
    e.preventDefault();
    if (productIds.length < 2) return;
  };

  const handleAskQA = async (questionText = null) => {
    const text = (questionText || qaInput).trim();
    if (!text || isAskingQA || productIds.length < 2) return;

    setQaMessages((prev) => [...prev, { role: 'USER', content: text }]);
    setQaInput('');

    try {
      setIsAskingQA(true);
      const res = await aiService.sendMessage(
        `[Comparing products: ${compareItems.map((p) => p.name).join(', ')}] Question: ${text}`
      );
      if (res && res.success && res.data?.message) {
        setQaMessages((prev) => [...prev, { role: 'ASSISTANT', content: res.data.message.content }]);
      }
    } catch (err) {
      showToast(err.message || 'Follow-up query failed', 'error');
    } finally {
      setIsAskingQA(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  // Extract all unique specification keys across all products
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap((p) => (p.specifications ? Object.keys(p.specifications) : []))
    )
  );

  // EMPTY STATE: Fewer than 2 products selected
  if (compareCount < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 text-xs text-[#172337]">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
          <Scale className="w-8 h-8 text-[#2874F0]" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <h2 className="text-2xl font-black text-gray-900">Select Products to Compare</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Please select at least 2 products from the shop catalogue to enable side-by-side spec matrix & AI verdict.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Shop Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Best Values for Highlights Matrix
  const minPrice = Math.min(...compareItems.map((p) => p.price || Infinity));
  const maxRating = Math.max(...compareItems.map((p) => p.rating || 0));
  const maxDiscount = Math.max(...compareItems.map((p) => p.discount || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs text-[#172337]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <Link to="/shop" className="text-[#2874F0] font-bold text-xs hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <span>Smart Product Comparison</span>
            <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#2874F0] text-white rounded-md uppercase tracking-wider">
              {compareCount} PRODUCTS
            </span>
          </h1>
          <p className="text-xs text-gray-500">Side-by-side spec matrix & data-backed AI verdict</p>
        </div>

        <button
          onClick={clearCompare}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#D32F2F] border border-rose-200 font-extrabold rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Comparison</span>
        </button>
      </div>

      {/* 1. USER REQUIREMENT PRIORITIZATION BAR */}
      <div className="p-4 bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 rounded-2xl border border-blue-100 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
          <Sparkles className="w-4 h-4 text-[#2874F0]" />
          <span>What matters most to you for this comparison? (Optional)</span>
        </div>

        <form onSubmit={handleCriteriaSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={userCriteria}
            onChange={(e) => setUserCriteria(e.target.value)}
            placeholder="e.g. I need this mainly for coding and gaming, or long battery life..."
            className="flex-grow bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#2874F0] shadow-2xs"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-2xs transition-all cursor-pointer flex-shrink-0"
          >
            Update Priority
          </button>
        </form>
      </div>

      {/* 2. AI VERDICT & HIGHLIGHT BADGES */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#2874F0]" />
            <h3 className="text-base font-black text-gray-900">AI Comparison Verdict</h3>
          </div>
          {isLoadingAI && (
            <div className="flex items-center gap-1.5 text-xs text-[#2874F0] font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing product specifications...</span>
            </div>
          )}
        </div>

        {aiError ? (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {compareItems.map((prod) => {
              const pId = prod._id || prod.id;
              const isBestOverall = prod.price === minPrice && (prod.rating || 0) === maxRating;
              const isBestBudget = prod.price === minPrice;
              const isBestRated = (prod.rating || 0) === maxRating && maxRating > 0;
              const isBestValue = (prod.discount || 0) === maxDiscount && maxDiscount > 0;

              return (
                <div
                  key={pId}
                  className={`p-3.5 rounded-xl border space-y-2 flex flex-col justify-between ${
                    isBestOverall || isBestRated
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-gray-50/70 border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-xs line-clamp-1">{prod.name}</div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {isBestOverall && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-600 text-white rounded">
                          🏆 Best Overall
                        </span>
                      )}
                      {isBestBudget && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-blue-600 text-white rounded">
                          💰 Best Budget
                        </span>
                      )}
                      {isBestRated && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-purple-600 text-white rounded">
                          ⭐ Best Rated
                        </span>
                      )}
                      {isBestValue && (
                        <span className="px-2 py-0.5 text-[9px] font-black bg-amber-600 text-white rounded">
                          ⚡ Best Value
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-1 text-[11px] opacity-90 font-medium pt-2 border-t border-gray-200/60">
                    <li>• Price: <strong>{formatCurrency(prod.price)}</strong></li>
                    <li>• Customer Rating: <strong>{prod.rating ? `${prod.rating}★` : 'N/A'}</strong></li>
                    {prod.discount > 0 && <li>• Discount: <strong>{prod.discount}% Off</strong></li>}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SIDE-BY-SIDE PRODUCT COMPARISON MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            
            {/* Header Product Row */}
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="p-4 w-48 text-xs font-black text-gray-700 uppercase tracking-wider">
                  Product Overview
                </th>
                {compareItems.map((prod) => {
                  const pId = prod._id || prod.id;
                  const imgSrc = getImageUrl(prod.thumbnail || prod.images?.[0] || prod.imageUrl || prod.image);

                  return (
                    <th key={pId} className="p-4 w-64 vertical-top border-l border-gray-200">
                      <div className="space-y-3">
                        {/* Remove Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeFromCompare(pId)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove from compare"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Image */}
                        <div className="h-36 rounded-xl bg-gray-50 border border-gray-200 p-2 flex items-center justify-center">
                          <img src={imgSrc} alt={prod.name} className="h-full object-contain" />
                        </div>

                        {/* Name & Brand */}
                        <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase">{prod.brand}</div>
                          <Link
                            to={`/product/${prod.slug || pId}`}
                            className="font-extrabold text-xs text-gray-900 hover:text-[#2874F0] line-clamp-2 block leading-snug"
                          >
                            {prod.name}
                          </Link>
                        </div>

                        {/* Pricing & Rating */}
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-gray-900">{formatCurrency(prod.price)}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(prod.originalPrice)}
                              </span>
                            )}
                          </div>
                          {prod.rating > 0 && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#388E3C] text-white font-bold text-[10px] rounded">
                              <span>{prod.rating.toFixed(1)}</span>
                              <Star className="w-2.5 h-2.5 fill-white text-white" />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-1.5 pt-2">
                          <button
                            onClick={() => addToCart(pId, 1)}
                            disabled={prod.stock === 0}
                            className="w-full py-2 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-all disabled:opacity-40"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>

                          <div className="flex gap-1.5">
                            <Link
                              to={`/product/${prod.slug || pId}`}
                              className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-center text-xs flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#2874F0]" />
                              <span>View</span>
                            </Link>

                            <WishlistButton
                              productId={pId}
                              className="p-1.5 bg-gray-100 text-gray-600 hover:text-rose-600 border border-gray-200 rounded-lg"
                              iconSize="w-3.5 h-3.5"
                            />
                          </div>
                        </div>

                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Spec Matrix Body */}
            <tbody className="divide-y divide-gray-100 text-xs">
              
              {/* Category */}
              <tr>
                <td className="p-3 font-extrabold text-gray-600 bg-gray-50/50">Category</td>
                {compareItems.map((p) => (
                  <td key={p._id || p.id} className="p-3 font-bold text-gray-800 border-l border-gray-100">
                    {p.category || 'Specification not available'}
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr>
                <td className="p-3 font-extrabold text-gray-600 bg-gray-50/50">Price</td>
                {compareItems.map((p) => (
                  <td key={p._id || p.id} className="p-3 border-l border-gray-100 font-extrabold text-gray-900">
                    {formatCurrency(p.price)}
                    {p.price === minPrice && (
                      <span className="ml-2 text-[10px] text-[#388E3C] font-black bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ✓ Best Price
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className="p-3 font-extrabold text-gray-600 bg-gray-50/50">Customer Rating</td>
                {compareItems.map((p) => (
                  <td key={p._id || p.id} className="p-3 border-l border-gray-100 font-bold text-gray-800">
                    {p.rating ? `${p.rating} / 5` : 'Specification not available'}
                    {p.rating === maxRating && maxRating > 0 && (
                      <span className="ml-2 text-[10px] text-[#388E3C] font-black bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ✓ Best Rated
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Stock Status */}
              <tr>
                <td className="p-3 font-extrabold text-gray-600 bg-gray-50/50">Availability / Stock</td>
                {compareItems.map((p) => (
                  <td key={p._id || p.id} className="p-3 border-l border-gray-100 font-bold">
                    {p.stock > 0 ? (
                      <span className="text-[#388E3C]">{p.stock} Available in Stock</span>
                    ) : (
                      <span className="text-[#D32F2F]">Out of Stock</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Specifications Matrix */}
              {allSpecKeys.map((specKey) => (
                <tr key={specKey}>
                  <td className="p-3 font-extrabold text-gray-600 bg-gray-50/50">{specKey}</td>
                  {compareItems.map((p) => {
                    const val = p.specifications?.[specKey];
                    return (
                      <td key={p._id || p.id} className="p-3 border-l border-gray-100 font-medium text-gray-800">
                        {val ? String(val) : 'Specification not available'}
                      </td>
                    );
                  })}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* 4. AI FOLLOW-UP Q&A ASSISTANT FOR COMPARISON */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Bot className="w-5 h-5 text-[#2874F0]" />
          <div>
            <h3 className="text-base font-black text-gray-900">Ask AI About These Compared Products</h3>
            <p className="text-xs text-gray-500">Ask follow-up questions tailored strictly to these items</p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            'Which one should I buy?',
            'Which one is better for gaming?',
            'Which one gives better value?',
            'Is the price difference worth it?'
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQA(q)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2874F0] border border-blue-200 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Q&A Thread */}
        {qaMessages.length > 0 && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
            {qaMessages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-2 ${m.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    m.role === 'USER'
                      ? 'bg-[#2874F0] text-white font-medium rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 font-medium rounded-tl-none shadow-2xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Form Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQA();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={qaInput}
            onChange={(e) => setQaInput(e.target.value)}
            placeholder="Ask AI anything about these compared products..."
            disabled={isAskingQA}
            className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
          />
          <button
            type="submit"
            disabled={isAskingQA || !qaInput.trim()}
            className="px-4 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isAskingQA ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask AI</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default ComparePage;
