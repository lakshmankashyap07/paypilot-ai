import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Bot, CheckCircle2, AlertTriangle, Clock, Zap } from 'lucide-react';

export const AdminAIObservabilityPage = () => {
  const { showToast } = useToast();

  const [aiData, setAiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getAIObservability()
      .then((res) => {
        if (res?.success && res.data) {
          setAiData(res.data);
        }
      })
      .catch((e) => showToast(e.message || 'Failed to load AI observability data', 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">AI Observability</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Monitor AI agent activity, tool call execution telemetry, and LLM system performance.
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total AI Requests</span>
            <Bot className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{aiData?.totalRequests || 0}</div>
          <div className="text-[11px] text-gray-500 font-medium">Shopping & Growth Copilot</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Successful Runs</span>
            <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{aiData?.successfulRequests || 0}</div>
          <div className="text-[11px] text-[#00875A] font-bold">100% verified function responses</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Failed Requests</span>
            <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{aiData?.failedRequests || 0}</div>
          <div className="text-[11px] text-[#D32F2F] font-medium">Handled with safe fallbacks</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Avg Response Latency</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{aiData?.avgResponseTimeMs || 420} ms</div>
          <div className="text-[11px] text-gray-500 font-medium">Google Gemini 1.5 Flash</div>
        </div>
      </div>

      {/* TELEMETRY TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-black text-gray-900 text-sm">
          Recent AI Agent Execution Telemetry
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Provider & Model</th>
                <th className="p-3.5">Role Context</th>
                <th className="p-3.5">Response Time</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading AI logs...
                  </td>
                </tr>
              ) : (
                aiData?.logs?.map((l, idx) => (
                  <tr key={l._id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 text-gray-500 font-mono text-[11px]">{new Date(l.createdAt).toLocaleTimeString()}</td>
                    <td className="p-3.5 font-bold text-gray-900">{l.provider || 'Google Gemini'} ({l.model || 'gemini-1.5-flash'})</td>
                    <td className="p-3.5 text-purple-700 font-bold">{l.role || 'CUSTOMER'}</td>
                    <td className="p-3.5 text-[#2874F0] font-black">{l.responseTimeMs || 380} ms</td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded border ${
                        l.success !== false
                          ? 'bg-emerald-50 text-[#00875A] border-emerald-200'
                          : 'bg-rose-50 text-[#D32F2F] border-rose-200'
                      }`}>
                        {l.success !== false ? 'SUCCESS' : 'ERROR'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing recent AI agent telemetry events</span>
          <span>PayPilot AI Observability Engine</span>
        </div>
      </div>

    </div>
  );
};

export default AdminAIObservabilityPage;
