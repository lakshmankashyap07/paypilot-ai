import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const paramsString = JSON.stringify(params);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage('');

      const rawParams = JSON.parse(paramsString);
      const cleanParams = {};

      // Prune undefined, null, empty strings, and empty objects
      Object.keys(rawParams).forEach((key) => {
        const val = rawParams[key];
        if (val !== undefined && val !== null && val !== '') {
          if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0) {
            return; // Omit empty objects like {}
          }
          if (typeof val === 'string' && val.trim().toLowerCase() === 'all' && (key === 'category' || key === 'brand')) {
            return; // Omit 'All' filter values
          }
          cleanParams[key] = val;
        }
      });

      const res = await productService.getProducts(cleanParams);

      if (res && res.success && res.data) {
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
      } else {
        setIsError(true);
        setErrorMessage(res?.message || 'Unable to load products. Please try again.');
        setProducts([]);
        setPagination({ page: 1, limit: 12, total: 0, totalPages: 1 });
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.response?.data?.message || err.message || 'Unable to load products. Please try again.');
      setProducts([]);
      setPagination({ page: 1, limit: 12, total: 0, totalPages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, [paramsString]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    isLoading,
    isError,
    errorMessage,
    refetch: fetchProducts
  };
};

export default useProducts;
