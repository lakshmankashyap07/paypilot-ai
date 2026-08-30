import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ShieldCheck, Zap, Sparkles, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#172337] text-[#B8C2CC] text-xs font-sans border-t border-white/10">
      
      {/* Top Main Footer Section (Padding 40px top, 20px bottom) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
          
          {/* COLUMN 1: ABOUT PAYPILOT AI */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 space-y-2.5">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2874F0] text-white flex items-center justify-center font-black">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                PayPilot <span className="text-[#FFCA28]">AI</span>
              </span>
            </Link>

            <p className="text-[11px] font-bold text-white leading-tight">
              India's AI-powered agentic commerce marketplace.
            </p>

            <p className="text-[11px] text-[#B8C2CC] leading-relaxed">
              Shop smarter with AI-powered discovery, secure checkout and intelligent commerce.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-900/40 text-blue-200 border border-white/10">
                <Zap className="w-3 h-3 text-[#FFCA28]" />
                <span>Razorpay AI Builder 2026</span>
              </span>
            </div>
          </div>

          {/* COLUMN 2: ABOUT & SHOP */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">ABOUT & SHOP</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Marketplace Catalog</Link>
              </li>
              <li>
                <Link to="/ai-shop" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>AI Shopping Agent</span>
                  <Sparkles className="w-3 h-3 text-[#FFCA28]" />
                </Link>
              </li>
              <li>
                <Link to="/merchant/register" className="hover:text-white transition-colors">Become a Merchant</Link>
              </li>
              <li>
                <Link to="/merchant" className="hover:text-white transition-colors">Merchant Portal</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CUSTOMER HELP */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">CUSTOMER HELP</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Cart Summary</Link>
              </li>
              <li>
                <Link to="/profile/addresses" className="hover:text-white transition-colors">Saved Addresses</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Account Profile</Link>
              </li>
              <li>
                <Link to="/profile/preferences" className="hover:text-white transition-colors">Personalization</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: POLICY */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">POLICY</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Refund Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Shipping Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Cancellation Policy</span>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: PAYMENT & SECURITY */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">PAYMENT & SECURITY</h4>
            <div className="p-3 rounded-lg bg-[#0F1C2E] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#008C45]" />
                <span>Secure Payments</span>
              </div>

              <div className="text-[10px] text-[#B8C2CC] leading-relaxed space-y-1">
                <div className="font-bold text-white">Razorpay Secured</div>
                <div>256-bit SSL encrypted server-verified checkout</div>
              </div>

              <div className="pt-1 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-[#FFCA28] border border-amber-500/30 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Test Mode Active</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Secondary Footer Bar */}
      <div className="bg-[#0F1C2E] border-t border-white/10 py-3 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© 2026 PayPilot AI. All rights reserved. Built for Razorpay AI Builder Internship 2026.</p>
          <p className="font-bold text-white text-[11px]">
            Shop Smarter. Decide Faster. Pay Effortlessly.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
