import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Eye, CheckCircle2, Zap } from 'lucide-react';
import { WishlistButton } from './WishlistButton';
import { useCart } from '../hooks/useCart';
import { getImageUrl } from '../utils/imageUtils';

export const ExplainableRecommendationCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const {
    _id,
    name,
    slug,
    brand,
    price,
    originalPrice,
    discount,
    rating = 0,
    reviewCount = 0,
    stock = 0,
    thumbnail,
    images = [],
    whyRecommended,
    whyList = []
  } = product;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price || 0);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(originalPrice)
    : null;

  const rawImage = thumbnail || (images && images[0]);
  const displayImage = imageError || !rawImage ? getImageUrl(rawImage) : getImageUrl(rawImage);
  const inStock = stock > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock || isAdding) return;

    try {
      setIsAdding(true);
      await addToCart(_id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border border-[#E0E6ED] rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:shadow-lg hover:border-[#2874F0] relative text-xs">
      
      {/* Top Product Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center p-2">
        <Link to={`/product/${slug || _id}`} className="w-full h-full block">
          <img
            src={displayImage}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#388E3C] text-white rounded shadow-2xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={_id} className="p-1.5 bg-white/90 rounded-full shadow-2xs hover:bg-white text-gray-600 hover:text-rose-500" iconSize="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-gray-500 uppercase tracking-wider">
              {brand || 'PayPilot'}
            </span>
            <span className={`font-bold ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <Link
            to={`/product/${slug || _id}`}
            className="font-bold text-[#172337] text-xs sm:text-sm line-clamp-1 hover:text-[#2874F0] transition-colors leading-snug"
          >
            {name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#388E3C] text-white font-bold text-[10px]">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </div>
            <span className="text-gray-500 text-[10px]">({reviewCount})</span>
          </div>

          {/* EXPLAINABLE RECOMMENDATION CHECKLIST */}
          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg space-y-1 mt-2">
            <div className="font-extrabold text-[10px] text-[#2874F0] uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#2874F0]" />
              <span>Why AI Recommended</span>
            </div>
            <ul className="space-y-0.5 text-[10px] font-medium text-gray-700">
              {whyList && whyList.length > 0 ? (
                whyList.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1 leading-tight">
                    <span className="text-[#388E3C] font-black">✓</span>
                    <span>{item.replace(/^✓\s*/, '')}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-1 leading-tight">
                  <span className="text-[#388E3C] font-black">✓</span>
                  <span>{whyRecommended || 'Top choice matching your preferences'}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Pricing & Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-black text-[#172337]">{formattedPrice}</div>
            {formattedOriginalPrice && (
              <div className="text-[10px] text-gray-400 line-through font-medium">
                {formattedOriginalPrice}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className="py-1.5 px-3 bg-[#2874F0] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all shadow-2xs disabled:opacity-40 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default ExplainableRecommendationCard;
