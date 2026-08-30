import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

export const useProduct = (idOrSlug) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!idOrSlug) return;

    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage('');

      const res = await productService.getProduct(idOrSlug);

      if (res && res.success && res.data) {
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts || []);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.message || 'Product not found');
      setProduct(null);
      setRelatedProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    relatedProducts,
    isLoading,
    isError,
    errorMessage,
    refetch: fetchProduct
  };
};

export default useProduct;
