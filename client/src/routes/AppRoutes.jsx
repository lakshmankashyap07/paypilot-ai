import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { MerchantPortalLayout } from '../layouts/MerchantPortalLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MerchantRegisterPage } from '../pages/MerchantRegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { PersonalizationPreferencesPage } from '../pages/PersonalizationPreferencesPage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { WishlistPage } from '../pages/WishlistPage';
import { CartPage } from '../pages/CartPage';
import { AddressesPage } from '../pages/AddressesPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { AIShopPage } from '../pages/AIShopPage';
import { ComparePage } from '../pages/ComparePage';
import { MerchantPage } from '../pages/MerchantPage';
import { GrowthCopilotPage } from '../pages/GrowthCopilotPage';
import { MerchantCampaignsPage } from '../pages/MerchantCampaignsPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentSuccessPage } from '../pages/PaymentSuccessPage';
import { PaymentFailedPage } from '../pages/PaymentFailedPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '../pages/TermsOfServicePage';
import { RefundPolicyPage } from '../pages/RefundPolicyPage';
import { ShippingPolicyPage } from '../pages/ShippingPolicyPage';
import { CancellationPolicyPage } from '../pages/CancellationPolicyPage';
import { AdminLayout } from '../pages/admin/AdminLayout';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminMerchantsPage } from '../pages/admin/AdminMerchantsPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminAIObservabilityPage } from '../pages/admin/AdminAIObservabilityPage';
import { AdminSecurityAuditPage } from '../pages/admin/AdminSecurityAuditPage';
import { AdminPlatformHealthPage } from '../pages/admin/AdminPlatformHealthPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="merchant/register" element={<MerchantRegisterPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="ai-shop" element={<AIShopPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
        <Route path="refund-policy" element={<RefundPolicyPage />} />
        <Route path="shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="cancellation-policy" element={<CancellationPolicyPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="payment/:orderId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="payment/success/:orderId"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="payment/failed/:orderId"
          element={
            <ProtectedRoute>
              <PaymentFailedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/success/:id"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile/addresses"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile/preferences"
          element={
            <ProtectedRoute>
              <PersonalizationPreferencesPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Role-Based Merchant Routes */}
        <Route
          path="merchant"
          element={
            <ProtectedRoute allowedRoles={['MERCHANT', 'ADMIN']}>
              <MerchantPortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MerchantPage defaultTab="dashboard" />} />
          <Route path="dashboard" element={<MerchantPage defaultTab="dashboard" />} />
          <Route path="analytics" element={<MerchantPage defaultTab="analytics" />} />
          <Route path="products" element={<MerchantPage defaultTab="products" />} />
          <Route path="orders" element={<MerchantPage defaultTab="orders" />} />
          <Route path="ai" element={<GrowthCopilotPage />} />
          <Route path="campaigns" element={<MerchantCampaignsPage />} />
          <Route path="*" element={<MerchantPage defaultTab="dashboard" />} />
        </Route>

        {/* Protected Role-Based Admin Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="merchants" element={<AdminMerchantsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="ai" element={<AdminAIObservabilityPage />} />
          <Route path="security" element={<AdminSecurityAuditPage />} />
          <Route path="health" element={<AdminPlatformHealthPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
