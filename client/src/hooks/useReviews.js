import { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setIsError(false);

      const res = await reviewService.getReviews(productId);
      if (res && res.success && res.data) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (reviewData) => {
    const res = await reviewService.createReview(productId, reviewData);
    await fetchReviews();
    return res;
  };

  const editReview = async (reviewId, reviewData) => {
    const res = await reviewService.updateReview(reviewId, reviewData);
    await fetchReviews();
    return res;
  };

  const removeReview = async (reviewId) => {
    const res = await reviewService.deleteReview(reviewId);
    await fetchReviews();
    return res;
  };

  return {
    reviews,
    isLoading,
    isError,
    errorMessage,
    addReview,
    editReview,
    removeReview,
    refetch: fetchReviews
  };
};

export default useReviews;
