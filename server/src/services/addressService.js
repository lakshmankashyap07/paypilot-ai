import Address from '../models/Address.js';

export const addressService = {
  /**
   * Get all addresses for a user (default address first)
   */
  async getAddresses(userId) {
    return await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  },

  /**
   * Create a new address for a user
   */
  async createAddress(userId, addressData) {
    const count = await Address.countDocuments({ user: userId });
    const shouldBeDefault = count === 0 || addressData.isDefault === true;

    if (shouldBeDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    await Address.create({
      ...addressData,
      user: userId,
      isDefault: shouldBeDefault
    });

    return await this.getAddresses(userId);
  },

  /**
   * Update an existing address
   */
  async updateAddress(userId, addressId, addressData) {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      throw new Error('Address not found');
    }

    if (addressData.isDefault === true && !address.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    Object.assign(address, addressData);
    await address.save();

    return await this.getAddresses(userId);
  },

  /**
   * Delete an address
   */
  async deleteAddress(userId, addressId) {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      throw new Error('Address not found');
    }

    const wasDefault = address.isDefault;
    await Address.findByIdAndDelete(addressId);

    // If deleted address was default, promote first remaining address to default
    if (wasDefault) {
      const firstRemaining = await Address.findOne({ user: userId }).sort({ createdAt: -1 });
      if (firstRemaining) {
        firstRemaining.isDefault = true;
        await firstRemaining.save();
      }
    }

    return await this.getAddresses(userId);
  },

  /**
   * Set an address as the default address
   */
  async setDefaultAddress(userId, addressId) {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      throw new Error('Address not found');
    }

    await Address.updateMany({ user: userId }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    return await this.getAddresses(userId);
  }
};

export default addressService;
