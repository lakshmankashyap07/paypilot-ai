import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';

import { getImageUrl } from '../utils/imageUtils';
import { WishlistButton } from './WishlistButton';

export const AIProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const {
    id,
    _id,
    name,
    brand,
    price,
    originalPrice,
    discount,
    rating,
    stock,
    thumbnail,
    images,
    imageUrl,
    image
  } = product;

  const productId = id || _id;
  const imageSrc = getImageUrl(thumbnail || images?.[0] || imageUrl || image);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAdding(true);
      await addToCart(productId, 1);
      setIsAdded(true);
      showToast(`Added ${name} to cart!`, 'success');
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-3 rounded-xl bg-white border border-gray-200 hover:border-[#2874F0] hover:shadow-md transition-all flex flex-col justify-between gap-2.5 shadow-sm max-w-xs flex-shrink-0 text-xs">
      
      {/* Product Image & Stock */}
      <div className="relative aspect-video rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center p-1.5 border border-gray-100">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-contain rounded"
        />
        {stock <= 5 && stock > 0 && (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-200 rounded">
            Only {stock} left
          </span>
        )}
      </div>

      {/* Details & AI Rationale */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{brand || 'PayPilot'}</div>
        <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{name}</h4>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-gray-900">{formatCurrency(price)}</span>
            {originalPrice > price && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] font-bold px-1 py-0.2 bg-[#388E3C] text-white rounded">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </div>
          )}
        </div>

        {/* Why Recommended AI Rationale */}
        {product.whyRecommended && (
          <div className="pt-1 text-[10px] text-emerald-800 font-semibold bg-emerald-50 p-1.5 rounded-md border border-emerald-100 leading-snug">
            {product.whyRecommended}
          </div>
        )}
      </div>

      {/* Action Buttons: View, Wishlist, Add to Cart */}
      <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100">
        <Link
          to={`/product/${productId}`}
          className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
        >
          <Eye className="w-3 h-3 text-[#2874F0]" />
          <span>View</span>
        </Link>

        <WishlistButton
          productId={productId}
          className="p-1.5 bg-gray-100 text-gray-600 hover:text-rose-600 border border-gray-200 rounded-lg"
          iconSize="w-3.5 h-3.5"
        />

        <button
          onClick={handleAddToCart}
          disabled={isAdding || stock === 0}
          className={`flex-1 px-2 py-1.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
            isAdded
              ? 'bg-[#388E3C] text-white'
              : stock === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#FF9F00] hover:bg-amber-600 text-white shadow-sm'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default AIProductCard;
