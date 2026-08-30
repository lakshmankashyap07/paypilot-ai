import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';

export const FilterSidebar = ({
  brands = [],
  selectedBrand = '',
  minPrice = '',
  maxPrice = '',
  selectedRating = '',
  inStock = false,
  featured = false,
  onChange,
  onReset
}) => {
  const ratings = [4, 3, 2];

  const hasActiveFilters =
    Boolean(selectedBrand) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    Boolean(selectedRating) ||
    inStock ||
    featured;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5 text-xs text-[#212121]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-[#2874F0]" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[#D32F2F] hover:underline flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min (₹)"
            value={minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
          />
          <input
            type="number"
            placeholder="Max (₹)"
            value={maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
          />
        </div>
      </div>

      {/* Brand Selection */}
      {brands.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Brand
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onChange('brand', '')}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                !selectedBrand ? 'bg-blue-50 text-[#2874F0] font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>All Brands</span>
              {!selectedBrand && <Check className="w-3.5 h-3.5 text-[#2874F0]" />}
            </button>

            {brands.map((b) => {
              const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
              return (
                <button
                  key={b}
                  onClick={() => onChange('brand', isSelected ? '' : b)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-blue-50 text-[#2874F0] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{b}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2874F0]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Rating
        </label>
        <div className="space-y-1">
          {ratings.map((r) => {
            const isSelected = String(selectedRating) === String(r);
            return (
              <button
                key={r}
                onClick={() => onChange('rating', isSelected ? '' : r)}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  isSelected ? 'bg-amber-50 text-amber-900 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < r ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span>{r}★ & above</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <label className="flex items-center justify-between text-xs text-gray-700 font-semibold cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onChange('inStock', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#2874F0] focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-gray-700 font-semibold cursor-pointer">
          <span>Featured Items</span>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => onChange('featured', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#2874F0] focus:ring-0"
          />
        </label>
      </div>

    </div>
  );
};

export default FilterSidebar;
