import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../hooks/useAddresses';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { AddressCard } from '../components/AddressCard';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Loader2,
  MapPin,
  Plus,
  Package,
  Heart,
  Settings,
  ShoppingBag
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { addresses, removeAddress, makeDefault } = useAddresses();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'security'

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Name and phone number cannot be empty', 'error');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await updateProfile({ name, phone });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs text-[#212121]">
      
      {/* Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded-xl bg-[#2874F0] text-white flex items-center justify-center font-black text-2xl shadow-sm flex-shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-grow text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-xl font-black text-gray-900">{user?.name}</h1>
            <span className="px-2 py-0.5 text-[10px] font-black bg-blue-50 text-[#2874F0] border border-blue-200 rounded uppercase">
              {user?.role}
            </span>
          </div>

          <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span>{user?.email}</span>
          </p>

          <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{user?.phone || 'No phone number provided'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/orders" className="px-3.5 py-1.5 bg-blue-50 text-[#2874F0] font-bold rounded-lg text-xs hover:bg-blue-100 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </Link>
          <Link to="/wishlist" className="px-3.5 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-lg text-xs hover:bg-rose-100 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-[#2874F0] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab 1: Profile Edit Form */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Personal Information</h2>
              <p className="text-xs text-gray-500">Manage your name and contact details</p>
            </div>
            <Shield className="w-5 h-5 text-[#2874F0]" />
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Saved Addresses Section */}
      {activeTab === 'addresses' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Saved Shipping Addresses</h2>
              <p className="text-xs text-gray-500">Manage delivery locations</p>
            </div>
            <Link
              to="/profile/addresses"
              className="px-4 py-2 bg-[#2874F0] text-white font-bold rounded-lg text-xs hover:bg-blue-700 flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs space-y-2 border border-gray-200 rounded-xl">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto" />
              <p>No saved addresses found.</p>
              <Link
                to="/profile/addresses"
                className="inline-flex items-center gap-1 text-[#2874F0] font-bold hover:underline"
              >
                Add your first shipping address →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr._id}
                  address={addr}
                  onDelete={removeAddress}
                  onSetDefault={makeDefault}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Change Password</h2>
              <p className="text-xs text-gray-500">Ensure your account uses a strong password</p>
            </div>
            <Lock className="w-5 h-5 text-gray-500" />
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
