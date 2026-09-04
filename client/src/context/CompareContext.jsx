import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const { showToast } = useToast();
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('paypilot_compare_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('paypilot_compare_items', JSON.stringify(compareItems));
    } catch (e) {
      console.warn('Failed to save comparison state:', e.message);
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product) return;
    const pId = (product._id || product.id || '').toString();

    if (compareItems.some((item) => (item._id || item.id || '').toString() === pId)) {
      showToast('Product is already in your comparison list', 'info');
      return;
    }

    if (compareItems.length >= 4) {
      showToast('You can compare a maximum of 4 products at a time', 'error');
      return;
    }

    setCompareItems((prev) => [...prev, product]);
    showToast(`Added ${product.name} to comparison tray`, 'success');
  };

  const removeFromCompare = (productId) => {
    const pId = (productId || '').toString();
    setCompareItems((prev) => prev.filter((item) => (item._id || item.id || '').toString() !== pId));
    showToast('Removed product from comparison list', 'info');
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    if (!productId) return false;
    const pId = productId.toString();
    return compareItems.some((item) => (item._id || item.id || '').toString() === pId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareContext;
