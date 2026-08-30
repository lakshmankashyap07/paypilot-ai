import adminService from '../services/adminService.js';

export const getDashboardOverview = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardOverview();
    res.status(200).json({ success: true, message: 'Admin dashboard overview fetched successfully', data });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsers(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await adminService.updateUserStatus(req.user._id, req.params.id, req.body.active);
    res.status(200).json({ success: true, message: 'User status updated successfully', data: { user } });
  } catch (err) {
    next(err);
  }
};

export const getMerchants = async (req, res, next) => {
  try {
    const data = await adminService.getMerchants(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateMerchantStatus = async (req, res, next) => {
  try {
    const status = req.body.status !== undefined ? req.body.status : req.body.active;
    const merchant = await adminService.updateMerchantStatus(req.user._id, req.params.id, status);
    res.status(200).json({ success: true, message: 'Merchant status updated successfully', data: { merchant } });
  } catch (err) {
    next(err);
  }
};

export const approveMerchant = async (req, res, next) => {
  try {
    const merchant = await adminService.updateMerchantStatus(req.user._id, req.params.id, 'APPROVED');
    res.status(200).json({ success: true, message: 'Merchant approved successfully', data: { merchant } });
  } catch (err) {
    next(err);
  }
};

export const rejectMerchant = async (req, res, next) => {
  try {
    const merchant = await adminService.updateMerchantStatus(req.user._id, req.params.id, 'REJECTED');
    res.status(200).json({ success: true, message: 'Merchant application rejected successfully', data: { merchant } });
  } catch (err) {
    next(err);
  }
};

export const suspendMerchant = async (req, res, next) => {
  try {
    const merchant = await adminService.updateMerchantStatus(req.user._id, req.params.id, 'SUSPENDED');
    res.status(200).json({ success: true, message: 'Merchant account suspended successfully', data: { merchant } });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const data = await adminService.getProducts(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateProductStatus = async (req, res, next) => {
  try {
    const product = await adminService.updateProductStatus(req.user._id, req.params.id, req.body.active);
    res.status(200).json({ success: true, message: 'Product status updated successfully', data: { product } });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const data = await adminService.getOrders(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getAIObservability = async (req, res, next) => {
  try {
    const data = await adminService.getAIObservability(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getSecurityEvents = async (req, res, next) => {
  try {
    const data = await adminService.getSecurityEvents();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogs();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getSystemHealth = async (req, res, next) => {
  try {
    const data = await adminService.getSystemHealth();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
