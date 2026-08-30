import api from './api';

export const reviewService = {
  /**
   * Fetch reviews for a product
   */
  async getReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response;
  },

  /**
   * Submit a new review
   */
  async createReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response;
  },

  /**
   * Update an existing review
   */
  async updateReview(reviewId, reviewData) {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response;
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response;
  }
};

export default reviewService;
