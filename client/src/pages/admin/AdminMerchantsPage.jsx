import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Store, CheckCircle2, XCircle, ShieldAlert, Search, Clock, AlertTriangle } from 'lucide-react';

export const AdminMerchantsPage = () => {
  const { showToast } = useToast();

  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchMerchants = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getMerchants();
      if (res?.success && res.data?.merchants) {
        setMerchants(res.data.merchants);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load merchants', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveMerchant(id);
      showToast('Merchant approved successfully!', 'success');
      fetchMerchants();
    } catch (err) {
      showToast(err.message || 'Failed to approve merchant', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectMerchant(id);
      showToast('Merchant application rejected', 'info');
      fetchMerchants();
    } catch (err) {
      showToast(err.message || 'Failed to reject merchant', 'error');
    }
  };

  const handleSuspend = async (id) => {
    try {
      await adminService.suspendMerchant(id);
      showToast('Merchant account suspended', 'error');
      fetchMerchants();
    } catch (err) {
      showToast(err.message || 'Failed to suspend merchant', 'error');
    }
  };

  // Filtered merchants
  const filteredMerchants = merchants.filter((m) => {
    const status = (m.merchantStatus || (m.active !== false ? 'APPROVED' : 'SUSPENDED')).toUpperCase();
    const matchesSearch =
      !searchQuery ||
      m.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = merchants.length;
  const approvedCount = merchants.filter(m => (m.merchantStatus || (m.active !== false ? 'APPROVED' : 'SUSPENDED')).toUpperCase() === 'APPROVED').length;
  const pendingCount = merchants.filter(m => (m.merchantStatus || '').toUpperCase() === 'PENDING').length;
  const suspendedCount = merchants.filter(m => (m.merchantStatus || (m.active !== false ? 'APPROVED' : 'SUSPENDED')).toUpperCase() === 'SUSPENDED').length;

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">Registered Merchants</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Review merchant applications, approve stores, and manage marketplace seller status.
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Merchants</span>
            <Store className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Registered seller stores</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Active & Approved</span>
            <CheckCircle2 className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{approvedCount}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Authorized marketplace sellers</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Pending Approval</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting admin verification</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Suspended / Restricted</span>
            <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{suspendedCount}</div>
          <div className="text-[11px] text-[#D32F2F] font-medium">Disabled merchant stores</div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchants by store name, owner, email..."
            className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
        >
          <option value="ALL">All Merchant Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* MERCHANTS TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">Store & Owner</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading merchant accounts...
                  </td>
                </tr>
              ) : filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No merchants found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((m) => {
                  const status = (m.merchantStatus || (m.active !== false ? 'APPROVED' : 'SUSPENDED')).toUpperCase();
                  const isPending = status === 'PENDING';
                  const isApproved = status === 'APPROVED';
                  const isRejected = status === 'REJECTED';
                  const isSuspended = status === 'SUSPENDED';

                  return (
                    <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          <Store className="w-4 h-4 text-[#2874F0]" />
                          <span>{m.storeName || m.name}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 pl-6">Owner: {m.name}</div>
                      </td>

                      <td className="p-3.5 text-gray-600 font-mono text-[11px]">
                        {m.email}
                      </td>

                      <td className="p-3.5 font-medium text-gray-700">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] border border-gray-200">
                          {m.category || 'General'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 text-[9px] font-black rounded border ${
                            isApproved
                              ? 'bg-emerald-50 text-[#00875A] border-emerald-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-900 border-amber-200 animate-pulse'
                              : isRejected
                              ? 'bg-gray-100 text-gray-600 border-gray-300'
                              : 'bg-rose-50 text-[#D32F2F] border-rose-200'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isApproved && (
                            <button
                              onClick={() => handleApprove(m._id)}
                              className="px-3 py-1 bg-[#00875A] hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {!isRejected && (
                            <button
                              onClick={() => handleReject(m._id)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-[11px] font-bold flex items-center gap-1 border border-gray-300 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {!isSuspended && (
                            <button
                              onClick={() => handleSuspend(m._id)}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-[#D32F2F] rounded text-[11px] font-bold flex items-center gap-1 border border-rose-200 cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing {filteredMerchants.length} registered merchants</span>
          <span>PayPilot Marketplace Directory</span>
        </div>
      </div>

    </div>
  );
};

export default AdminMerchantsPage;
