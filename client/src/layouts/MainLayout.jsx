import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CategoryNav } from '../components/CategoryNav';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Show category navigation ONLY on marketplace browsing & catalog pages:
  // Home ('/'), Shop ('/shop'), Product Details ('/product/:id')
  // Hide on /ai-shop, /cart, /checkout, /payment, /orders, /profile, /merchant/*
  const showCategoryNav =
    path === '/' ||
    path === '/shop' ||
    path.startsWith('/shop/') ||
    path.startsWith('/product/');

  // Hide footer on /ai-shop and /merchant/ai (AI Growth Copilot)
  // All other Merchant Hub pages (/merchant/dashboard, /merchant/analytics, /merchant/products, /merchant/orders, /merchant/campaigns) keep the footer.
  const isAIGrowthCopilot = path === '/merchant/ai' || path === '/merchant/ai/';
  const isAIShop = path.startsWith('/ai-shop');
  const isNoFooterPage = isAIShop || isAIGrowthCopilot;
  const showFooter = !isNoFooterPage;

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F3F6] text-[#212121] selection:bg-[#2874F0] selection:text-white">
      <Navbar />
      {showCategoryNav && <CategoryNav />}
      <main className={`flex-grow ${isNoFooterPage ? 'pb-0 flex flex-col overflow-hidden' : 'pb-12'}`}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
