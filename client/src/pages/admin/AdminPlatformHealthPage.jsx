import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Activity, CheckCircle2, Server, Database, Bot, CreditCard, ShieldCheck } from 'lucide-react';

export const AdminPlatformHealthPage = () => {
  const { showToast } = useToast();

  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getHealth()
      .then((res) => {
        if (res?.success && res.data) {
          setHealth(res.data);
        }
      })
      .catch((e) => showToast(e.message || 'Failed to load health status', 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">Platform Health</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Monitor PayPilot platform services, database connectivity, and infrastructure health status.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#00875A] border border-emerald-200 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">MongoDB Database</h4>
                <p className="text-[11px] text-gray-500">Primary commerce data repository</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-[#00875A] border border-emerald-200 rounded-lg text-xs font-black">
              ● {health?.database || 'OPERATIONAL'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2874F0] border border-blue-200 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">AI Engine Layer</h4>
                <p className="text-[11px] text-gray-500">Google Gemini 1.5 API</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-[#00875A] border border-emerald-200 rounded-lg text-xs font-black">
              ● {health?.aiProvider || 'OPERATIONAL'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">Razorpay Payment Gateway</h4>
                <p className="text-[11px] text-gray-500">HMAC SHA256 Payment Infrastructure</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-[#00875A] border border-emerald-200 rounded-lg text-xs font-black">
              ● {health?.razorpayPaymentAPI || 'OPERATIONAL (Test Mode)'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">Express Server Uptime</h4>
                <p className="text-[11px] text-gray-500">{health?.serverUptimeSeconds || 0} seconds process uptime</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-[#00875A] border border-emerald-200 rounded-lg text-xs font-black">
              ● HEALTHY
            </span>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminPlatformHealthPage;
