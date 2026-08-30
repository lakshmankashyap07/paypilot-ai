import React from 'react';
import { MapPin, Phone, Check, Edit2, Trash2, Star } from 'lucide-react';

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  if (!address) return null;

  const {
    _id,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country = 'India',
    isDefault
  } = address;

  return (
    <div
      className={`p-4 rounded-xl border transition-all space-y-2 text-xs text-[#212121] ${
        isDefault
          ? 'bg-blue-50/60 border-[#2874F0] shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2874F0]" />
          <h4 className="font-bold text-gray-900 text-xs">{fullName}</h4>
          {isDefault && (
            <span className="px-2 py-0.5 text-[9px] font-black bg-[#2874F0] text-white rounded flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-white text-white" />
              DEFAULT
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(address)}
              className="p-1 text-gray-500 hover:text-[#2874F0] transition-colors"
              title="Edit address"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(_id)}
              className="p-1 text-gray-500 hover:text-[#D32F2F] transition-colors"
              title="Delete address"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Address lines */}
      <div className="text-xs text-gray-600 leading-normal pl-6 space-y-0.5">
        <p>{addressLine1}</p>
        {addressLine2 && <p>{addressLine2}</p>}
        <p>
          {city}, {state} - <strong className="text-gray-900">{postalCode}</strong>
        </p>
        <p className="text-gray-400">{country}</p>

        <div className="flex items-center gap-1 pt-1 text-gray-500 font-medium">
          <Phone className="w-3 h-3 text-[#2874F0]" />
          <span>{phone}</span>
        </div>
      </div>

      {/* Set Default Button */}
      {!isDefault && onSetDefault && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => onSetDefault(_id)}
            className="text-xs font-bold text-[#2874F0] hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Set as Default Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
