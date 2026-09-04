import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { ProductCard } from '../components/ProductCard';
import { ExplainableRecommendationCard } from '../components/ExplainableRecommendationCard';
import { Heart, ShoppingBag, ArrowRight, Zap, TrendingDown } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, wishlistCount, isLoading } = useWishlist();
  const products = wishlist?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs text-[#172337] min-h-[calc(100vh-16rem)] flex flex-col justify-between">
      
      <div className="space-y-6 flex-1">
        
        {/* 1. WISHLIST PAGE HEADER */}
        <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-[#D32F2F] flex items-center justify-center">
                <Heart className="w-4 h-4 fill-[#D32F2F]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172337]">
                My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </h1>
            </div>
            <p className="text-xs text-[#5F6B76] pl-10">
              Saved items you are interested in purchasing later
            </p>
          </div>

          <Link
            to="/shop"
            className="px-5 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. MAIN CONTENT AREA */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-white border border-[#E0E6ED] animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          
          /* EMPTY WISHLIST STATE CARD */
          <div className="my-12 py-12 px-6 bg-white rounded-2xl border border-[#E0E6ED] text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#D32F2F] border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#172337]">Your wishlist is empty</h3>
              <p className="text-xs text-[#5F6B76] leading-relaxed max-w-xs mx-auto">
                Save products you love and find them here whenever you're ready.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-xs transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Products</span>
              </Link>
            </div>
          </div>
        ) : (
          
          /* WISHLIST PRODUCTS GRID WITH AI TRACKING */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#5F6B76] uppercase tracking-wider">
                Saved Products ({wishlistCount})
              </div>
              <div className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>AI Price Drop & Stock Tracking Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ExplainableRecommendationCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default WishlistPage;
