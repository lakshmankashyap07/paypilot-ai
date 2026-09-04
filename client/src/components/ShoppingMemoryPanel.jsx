import React, { useState } from 'react';
import { Brain, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import agenticCommerceService from '../services/agenticCommerceService';
import { useToast } from '../context/ToastContext';

export const ShoppingMemoryPanel = ({ userPreferences = null, onMemoryReset }) => {
  const { showToast } = useToast();
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset your AI shopping memory and category preferences?')) return;

    try {
      setClearing(true);
      await agenticCommerceService.resetShoppingMemory();
      setCleared(true);
      showToast('AI shopping preferences reset successfully', 'info');
      if (onMemoryReset) onMemoryReset();
    } catch (err) {
      showToast(err.message || 'Failed to reset preferences', 'error');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="bg-white border border-[#E0E6ED] rounded-xl p-5 shadow-xs space-y-4 text-xs text-[#172337]">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-gray-900">AI Shopping Memory & Preferences</h4>
            <p className="text-[11px] text-gray-500">
              Learned category & brand interests used to tailor your search & feed
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={clearing || cleared}
          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#D32F2F] font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{cleared ? 'Memory Reset' : 'Reset AI Memory'}</span>
        </button>
      </div>

      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
        <div className="font-bold text-gray-700">Active Preference Controls:</div>
        <p className="text-gray-600 text-[11px] leading-relaxed">
          Your AI shopping agent automatically records categories, brands, and search keywords you interact with to present personalized recommendations. You can reset your memory profile anytime.
        </p>
      </div>
    </div>
  );
};

export default ShoppingMemoryPanel;
