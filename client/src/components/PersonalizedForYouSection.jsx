import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, ShoppingBag } from 'lucide-react';
import aiIntelligenceService from '../services/aiIntelligenceService';
import { ExplainableRecommendationCard } from './ExplainableRecommendationCard';

export const PersonalizedForYouSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await aiIntelligenceService.getPersonalizedFeed(8);
      setData(res);
    } catch (err) {
      console.warn('Personalized feed error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#E0E6ED] space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Curating your personalized AI shopping feed...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.products || data.products.length === 0) return null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E0E6ED] shadow-xs space-y-6 text-xs text-[#172337]">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">
              <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#172337]">
              Recommended For You
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-black bg-indigo-600 text-white rounded-md uppercase tracking-wider">
              AI Personalized
            </span>
          </div>
          <p className="text-xs text-[#5F6B76] pl-10">
            {data.personalized
              ? `Tailored specifically based on your wishlist, cart items, and active category preferences`
              : `Handpicked top choices from our catalog based on customer rating and demand velocity`}
          </p>
        </div>

        <button
          onClick={fetchFeed}
          className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold text-gray-700 rounded-lg text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          <span>Refresh AI Feed</span>
        </button>
      </div>

      {/* Grid of Explainable Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((prod) => (
          <ExplainableRecommendationCard key={prod._id} product={prod} />
        ))}
      </div>

    </div>
  );
};

export default PersonalizedForYouSection;
