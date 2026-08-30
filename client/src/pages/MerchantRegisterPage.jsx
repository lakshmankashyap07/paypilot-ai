import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Store, User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Building2, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MerchantRegisterPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    storeName: '',
    category: 'Electronics',
    description: '',
    businessEmail: '',
    businessPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Electronics',
    'Laptops & Computers',
    'Smartphones & Gadgets',
    'Fashion & Apparel',
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoor',
    'Books & Office Supplies',
    'Automotive & Accessories',
    'General Store'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.storeName ||
      !formData.category ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      showToast('Please fill in all required merchant registration fields', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (!formData.agreeTerms) {
      showToast('You must agree to the Merchant Terms and Conditions', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/merchant/register', formData);

      if (res && res.success) {
        showToast('Merchant registration submitted! Your account is pending admin approval.', 'success');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      showToast(err.message || 'Merchant registration failed. Email may already be registered.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordLengthOk = formData.password.length >= 6;
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="max-w-2xl mx-auto my-8 px-4 space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm text-xs text-[#212121]">
        
        {/* Header */}
        <div className="text-center space-y-1.5 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-[#2874F0] text-white flex items-center justify-center mx-auto mb-2 shadow-sm font-bold">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Register as a Merchant</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Sell products to millions of shoppers on PayPilot AI marketplace.
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* SECTION 1: Personal Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#2874F0] uppercase tracking-wider text-xs flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>1. Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Owner Name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Personal Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@store.demo"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>
          </div>

          {/* SECTION 2: Business Details */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-bold text-[#2874F0] uppercase tracking-wider text-xs flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>2. Business Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Business / Store Name *</label>
                <input
                  type="text"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Apex Tech Store"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Business Description</label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe products or brands your store offers..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>
          </div>

          {/* SECTION 3: Business Address */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-bold text-[#2874F0] uppercase tracking-wider text-xs flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>3. Business Address</span>
            </h3>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Street Address *</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Tech Park"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Account Security */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-bold text-[#2874F0] uppercase tracking-wider text-xs flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>4. Account Security</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>

            <div className="space-y-1 text-gray-500 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${passwordLengthOk ? 'text-[#008C45]' : 'text-gray-300'}`} />
                <span>At least 6 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-[#008C45]' : 'text-gray-300'}`} />
                <span>Passwords match</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Terms Checkbox */}
          <div className="pt-3 border-t border-gray-100">
            <label className="flex items-start gap-2 cursor-pointer text-gray-700 font-medium">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 rounded border-gray-300 text-[#2874F0] focus:ring-0"
              />
              <span>
                I agree to the <strong className="text-gray-900">PayPilot AI Merchant Terms</strong> and confirm that all details are accurate.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Merchant Application...</span>
              </>
            ) : (
              <>
                <span>Create Merchant Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-gray-500 border-t border-gray-100">
          Already registered as a merchant?{' '}
          <Link to="/login" className="text-[#2874F0] hover:underline font-bold">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MerchantRegisterPage;
