import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

/**
 * Recalculates product rating and review count from actual reviews.
 */
export const recalculateProductRating = async (productId) => {
  const prodObjId = typeof productId === 'string' ? new mongoose.Types.ObjectId(productId) : productId;

  const stats = await Review.aggregate([
    { $match: { product: prodObjId } },
    {
      $group: {
        _id: '$product',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    const rating = Math.round(stats[0].averageRating * 10) / 10;
    const reviewCount = stats[0].reviewCount;
    await Product.findByIdAndUpdate(prodObjId, { rating, reviewCount });
  } else {
    await Product.findByIdAndUpdate(prodObjId, { rating: 0, reviewCount: 0 });
  }
};

export const reviewService = {
  /**
   * Get all reviews for a product
   */
  async getProductReviews(productId) {
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar role')
      .sort({ createdAt: -1 })
      .lean();

    return reviews;
  },

  /**
   * Create a review for a product
   */
  async createReview({ userId, productId, rating, title, comment }) {
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      throw new Error('You have already submitted a review for this product');
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim()
    });

    await recalculateProductRating(productId);
    await review.populate('user', 'name avatar role');

    return review;
  },

  /**
   * Update an existing review
   */
  async updateReview({ reviewId, userId, rating, title, comment }) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.user.toString() !== userId.toString()) {
      throw new Error('Forbidden: You can only edit your own reviews');
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();
    await recalculateProductRating(review.product);
    await review.populate('user', 'name avatar role');

    return review;
  },

  /**
   * Delete a review
   */
  async deleteReview({ reviewId, userId, userRole }) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.user.toString() !== userId.toString() && userRole !== 'ADMIN') {
      throw new Error('Forbidden: You can only delete your own reviews');
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);
    await recalculateProductRating(productId);

    return { productId };
  }
};

export default reviewService;
