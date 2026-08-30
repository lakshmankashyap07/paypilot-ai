import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import wishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist({ products: [] });
      return;
    }

    try {
      setIsLoading(true);
      const res = await wishlistService.getWishlist();
      if (res && res.success && res.data?.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.warn('Failed to load wishlist:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your wishlist', 'info');
      return false;
    }

    try {
      const res = await wishlistService.addToWishlist(productId);
      if (res && res.success && res.data?.wishlist) {
        setWishlist(res.data.wishlist);
        showToast('Added to wishlist', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add to wishlist', 'error');
    }
    return false;
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res && res.success && res.data?.wishlist) {
        setWishlist(res.data.wishlist);
        showToast('Removed from wishlist', 'info');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove from wishlist', 'error');
    }
    return false;
  };

  const isInWishlist = useCallback(
    (productId) => {
      if (!wishlist?.products || !productId) return false;
      return wishlist.products.some((p) => (p._id || p) === productId);
    },
    [wishlist]
  );

  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};
