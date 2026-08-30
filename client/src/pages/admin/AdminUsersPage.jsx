import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Filter, ShieldCheck, UserX, UserCheck, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getUsers({ role: roleFilter, search: searchTerm });
      if (res?.success && res.data?.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchTerm]);

  const handleToggleStatus = async (id, currentActive) => {
    try {
      await adminService.updateUserStatus(id, !currentActive);
      showToast(`User account ${!currentActive ? 'activated' : 'deactivated'}`, 'info');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const totalCount = users.length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;
  const merchantCount = users.filter((u) => u.role === 'MERCHANT').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-6 text-xs text-[#172337]">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172337]">User Accounts</h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Manage platform user accounts, roles, access permissions, and activation status.
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-[#2874F0]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalCount}</div>
          <div className="text-[11px] text-gray-500 font-medium">Platform users</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Customers</span>
            <UserCheck className="w-4 h-4 text-[#00875A]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{customerCount}</div>
          <div className="text-[11px] text-[#00875A] font-bold">Shopper accounts</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Merchants</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{merchantCount}</div>
          <div className="text-[11px] text-purple-700 font-medium">Seller accounts</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E0E6ED] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Admins</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{adminCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Platform administrators</div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-[#E0E6ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full bg-gray-50 border border-[#E0E6ED] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172337] placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto bg-gray-50 border border-[#E0E6ED] rounded-lg px-3 py-2 text-xs font-bold text-[#172337] focus:outline-none focus:border-[#2874F0]"
        >
          <option value="">All User Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="MERCHANT">Merchant</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl border border-[#E0E6ED] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-gray-700">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-[11px] text-gray-500">{u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : u.role === 'MERCHANT'
                          ? 'bg-blue-50 text-[#2874F0] border-blue-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 text-[9px] font-black rounded border ${
                          u.active !== false
                            ? 'bg-emerald-50 text-[#00875A] border-emerald-200'
                            : 'bg-rose-50 text-[#D32F2F] border-rose-200'
                        }`}
                      >
                        {u.active !== false ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u._id, u.active !== false)}
                          className={`px-3 py-1 font-bold rounded-lg text-[11px] transition-all cursor-pointer ${
                            u.active !== false
                              ? 'bg-rose-50 text-[#D32F2F] hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-[#00875A] hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {u.active !== false ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px] flex justify-between items-center font-medium">
          <span>Showing {users.length} user accounts</span>
          <span>PayPilot Identity Directory</span>
        </div>
      </div>

    </div>
  );
};

export default AdminUsersPage;
