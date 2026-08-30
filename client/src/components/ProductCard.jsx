import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Eye, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { WishlistButton } from './WishlistButton';
import { useCart } from '../hooks/useCart';

import { getImageUrl } from '../utils/imageUtils';

export const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
    imageUrl,
    image,
    featured
  } = product;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(originalPrice)
    : null;

  const rawImage = thumbnail || (images && images[0]) || imageUrl || image;
  const displayImage = imageError || !rawImage ? getImageUrl(rawImage) : getImageUrl(rawImage);

  const inStock = stock > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      await addToCart(_id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    try {
      setIsAddingToCart(true);
      await addToCart(_id, 1);
      navigate('/cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:shadow-lg hover:border-blue-400 relative">
      
      {/* Product Image Box */}
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

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#388E3C] text-white rounded shadow-sm">
              {discount}% OFF
            </span>
          )}
          {featured && (
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FFCA28] text-[#212121] rounded shadow-sm">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={_id} className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white text-gray-600 hover:text-rose-500" iconSize="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
              {brand || 'PayPilot'}
            </span>
            <span className={`text-[10px] font-bold ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${slug || _id}`}
            className="font-bold text-[#212121] text-xs sm:text-sm line-clamp-2 hover:text-[#2874F0] transition-colors leading-snug"
          >
            {name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#388E3C] text-white font-bold text-[11px]">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white text-white" />
            </div>
            <span className="text-gray-500 text-[11px]">({reviewCount})</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-[#212121]">{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="py-2 px-2 bg-blue-50 hover:bg-blue-100 text-[#2874F0] text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all border border-blue-200 disabled:opacity-40"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="py-2 px-2 bg-[#FF9F00] hover:bg-amber-600 text-white text-xs font-extrabold rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all disabled:opacity-40"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
