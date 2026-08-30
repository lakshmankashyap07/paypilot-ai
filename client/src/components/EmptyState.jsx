import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const EmptyState = ({
  title = 'No products found',
  message = 'We couldn\'t find any products matching your search or filters.',
  buttonText = 'Reset Search & Filters',
  onReset
}) => {
  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 text-center space-y-4 my-6 max-w-lg mx-auto shadow-sm text-xs text-[#212121]">
      <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center mx-auto">
        <Search className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">{message}</p>
      </div>

      {onReset && (
        <div className="pt-2">
          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{buttonText}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
