import api from './api';

export const authService = {
  /**
   * Register a new user account
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  /**
   * Login user with credentials
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  /**
   * Logout current user
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response;
  },

  /**
   * Fetch current user profile
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response;
  },

  /**
   * Update current user profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response;
  },

  /**
   * Change user password
   */
  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response;
  }
};

export default authService;
