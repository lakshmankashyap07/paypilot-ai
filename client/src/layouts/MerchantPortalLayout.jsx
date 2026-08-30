import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingBag,
  Bot,
  Megaphone,
  Store,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const MerchantPortalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pathname = location.pathname;
  const isAIGrowthCopilot = pathname === '/merchant/ai' || pathname === '/merchant/ai/';

  const mainNavLinks = [
    { path: '/merchant/analytics', label: 'Sales & Analytics', icon: BarChart3 },
    { path: '/merchant/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, altPath: '/merchant' },
    { path: '/merchant/products', label: 'Products & Catalog', icon: Package },
    { path: '/merchant/orders', label: 'Customer Orders', icon: ShoppingBag }
  ];

  const aiNavLinks = [
    { path: '/merchant/ai', label: 'AI Growth Copilot', icon: Bot },
    { path: '/merchant/campaigns', label: 'AI Campaigns', icon: Megaphone }
  ];

  const isLinkActive = (link) => {
    if (pathname === link.path) return true;
    if (link.altPath && pathname === link.altPath) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172337] flex flex-col font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#172337] text-white p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#2874F0] flex items-center justify-center font-bold">
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xs">PayPilot Seller Hub</div>
            <div className="text-[9px] text-[#FFCA28] font-bold uppercase">Merchant Portal</div>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-gray-800 text-white cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Flex Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Persistent Dark Navy Sidebar (#172337) */}
        <aside
          className={`w-64 bg-[#172337] text-[#B8C2CC] p-4 flex flex-col justify-between flex-shrink-0 border-r border-white/10 ${
            mobileSidebarOpen ? 'fixed inset-0 z-50 w-72 flex' : 'hidden md:flex'
          }`}
        >
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2874F0] text-white flex items-center justify-center font-black shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-white text-base leading-none">Seller Hub</h2>
                  <span className="text-[10px] text-[#FFCA28] font-extrabold uppercase tracking-wider">
                    MERCHANT PORTAL
                  </span>
                </div>
              </div>

              {mobileSidebarOpen && (
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="md:hidden text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Main Navigation */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-2 block mb-2">
                MAIN NAVIGATION
              </span>

              {mainNavLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link);
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => {
                      navigate(link.path);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2874F0] text-white font-extrabold shadow-xs'
                        : 'text-[#B8C2CC] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* AI Growth Tools */}
            <div className="space-y-1 pt-4 border-t border-white/10">
              <span className="text-[10px] font-extrabold text-[#FFCA28] uppercase tracking-wider px-2 block mb-2">
                AI GROWTH TOOLS
              </span>

              {aiNavLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link);
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => {
                      navigate(link.path);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2874F0] text-white font-extrabold shadow-xs'
                        : 'text-[#B8C2CC] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-[#FFCA28]' : 'text-gray-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-white/10 text-[10px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
            <span>Verified Seller Account</span>
          </div>
        </aside>

        {/* Content Outlet Container */}
        <main className={`flex-1 overflow-y-auto max-w-[1400px] mx-auto w-full ${isAIGrowthCopilot ? 'p-4 sm:p-6 lg:p-8 space-y-6 pb-4' : 'p-4 sm:p-6 lg:p-8 space-y-6'}`}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MerchantPortalLayout;
