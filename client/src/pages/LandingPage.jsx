import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Home as HomeIcon,
  Headphones,
  Gamepad2,
  Tag,
  ShieldCheck,
  Bot
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [topProducts, setTopProducts] = useState([]);
  const [dealsOfDay, setDealsOfDay] = useState([]);

  useEffect(() => {
    // Fetch Top Recommended Products
    api.get('/products?limit=8&sort=rating')
      .then((res) => {
        if (res && res.success && res.data?.products) {
          setTopProducts(res.data.products);
          setDealsOfDay(res.data.products.filter((p) => p.discount > 10).slice(0, 4));
        }
      })
      .catch((err) => console.warn('Failed to load home products:', err.message));
  }, []);

  const categoryShortcuts = [
    { name: 'Mobiles', icon: Smartphone, cat: 'Smartphones' },
    { name: 'Laptops', icon: Laptop, cat: 'Laptops' },
    { name: 'Electronics', icon: Tv, cat: 'Electronics' },
    { name: 'Fashion', icon: Shirt, cat: 'Fashion' },
    { name: 'Shoes', icon: Footprints, cat: 'Shoes' },
    { name: 'Home', icon: HomeIcon, cat: 'Home' },
    { name: 'Accessories', icon: Headphones, cat: 'Accessories' },
    { name: 'Gaming', icon: Gamepad2, cat: 'Gaming' }
  ];

  return (
    <div className="space-y-8 pt-4">
      
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2874F0] via-[#1E5FD0] to-indigo-700 rounded-2xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCA28] text-[#212121] font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#212121]" />
              <span>AI-Powered E-Commerce Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Shop Smarter with <span className="text-[#FFCA28]">PayPilot AI</span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              India's intelligent marketplace. Autonomous AI shopping copilots that compare ratings, track prices, and find the perfect product for you.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                to="/shop"
                className="px-6 py-3 bg-[#FF9F00] hover:bg-amber-600 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Now</span>
              </Link>

              <Link
                to="/ai-shop"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-[#2874F0] font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-[#2874F0]" />
                <span>Try AI Shopping</span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-64 h-64 sm:w-72 sm:h-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-100">
                <ShieldCheck className="w-4 h-4 text-[#FFCA28]" />
                <span>Razorpay Secured Marketplace</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white text-[#212121] shadow-md space-y-1">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">AI Recommendation</div>
                  <div className="font-extrabold text-xs">MacBook Air M2 256GB</div>
                  <div className="text-xs font-extrabold text-[#008C45]">₹94,990 (Best Deal)</div>
                </div>
              </div>
              <div className="text-[11px] text-blue-100 font-semibold text-center">
                100% Validated Agentic Checkout
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY SHORTCUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Explore Top Categories</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 text-center">
            {categoryShortcuts.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/shop?category=${encodeURIComponent(cat.cat)}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2874F0] flex items-center justify-center group-hover:bg-[#2874F0] group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-[#2874F0]">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. DEALS OF THE DAY SECTION */}
      {dealsOfDay.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#D32F2F]" />
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Deals of the Day</h2>
                  <p className="text-xs text-gray-500">Highest discounts & special offers</p>
                </div>
              </div>

              <Link to="/shop" className="px-4 py-2 bg-[#2874F0] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                <span>View All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealsOfDay.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. TOP RECOMMENDED PRODUCTS */}
      {topProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Recommended for You</h2>
                <p className="text-xs text-gray-500">Top customer rated items across all categories</p>
              </div>

              <Link to="/shop" className="text-xs font-bold text-[#2874F0] hover:underline flex items-center gap-1">
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default LandingPage;
