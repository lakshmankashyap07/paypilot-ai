import api from './api';

export const addressService = {
  /**
   * Fetch authenticated user's addresses
   */
  async getAddresses() {
    const response = await api.get('/addresses');
    return response;
  },

  /**
   * Create a new address
   */
  async createAddress(addressData) {
    const response = await api.post('/addresses', addressData);
    return response;
  },

  /**
   * Update an address
   */
  async updateAddress(addressId, addressData) {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response;
  },

  /**
   * Delete an address
   */
  async deleteAddress(addressId) {
    const response = await api.delete(`/addresses/${addressId}`);
    return response;
  },

  /**
   * Set an address as default
   */
  async setDefaultAddress(addressId) {
    const response = await api.patch(`/addresses/${addressId}/default`);
    return response;
  }
};

export default addressService;
