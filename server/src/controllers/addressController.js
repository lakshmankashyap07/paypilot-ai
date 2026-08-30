import addressService from '../services/addressService.js';

/**
 * Get User Addresses
 * GET /api/addresses
 */
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddresses(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: { addresses }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Address
 * POST /api/addresses
 */
export const createAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone, address line 1, city, state, and postal code are required'
      });
    }

    const addresses = await addressService.createAddress(req.user._id, {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { addresses }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create address'
    });
  }
};

/**
 * Update Address
 * PUT /api/addresses/:id
 */
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addresses = await addressService.updateAddress(req.user._id, id, req.body);
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: { addresses }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update address'
    });
  }
};

/**
 * Delete Address
 * DELETE /api/addresses/:id
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addresses = await addressService.deleteAddress(req.user._id, id);
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: { addresses }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete address'
    });
  }
};

/**
 * Set Default Address
 * PATCH /api/addresses/:id/default
 */
export const setDefaultAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addresses = await addressService.setDefaultAddress(req.user._id, id);
    res.status(200).json({
      success: true,
      message: 'Default address set successfully',
      data: { addresses }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to set default address'
    });
  }
};
