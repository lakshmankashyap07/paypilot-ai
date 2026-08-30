import reviewService from '../services/reviewService.js';

/**
 * Get Product Reviews
 * GET /api/products/:productId/reviews
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getProductReviews(productId);

    res.status(200).json({
      success: true,
      message: 'Product reviews fetched successfully',
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Review for Product
 * POST /api/products/:productId/reviews
 */
export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating, title, and comment are required'
      });
    }

    const review = await reviewService.createReview({
      userId: req.user._id,
      productId,
      rating,
      title,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create review'
    });
  }
};

/**
 * Update Review
 * PUT /api/reviews/:id
 */
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const review = await reviewService.updateReview({
      reviewId: id,
      userId: req.user._id,
      rating,
      title,
      comment
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update review'
    });
  }
};

/**
 * Delete Review
 * DELETE /api/reviews/:id
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    await reviewService.deleteReview({
      reviewId: id,
      userId: req.user._id,
      userRole: req.user.role
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete review'
    });
  }
};
