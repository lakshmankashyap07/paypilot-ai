import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { getImageUrl } from '../utils/imageUtils';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export const CompareTrayBar = () => {
  const navigate = useNavigate();
  const { compareItems, compareCount, removeFromCompare, clearCompare } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5">
      <div className="bg-[#172337] text-white rounded-2xl p-3 shadow-2xl border border-gray-700 flex items-center justify-between gap-3 text-xs">
        
        {/* Left Status & Clear */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2874F0] text-white flex items-center justify-center font-bold flex-shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-white">Compare Tray ({compareCount}/4)</div>
            <div className="text-[10px] text-gray-400">
              {compareCount < 2 ? 'Select at least 2 items to compare' : 'Ready for side-by-side AI analysis'}
            </div>
          </div>
        </div>

        {/* Product Items Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {compareItems.map((item) => {
            const pId = item._id || item.id;
            const imgSrc = getImageUrl(item.thumbnail || item.images?.[0] || item.imageUrl || item.image);

            return (
              <div
                key={pId}
                className="relative group w-10 h-10 rounded-lg bg-white p-1 border border-gray-600 flex-shrink-0 flex items-center justify-center"
              >
                <img src={imgSrc} alt={item.name} className="w-full h-full object-contain" />
                <button
                  onClick={() => removeFromCompare(pId)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                  title="Remove item"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="p-2 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Clear all comparison items"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/compare')}
            disabled={compareCount < 2}
            className={`px-4 py-2 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all ${
              compareCount >= 2
                ? 'bg-[#FF9F00] hover:bg-amber-600 text-white cursor-pointer'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompareTrayBar;
