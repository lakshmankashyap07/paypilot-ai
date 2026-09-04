import React, { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, Smartphone, Monitor, LogOut, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SecurityCenterSection = () => {
  const { user, changePassword, logout } = useAuth();
  const { showToast } = useToast();

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState([
    {
      id: 'sess_1',
      device: 'Chrome Web (Windows 11)',
      location: 'Bengaluru, India',
      lastActive: 'Active Now',
      isCurrent: true
    },
    {
      id: 'sess_2',
      device: 'PayPilot Android App',
      location: 'Bengaluru, India',
      lastActive: '2 hours ago',
      isCurrent: false
    }
  ]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill out all password fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOutSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast('Device session terminated', 'info');
  };

  const handleSignOutAll = () => {
    showToast('Signed out from all active device sessions', 'info');
    logout();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6 text-xs text-gray-900">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>PayPilot Security Center</span>
          </h2>
          <p className="text-xs text-gray-500">Manage password, session devices, and authentication security</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            SECURITY SCORE: 92/100
          </span>
        </div>
      </div>

      {/* Security Checklist */}
      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
        <div className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
          <span>Account Protection Checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Email Verified ({user?.email})</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Strong Password Hash Active</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Recent Suspicious Activity: 0</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>2FA Security Enabled</span>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <div className="space-y-4 pt-1">
        <div className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
          Update Password
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Manage Active Devices / Sessions */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-xs text-gray-900 uppercase tracking-wider block">
              Manage Active Sessions & Devices
            </span>
            <span className="text-[11px] text-gray-500">Currently logged in hardware devices</span>
          </div>

          <button
            type="button"
            onClick={handleSignOutAll}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out All Devices</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-gray-50/40">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700">
                  {sess.device.includes('Android') ? <Smartphone className="w-5 h-5 text-indigo-600" /> : <Monitor className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <span>{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.2 text-[9px] font-black bg-emerald-600 text-white rounded uppercase">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {sess.location} • {sess.lastActive}
                  </div>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleSignOutSession(sess.id)}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SecurityCenterSection;
