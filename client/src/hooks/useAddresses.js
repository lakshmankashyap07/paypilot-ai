import { useState, useEffect, useCallback } from 'react';
import addressService from '../services/addressService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useAddresses = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      const res = await addressService.getAddresses();
      if (res && res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.message || 'Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (addressData) => {
    try {
      const res = await addressService.createAddress(addressData);
      if (res && res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
        showToast('Address added successfully', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add address', 'error');
    }
    return false;
  };

  const editAddress = async (addressId, addressData) => {
    try {
      const res = await addressService.updateAddress(addressId, addressData);
      if (res && res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
        showToast('Address updated successfully', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to update address', 'error');
    }
    return false;
  };

  const removeAddress = async (addressId) => {
    try {
      const res = await addressService.deleteAddress(addressId);
      if (res && res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
        showToast('Address deleted', 'info');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete address', 'error');
    }
    return false;
  };

  const makeDefault = async (addressId) => {
    try {
      const res = await addressService.setDefaultAddress(addressId);
      if (res && res.success && res.data?.addresses) {
        setAddresses(res.data.addresses);
        showToast('Default address updated', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to set default address', 'error');
    }
    return false;
  };

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  return {
    addresses,
    defaultAddress,
    isLoading,
    isError,
    errorMessage,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
    refetch: fetchAddresses
  };
};

export default useAddresses;
