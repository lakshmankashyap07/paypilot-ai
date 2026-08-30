import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'INR'
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        currency: 'INR'
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await cartService.getCart();
      if (res && res.success && res.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.warn('Failed to load cart:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please sign in to add products to your cart', 'info');
      return false;
    }

    try {
      const res = await cartService.addToCart(productId, quantity);
      if (res && res.success && res.data?.cart) {
        setCart(res.data.cart);
        showToast('Product added to cart', 'success');
        setIsDrawerOpen(true); // Open drawer on successful add
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add product to cart', 'error');
    }
    return false;
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartService.updateCartItem(productId, quantity);
      if (res && res.success && res.data?.cart) {
        setCart(res.data.cart);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
    return false;
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartService.removeCartItem(productId);
      if (res && res.success && res.data?.cart) {
        setCart(res.data.cart);
        showToast('Item removed from cart', 'info');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
    return false;
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;

    try {
      const res = await cartService.clearCart();
      if (res && res.success && res.data?.cart) {
        setCart(res.data.cart);
        showToast('Cart cleared', 'info');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to clear cart', 'error');
    }
    return false;
  };

  const cartCount = (cart?.items || []).reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
