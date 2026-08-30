import orderService from '../services/orderService.js';

/**
 * Validate Checkout State & Recalculate Totals
 * POST /api/orders/validate-checkout
 */
export const validateCheckout = async (req, res, next) => {
  try {
    const { shippingAddressId, billingAddressId } = req.body;
    const result = await orderService.validateCheckout(req.user._id, {
      shippingAddressId,
      billingAddressId
    });

    res.status(200).json({
      success: true,
      message: 'Checkout validation successful',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Checkout validation failed'
    });
  }
};

/**
 * Create Order & Deduct Inventory
 * POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddressId, billingAddressId, notes } = req.body;
    const order = await orderService.createOrder(req.user._id, {
      shippingAddressId,
      billingAddressId,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

/**
 * Get Customer Order History
 * GET /api/orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Customer Order Details by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(req.user._id, id, req.user.role);
    res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      data: { order }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Order not found'
    });
  }
};

/**
 * Cancel Customer Order & Restore Inventory
 * PATCH /api/orders/:id/cancel
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.cancelOrder(req.user._id, id);
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel order'
    });
  }
};
