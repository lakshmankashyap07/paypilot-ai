import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import {
  Bot,
  ShoppingBag,
  Heart,
  User as UserIcon,
  LogOut,
  Store,
  ChevronDown,
  LayoutDashboard,
  Package,
  MapPin,
  Menu,
  X,
  ShieldAlert,
  Search,
  Sliders,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2874F0] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* 1. Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white text-[#2874F0] flex items-center justify-center shadow-md font-black group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-[#2874F0]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  PayPilot
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-[#FFCA28] text-[#212121] rounded shadow-sm uppercase">
                  AI
                </span>
              </div>
              <p className="text-[9px] text-blue-100 font-semibold tracking-wider italic uppercase hidden sm:block">
                Explore Plus Marketplace
              </p>
            </div>
          </Link>

          {/* 2. Center Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl mx-2 sm:mx-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full bg-white text-[#212121] placeholder-gray-500 rounded-lg pl-4 pr-11 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-white text-[#2874F0] hover:text-blue-700 rounded-r-md flex items-center justify-center transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 text-[#2874F0]" />
              </button>
            </div>
          </form>

          {/* 3. Right Utility Actions */}
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
            
            {/* AI Shopping Agent Link */}
            <Link
              to="/ai-shop"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700/60 hover:bg-blue-700 text-white transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#FFCA28]" />
              <span>AI Shopping</span>
            </Link>

            {/* Merchant / Admin Portals */}
            {user && (user.role === 'MERCHANT' || user.role === 'ADMIN') && (
              <Link
                to="/merchant"
                className="flex items-center gap-1 hover:text-amber-200 transition-colors"
              >
                <Store className="w-4 h-4 text-[#FFCA28]" />
                <span>Merchant Hub</span>
              </Link>
            )}

            {user && user.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-purple-300" />
                <span>Admin</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center gap-1 hover:text-amber-200 transition-colors p-1"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden lg:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#FFCA28] text-[#212121] font-black text-[10px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFCA28] text-[#212121] font-black text-[11px] flex items-center justify-center ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#2874F0] font-bold text-xs hover:bg-gray-100 transition-all shadow-sm"
                >
                  <UserIcon className="w-4 h-4 text-[#2874F0]" />
                  <span className="max-w-[90px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#2874F0]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-[#212121] rounded-xl border border-gray-200 p-2 shadow-xl space-y-1 z-50">
                    <div className="p-3 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 rounded">
                        ROLE: {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/profile/preferences"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-blue-600" />
                      <span>Preferences</span>
                    </Link>

                    <Link
                      to="/profile/addresses"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Saved Addresses</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors pt-2 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-1.5 bg-white text-[#2874F0] font-bold rounded-lg text-xs hover:bg-gray-100 shadow-sm transition-all"
              >
                Login
              </Link>
            )}

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openDrawer}
              className="relative p-2 rounded-lg bg-blue-700 text-white"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFCA28] text-[#212121] font-black text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-blue-700 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-[#212121] border-b border-gray-200 p-4 space-y-3 shadow-lg">
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-100 text-sm font-bold text-gray-800"
          >
            <Store className="w-4 h-4 text-[#2874F0]" />
            <span>Shop Marketplace</span>
          </Link>

          <Link
            to="/ai-shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-100 text-sm font-bold text-gray-800"
          >
            <Sparkles className="w-4 h-4 text-[#2874F0]" />
            <span>AI Shopping Agent</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-100 text-sm font-bold text-gray-800"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>My Orders</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-rose-50 text-sm font-bold text-rose-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 bg-[#2874F0] text-white font-bold rounded-lg text-sm"
            >
              Sign In / Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
