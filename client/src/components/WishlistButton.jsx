import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

export const WishlistButton = ({
  productId,
  className = '',
  iconSize = 'w-4 h-4',
  showText = false
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const active = isInWishlist(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (active) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      title={active ? 'Remove from Wishlist' : 'Add to Wishlist'}
      className={`transition-all duration-200 flex items-center gap-1.5 justify-center rounded-xl ${
        active
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
          : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/30'
      } ${className}`}
    >
      {isSubmitting ? (
        <Loader2 className={`${iconSize} animate-spin text-rose-400`} />
      ) : (
        <Heart className={`${iconSize} ${active ? 'fill-rose-500 text-rose-500' : ''}`} />
      )}
      {showText && (
        <span className="text-xs font-semibold">
          {active ? 'Wishlisted' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
