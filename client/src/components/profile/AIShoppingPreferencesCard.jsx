import React, { useState, useEffect } from 'react';
import { Sliders, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import personalizationService from '../../services/personalizationService';
import { useToast } from '../../context/ToastContext';

export const AIShoppingPreferencesCard = () => {
  const { showToast } = useToast();

  const [priorities, setPriorities] = useState({
    lowestPrice: true,
    bestQuality: true,
    fastDelivery: false,
    highestRating: true
  });

  const [maxBudget, setMaxBudget] = useState(50000);
  const [categories, setCategories] = useState(['Electronics', 'Fashion']);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPref = async () => {
      try {
        const res = await personalizationService.getPreferences();
        if (res && res.success && res.data?.preferences) {
          const pref = res.data.preferences;
          if (pref.categories?.length > 0) setCategories(pref.categories);
          if (pref.maxBudget) setMaxBudget(pref.maxBudget);
        }
      } catch (err) {
        console.warn('Failed to load personalization preferences:', err.message);
      }
    };

    fetchPref();
  }, []);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const togglePriority = (key) => {
    setPriorities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await personalizationService.updatePreferences({
        categories,
        maxBudget,
        priorities
      });
      showToast('AI Shopping Preferences saved!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-5 text-xs text-gray-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>My AI Shopping Preferences</span>
          </h2>
          <p className="text-xs text-gray-500">Configure priorities & budget to customize AI recommendations</p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-100 rounded-full">
          AI ENGINE
        </span>
      </div>

      {/* Shopping Priorities Checkboxes */}
      <div className="space-y-2">
        <label className="block font-black text-gray-800 uppercase tracking-wider text-[11px]">
          Shopping Priorities
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { key: 'lowestPrice', label: '🏷️ Lowest Price' },
            { key: 'bestQuality', label: '⭐ Best Quality' },
            { key: 'fastDelivery', label: '🚀 Fast Delivery' },
            { key: 'highestRating', label: '🏆 Highest Rating' }
          ].map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => togglePriority(p.key)}
              className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                priorities[p.key]
                  ? 'bg-purple-50/80 border-purple-300 text-purple-950 shadow-2xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <span>{p.label}</span>
              {priorities[p.key] && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range Slider */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="block font-black text-gray-800 uppercase tracking-wider text-[11px]">
            Target Budget Limit (₹)
          </label>
          <span className="font-black text-purple-700 text-sm">₹{maxBudget.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="5000"
          max="200000"
          step="5000"
          value={maxBudget}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          className="w-full accent-purple-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
          <span>₹5,000</span>
          <span>₹100,000</span>
          <span>₹200,000+</span>
        </div>
      </div>

      {/* Preferred Categories */}
      <div className="space-y-2 pt-1">
        <label className="block font-black text-gray-800 uppercase tracking-wider text-[11px]">
          Preferred Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Headphones', 'Laptops'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                categories.includes(cat)
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Save Preferences</span>
        </button>
      </div>

    </div>
  );
};

export default AIShoppingPreferencesCard;
