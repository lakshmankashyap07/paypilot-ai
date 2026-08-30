import React, { useState, useEffect } from 'react';
import personalizationService from '../services/personalizationService';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Shield,
  RotateCcw,
  CheckCircle2,
  Lock,
  Tag,
  Loader2
} from 'lucide-react';

export const PersonalizationPreferencesPage = () => {
  const { showToast } = useToast();

  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrefs = async () => {
    try {
      setIsLoading(true);
      const res = await personalizationService.getPreferences();
      if (res?.success && res.data?.preferences) {
        setPreferences(res.data.preferences);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load preferences', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefs();
  }, []);

  const handleToggle = async () => {
    if (!preferences) return;
    const newStatus = !preferences.personalizationEnabled;
    try {
      const res = await personalizationService.togglePersonalization(newStatus);
      if (res?.success) {
        setPreferences(res.data.preferences);
        showToast(`Personalization ${newStatus ? 'enabled' : 'disabled'}`, 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update setting', 'error');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all recommendation interests to default? (This will not delete your order history)')) return;
    try {
      const res = await personalizationService.resetPreferences();
      if (res?.success) {
        setPreferences(res.data.preferences);
        showToast('Personalization interests reset to default', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to reset preferences', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs text-[#172337]">
      
      {/* 1. PAGE HERO HEADER */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172337]">
            Recommendation Controls
          </h1>
          <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#2874F0] text-white rounded uppercase tracking-wider">
            PRIVACY & PREFERENCES
          </span>
        </div>
        <p className="text-xs text-[#5F6B76] max-w-2xl leading-relaxed">
          Control how PayPilot uses your shopping activity to personalize product recommendations.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-white border border-[#E0E6ED] animate-pulse"></div>
          <div className="h-48 rounded-xl bg-white border border-[#E0E6ED] animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 2. PERSONALIZATION CONTROL CARD */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2874F0] border border-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#172337]">Personalized Recommendations</h3>
                <p className="text-xs text-[#5F6B76] leading-relaxed max-w-xl">
                  When enabled, PayPilot uses your viewed products, wishlist, and cart history to tailor product rankings. When disabled, generic catalog recommendations are shown.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggle}
              className={`px-5 py-2.5 font-black rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                preferences?.personalizationEnabled
                  ? 'bg-[#00875A] text-white hover:bg-emerald-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {preferences?.personalizationEnabled ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Disabled</span>
                </>
              )}
            </button>
          </div>

          {/* 3. INTERESTS & PREFERENCES SUMMARY CARD */}
          <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs space-y-6">
            
            {/* Summary Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E6ED] flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFCA28]" />
                <h3 className="font-extrabold text-[#172337] text-sm uppercase tracking-wider">
                  Your Inferred Shopping Interests
                </h3>
              </div>

              {/* Reset Personalization Button */}
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-[#172337] hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Personalization</span>
              </button>
            </div>

            {/* 2-Column Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Top Preferred Categories */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5F6B76] uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-[#2874F0]" />
                  <span>TOP PREFERRED CATEGORIES</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {preferences?.preferredCategories?.length > 0 ? (
                    preferences.preferredCategories.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 border border-blue-100 text-[#2874F0] rounded-full text-xs font-bold"
                      >
                        {c.category || c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No category preferences recorded yet</span>
                  )}
                </div>
              </div>

              {/* Preferred Brands */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5F6B76] uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-[#2874F0]" />
                  <span>PREFERRED BRANDS</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {preferences?.preferredBrands?.length > 0 ? (
                    preferences.preferredBrands.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded-full text-xs font-bold"
                      >
                        {b.brand || b}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No brand preferences recorded yet</span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default PersonalizationPreferencesPage;
