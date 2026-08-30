import wishlistService from '../services/wishlistService.js';

/**
 * Get User's Wishlist
 * GET /api/wishlist
 */
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add Product to Wishlist
 * POST /api/wishlist/:productId
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await wishlistService.addToWishlist(req.user._id, productId);
    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlist }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add product to wishlist'
    });
  }
};

/**
 * Remove Product from Wishlist
 * DELETE /api/wishlist/:productId
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await wishlistService.removeFromWishlist(req.user._id, productId);
    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear Wishlist
 * DELETE /api/wishlist
 */
export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.clearWishlist(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: { wishlist }
    });
  } catch (error) {
    next(error);
  }
};
