import React, { useState } from 'react';
import { MapPin, Check, Plus, Edit2 } from 'lucide-react';
import { AddressForm } from './AddressForm';

export const CheckoutAddressSelector = ({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEditAddress
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleOpenEdit = (e, addr) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setShowAddressForm(true);
  };

  const handleFormSubmit = async (addressData) => {
    let res;
    if (editingAddress) {
      if (onEditAddress) {
        res = await onEditAddress(editingAddress._id, addressData);
      }
    } else {
      if (onAddAddress) {
        res = await onAddAddress(addressData);
      }
    }
    setShowAddressForm(false);
    return res;
  };

  if (addresses.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-gray-200 bg-white text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6" />
        </div>
        <h4 className="font-black text-gray-900 text-sm">No delivery address saved</h4>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          You need a delivery address to complete your order checkout.
        </p>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Address</span>
        </button>

        {showAddressForm && (
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleFormSubmit}
            onClose={() => setShowAddressForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs text-[#212121]">
      
      {/* Header Bar with Add Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Select Shipping Location ({addresses.length})
        </span>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2874F0] font-extrabold rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Selectable Address Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr._id;

          return (
            <div
              key={addr._id}
              onClick={() => onSelectAddress(addr._id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/60 border-2 border-[#2874F0] shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 text-xs">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 text-[9px] font-black bg-[#2874F0] text-white rounded">
                      DEFAULT
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 font-medium leading-normal">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                </p>
                <p className="text-xs text-gray-700 font-bold">
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-xs text-gray-500 font-medium">Phone: {addr.phone}</p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                {onEditAddress ? (
                  <button
                    onClick={(e) => handleOpenEdit(e, addr)}
                    className="text-xs font-bold text-[#2874F0] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                ) : (
                  <span />
                )}

                <span className={`text-[11px] font-bold ${isSelected ? 'text-[#2874F0]' : 'text-gray-400'}`}>
                  {isSelected ? 'Selected' : 'Click to select'}
                </span>
              </div>

              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#2874F0] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {showAddressForm && (
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleFormSubmit}
          onClose={() => setShowAddressForm(false)}
        />
      )}

    </div>
  );
};

export default CheckoutAddressSelector;
