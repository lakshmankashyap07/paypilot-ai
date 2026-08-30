import analyticsService from '../services/analytics/analyticsService.js';

export const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Overview fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getSalesAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getSalesAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Sales analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getOrderAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getOrderAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Order analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getProductAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getProductAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Product analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getCustomerAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCustomerAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Customer analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getPaymentAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getPaymentAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Payment analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getFunnelAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getFunnelAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Funnel analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getSearchAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getSearchAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Search analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getCategoryAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCategoryAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Category analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getInventoryAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getInventoryAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Inventory analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getCartAbandonmentAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCartAbandonmentAnalytics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'Cart abandonment analytics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getAIMetrics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAIMetrics(req.user._id, req.user.role, req.query);
    res.status(200).json({ success: true, message: 'AI metrics fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (req, res, next) => {
  try {
    const type = req.query.type || 'sales';
    const csvContent = await analyticsService.exportCSV(req.user._id, req.user.role, type, req.query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=merchant_${type}_export.csv`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
