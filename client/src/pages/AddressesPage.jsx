import React, { useState } from 'react';
import { useAddresses } from '../hooks/useAddresses';
import { AddressCard } from '../components/AddressCard';
import { AddressForm } from '../components/AddressForm';
import { MapPin, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AddressesPage = () => {
  const { addresses, isLoading, addAddress, editAddress, removeAddress, makeDefault } =
    useAddresses();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (addressData) => {
    if (editingAddress) {
      return await editAddress(editingAddress._id, addressData);
    } else {
      return await addAddress(addressData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/profile" className="text-slate-400 hover:text-teal-400">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-extrabold text-black flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-indigo-400" />
              Saved Shipping Addresses
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-black pl-6">
            Manage your saved delivery addresses for fast agentic checkout
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="glass-panel p-10 text-center rounded-3xl border border-slate-800 space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 flex items-center justify-center mx-auto">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No saved addresses</h3>
            <p className="text-xs text-slate-400">
              Add your delivery address to enable one-click checkout.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20"
          >
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              onEdit={handleOpenEdit}
              onDelete={removeAddress}
              onSetDefault={makeDefault}
            />
          ))}
        </div>
      )}

      {/* Address Modal */}
      {formModalOpen && (
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleFormSubmit}
          onClose={() => setFormModalOpen(false)}
        />
      )}

    </div>
  );
};

export default AddressesPage;
