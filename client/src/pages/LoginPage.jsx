import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, Bot } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login({ email, password });

      if (res && res.success) {
        const userRole = (res.data?.user?.role || '').toUpperCase();
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');

        let targetPath = from;
        if (!from || from === '/') {
          if (userRole === 'MERCHANT') {
            targetPath = '/merchant';
          } else if (userRole === 'ADMIN') {
            targetPath = '/admin/dashboard';
          } else {
            targetPath = '/shop';
          }
        }

        navigate(targetPath, { replace: true });
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 space-y-6 shadow-sm text-xs text-[#212121]">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#2874F0] text-white flex items-center justify-center mx-auto mb-2 shadow-sm font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Sign In to PayPilot AI</h1>
          <p className="text-xs text-gray-500">Access your customer account or merchant hub</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-9 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2874F0]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#2874F0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center pt-4 text-xs text-gray-500 space-y-1.5 border-t border-gray-100">
          <div>
            Want to sell on PayPilot AI?{' '}
            <Link to="/merchant/register" className="text-[#2874F0] hover:underline font-bold">
              Register as a Merchant
            </Link>
          </div>
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="text-[#2874F0] hover:underline font-bold">
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
