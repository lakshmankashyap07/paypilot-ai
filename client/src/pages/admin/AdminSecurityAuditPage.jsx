import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, Lock } from 'lucide-react';

export const AdminSecurityAuditPage = () => {
  const { showToast } = useToast();

  const [securityEvents, setSecurityEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getSecurityEvents(), adminService.getAuditLogs()])
      .then(([secRes, auditRes]) => {
        if (secRes?.success && secRes.data?.securityEvents) setSecurityEvents(secRes.data.securityEvents);
        if (auditRes?.success && auditRes.data?.auditLogs) setAuditLogs(auditRes.data.auditLogs);
      })
      .catch((e) => showToast(e.message || 'Failed to load security audit logs', 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  const totalEvents = securityEvents.length + auditLogs.length;
  const adminActionCount = auditLogs.length;
  const securityEventCount = securityEvents.length;

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">Security Audits</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Monitor security events, authentication activity, and administrative access audit trails.
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Logged Events</span>
            <Lock className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalEvents}</div>
          <div className="text-[11px] text-gray-500 font-medium">Audit & security records</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Admin Actions Logged</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{adminActionCount}</div>
          <div className="text-[11px] text-purple-700 font-medium">Administrative audit trail</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Security Alerts</span>
            <ShieldAlert className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-[#00875A]">{securityEventCount}</div>
          <div className="text-[11px] text-[#00875A] font-bold">System security status clean</div>
        </div>
      </div>

      {/* ADMIN ACTION AUDIT TRAIL TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-gray-100 font-black text-gray-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Administrative Action Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Admin</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Resource Target</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No administrative actions recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 text-gray-500 font-mono text-[11px]">{new Date(a.createdAt).toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-gray-900">{a.admin?.name || 'Admin'}</td>
                    <td className="p-3.5 font-bold text-purple-700">{a.action}</td>
                    <td className="p-3.5 text-gray-700">{a.resource} ({a.resourceId})</td>
                    <td className="p-3.5 text-right">
                      <span className="px-2.5 py-0.5 text-[9px] font-black rounded bg-emerald-50 text-[#00875A] border border-emerald-200">
                        {a.status || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECURITY EVENTS LOG TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-gray-100 font-black text-gray-900 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#D32F2F]" />
          <span>High-Level Security Events Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Event Type</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Target Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    Loading security events...
                  </td>
                </tr>
              ) : securityEvents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">
                    No security events logged. System clean.
                  </td>
                </tr>
              ) : (
                securityEvents.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 text-gray-500 font-mono text-[11px]">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-[#D32F2F]">{s.eventType}</td>
                    <td className="p-3.5 font-mono text-gray-600">{s.ipAddress}</td>
                    <td className="p-3.5 text-gray-800">{s.path}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminSecurityAuditPage;
