import cartService from '../services/cartService.js';

/**
 * Get User Cart
 * GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add Item to Cart
 * POST /api/cart/items
 */
export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const cart = await cartService.addItem(req.user._id, productId, quantity || 1);
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add item to cart'
    });
  }
};

/**
 * Update Cart Item Quantity
 * PUT /api/cart/items/:productId
 */
export const updateItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    const cart = await cartService.updateItemQuantity(req.user._id, productId, quantity);
    res.status(200).json({
      success: true,
      message: 'Cart quantity updated',
      data: { cart }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update item quantity'
    });
  }
};

/**
 * Remove Item from Cart
 * DELETE /api/cart/items/:productId
 */
export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItem(req.user._id, productId);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear Cart
 * DELETE /api/cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validate Cart Items & Pricing
 * POST /api/cart/validate
 */
export const validateCart = async (req, res, next) => {
  try {
    const result = await cartService.validateCart(req.user._id);
    res.status(200).json({
      success: true,
      message: result.isValid ? 'Cart is valid' : 'Cart validation completed with warnings',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
