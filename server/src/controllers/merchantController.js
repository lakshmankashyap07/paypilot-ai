import merchantService from '../services/merchantService.js';

/**
 * Register New Merchant Account
 * POST /api/merchant/register
 * Public Onboarding Endpoint
 */
export const registerMerchant = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      storeName,
      category,
      description,
      businessEmail,
      businessPhone,
      address,
      city,
      state,
      pincode,
      password,
      confirmPassword
    } = req.body;

    if (!fullName || !email || !phone || !storeName || !category || !address || !city || !state || !pincode || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required merchant registration fields'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const result = await merchantService.registerMerchant({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      storeName: storeName.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      businessEmail: businessEmail ? businessEmail.toLowerCase().trim() : email.toLowerCase().trim(),
      businessPhone: businessPhone ? businessPhone.trim() : phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      password
    });

    res.status(201).json({
      success: true,
      message: 'Merchant account registered successfully. Your merchant account is pending approval.',
      data: result
    });
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }
    next(error);
  }
};

/**
 * Get Merchant Analytics Dashboard Statistics
 * GET /api/merchant/dashboard
 */
export const getMerchantDashboard = async (req, res, next) => {
  try {
    const stats = await merchantService.getMerchantDashboard(req.user._id, req.user.role);
    res.status(200).json({
      success: true,
      message: 'Merchant dashboard stats fetched successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Merchant Products
 * GET /api/merchant/products
 */
export const getMerchantProducts = async (req, res, next) => {
  try {
    const result = await merchantService.getMerchantProducts(
      req.user._id,
      req.user.role,
      req.query
    );
    res.status(200).json({
      success: true,
      message: 'Merchant products fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Product
 * POST /api/merchant/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await merchantService.createProduct(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
};

/**
 * Update Product
 * PUT /api/merchant/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await merchantService.updateProduct(
      req.user._id,
      id,
      req.user.role,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product'
    });
  }
};

/**
 * Fast Update Stock
 * PATCH /api/merchant/products/:id/stock
 */
export const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = await merchantService.updateProductStock(
      req.user._id,
      id,
      req.user.role,
      stock
    );
    res.status(200).json({
      success: true,
      message: 'Product stock updated',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update stock'
    });
  }
};

/**
 * Fast Update Active Status
 * PATCH /api/merchant/products/:id/status
 */
export const updateProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const product = await merchantService.updateProductStatus(
      req.user._id,
      id,
      req.user.role,
      active
    );
    res.status(200).json({
      success: true,
      message: 'Product status updated',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product status'
    });
  }
};

/**
 * Delete Product
 * DELETE /api/merchant/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await merchantService.deleteProduct(req.user._id, id, req.user.role);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete product'
    });
  }
};

/**
 * Get Merchant Orders
 * GET /api/merchant/orders
 */
export const getMerchantOrders = async (req, res, next) => {
  try {
    const result = await merchantService.getMerchantOrders(
      req.user._id,
      req.user.role,
      req.query
    );
    res.status(200).json({
      success: true,
      message: 'Merchant orders fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Order Status
 * PATCH /api/merchant/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'orderStatus is required'
      });
    }

    const order = await merchantService.updateOrderStatus(
      req.user._id,
      id,
      req.user.role,
      orderStatus
    );

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update order status'
    });
  }
};

/**
 * Get Merchant Payments
 * GET /api/merchant/payments
 */
export const getMerchantPayments = async (req, res, next) => {
  try {
    const result = await merchantService.getMerchantPayments(
      req.user._id,
      req.user.role,
      req.query
    );
    res.status(200).json({
      success: true,
      message: 'Merchant payments fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Merchant Payment
 * GET /api/merchant/payments/:id
 */
export const getMerchantPaymentById = async (req, res, next) => {
  try {
    const payment = await merchantService.getMerchantPaymentById(
      req.user._id,
      req.user.role,
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};
