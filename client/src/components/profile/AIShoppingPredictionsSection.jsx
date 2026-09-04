import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, ShoppingCart, ArrowRight, Check, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { useCart } from '../../hooks/useCart';
import personalizationService from '../../services/personalizationService';

export const AIShoppingPredictionsSection = ({ orders = [] }) => {
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        const res = await personalizationService.getHomePageFeeds();
        if (res && res.success && res.data?.recommendedForYou) {
          setRecommendations(res.data.recommendedForYou.slice(0, 4));
        }
      } catch (err) {
        console.warn('Personalization feed error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
    setAddedMap((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>AI Shopping History & Purchase Predictions</span>
          </h2>
          <p className="text-xs text-gray-500">Predictive recommendations based on your browsing and order patterns</p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
          PREDICTIVE AI
        </span>
      </div>

      {/* AI Prediction Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl shadow-sm space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>🤖 PayPilot AI Prediction</span>
          </div>
          <span className="text-[10px] font-extrabold text-indigo-200 bg-indigo-800/60 px-2 py-0.5 rounded border border-indigo-700/50">
            High Confidence
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          "Based on your frequent purchases in <strong className="text-white">Electronics & Audio</strong>, you are predicted to upgrade your accessories next. We recommend exploring active noise-cancelling wireless earbuds and magnetic power banks."
        </p>
      </div>

      {/* Recommended Products Grid */}
      {recommendations.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Recommended Next Purchases For You
            </span>
            <Link to="/ai-shop" className="text-[11px] font-bold text-[#2874F0] hover:underline flex items-center gap-1">
              <span>Open AI Shopping Agent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((prod) => (
              <div key={prod._id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col justify-between space-y-3 hover:bg-white hover:border-indigo-200 transition-all text-xs">
                <div className="space-y-2">
                  <img
                    src={getImageUrl(prod.thumbnail || prod.images?.[0] || prod.imageUrl)}
                    alt={prod.name}
                    className="w-full h-28 object-contain rounded-xl bg-white border border-gray-200 p-2"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">{prod.brand}</span>
                    <Link to={`/product/${prod.slug || prod._id}`} className="font-bold text-gray-900 line-clamp-1 hover:text-[#2874F0] block">
                      {prod.name}
                    </Link>
                    <div className="font-black text-gray-900 text-sm">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/product/${prod.slug || prod._id}`}
                    className="flex-1 py-1.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl text-[11px] text-center hover:bg-gray-50"
                  >
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod._id)}
                    className={`flex-1 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all ${
                      addedMap[prod._id] ? 'bg-emerald-600 text-white' : 'bg-[#2874F0] hover:bg-blue-700 text-white'
                    }`}
                  >
                    {addedMap[prod._id] ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                    <span>{addedMap[prod._id] ? 'Added' : 'Add'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AIShoppingPredictionsSection;
