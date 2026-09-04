import React, { useState } from 'react';
import { Lock, ShieldCheck, Download, Trash2, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PrivacyCenterSection = () => {
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    aiPersonalization: true,
    recommendationTracking: true,
    marketingEmails: false,
    orderSMS: true
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Privacy setting updated`, 'info');
      return updated;
    });
  };

  const handleExportData = () => {
    showToast('Preparing your account data export archive...', 'info');
    setTimeout(() => {
      showToast('Account data exported successfully!', 'success');
    }, 1500);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    showToast('Account deletion requests are reviewed by PayPilot Compliance. Contact support@paypilot.demo for immediate processing.', 'info');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6 text-xs text-gray-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>PayPilot Privacy Center</span>
          </h2>
          <p className="text-xs text-gray-500">Manage data privacy, AI personalization, and data export options</p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
          PRIVACY CONTROLS
        </span>
      </div>

      {/* AI Personalization & Toggles */}
      <div className="space-y-3">
        <span className="font-extrabold text-xs text-gray-900 uppercase tracking-wider block">
          AI & Recommendation Controls
        </span>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-gray-50/40">
          
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-gray-900">AI Personalization Engine</div>
              <div className="text-[11px] text-gray-500">Allow PayPilot AI to customize product feeds & payment recommendations</div>
            </div>
            <input
              type="checkbox"
              checked={settings.aiPersonalization}
              onChange={() => toggleSetting('aiPersonalization')}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-gray-900">Browsing History Personalization</div>
              <div className="text-[11px] text-gray-500">Use viewed categories to recommend next purchases</div>
            </div>
            <input
              type="checkbox"
              checked={settings.recommendationTracking}
              onChange={() => toggleSetting('recommendationTracking')}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-gray-900">Order Updates & SMS Notifications</div>
              <div className="text-[11px] text-gray-500">Receive real-time order tracking updates via SMS</div>
            </div>
            <input
              type="checkbox"
              checked={settings.orderSMS}
              onChange={() => toggleSetting('orderSMS')}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Data Export & Account Closure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        
        {/* Export Data */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#2874F0]" />
              <span>Download My Data</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Export your complete order history, saved addresses, and profile data in JSON/CSV format.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            className="self-start px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            Request Export Archive
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="font-extrabold text-rose-900 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete PayPilot Account</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-snug">
              Permanently close your account, wipe saved addresses, and anonymize order logs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="self-start px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer"
          >
            Delete Account
          </button>
        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200 text-xs">
            <div className="flex items-center gap-2 text-rose-600 font-black text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Delete PayPilot Account?</span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              This action is permanent. All saved wallet credits, points, and delivery addresses will be wiped out.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl"
              >
                Request Deletion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PrivacyCenterSection;
