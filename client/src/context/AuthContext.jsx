import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authService.getCurrentUser();

      if (response && response.success && response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('paypilot_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login handler
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response && response.success && response.data?.user) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      if (response.data.token) {
        localStorage.setItem('paypilot_token', response.data.token);
      }
    }
    return response;
  };

  // Register handler
  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response && response.success && response.data?.user) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      if (response.data.token) {
        localStorage.setItem('paypilot_token', response.data.token);
      }
    }
    return response;
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout API error:', error.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('paypilot_token');
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    if (response && response.success && response.data?.user) {
      setUser(response.data.user);
    }
    return response;
  };

  // Change password handler
  const changePassword = async (passwordData) => {
    const response = await authService.changePassword(passwordData);
    if (response && response.success && response.data?.token) {
      localStorage.setItem('paypilot_token', response.data.token);
    }
    return response;
  };

  // Refresh user data manually
  const refreshUser = async () => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
