import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  Bot,
  ShieldCheck,
  Activity,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Accounts', path: '/admin/users', icon: Users },
    { label: 'Registered Merchants', path: '/admin/merchants', icon: Store },
    { label: 'Marketplace Products', path: '/admin/products', icon: Package },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'AI Observability', path: '/admin/ai', icon: Bot },
    { label: 'Security Audits', path: '/admin/security', icon: ShieldCheck },
    { label: 'Platform Health', path: '/admin/health', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172337] flex flex-col font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#172337] text-white p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#2874F0] flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xs">PayPilot Admin Hub</div>
            <div className="text-[9px] text-[#FFCA28] font-bold uppercase">Control Panel</div>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-gray-800 text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Flex Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Persistent Dark Navy Admin Sidebar (#172337) */}
        <aside
          className={`w-64 bg-[#172337] text-[#B8C2CC] p-4 flex flex-col justify-between flex-shrink-0 border-r border-white/10 ${
            mobileSidebarOpen ? 'fixed inset-0 z-50 w-72 flex' : 'hidden md:flex'
          }`}
        >
          <div className="space-y-6">
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2874F0] text-white flex items-center justify-center font-black shadow-xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-white text-base leading-none">Admin Hub</h2>
                  <span className="text-[10px] text-[#FFCA28] font-extrabold uppercase tracking-wider">
                    CONTROL PANEL
                  </span>
                </div>
              </div>

              {mobileSidebarOpen && (
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Navigation List */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-2 block mb-2">
                ADMINISTRATION
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                        isActive
                          ? 'bg-[#2874F0] text-white font-extrabold shadow-xs'
                          : 'text-[#B8C2CC] hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-white/10 text-[10px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
            <span>Root Admin Access Logged</span>
          </div>
        </aside>

        {/* Main Content Outlet Area */}
        <main className="flex-1 overflow-y-auto max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
