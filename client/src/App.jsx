import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { CartDrawer } from './components/CartDrawer';
import { CompareTrayBar } from './components/CompareTrayBar';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <CompareProvider>
                  <AppRoutes />
                  <CartDrawer />
                  <CompareTrayBar />
                </CompareProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
