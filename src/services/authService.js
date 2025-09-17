import { makeRequest } from '../utils/api';

export const authService = {
  // Admin Login
  login: async (credentials) => {
    try {
      const response = await makeRequest('/adminlogin', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin Register
  register: async (userData) => {
    try {
      const response = await makeRequest('/adminregister', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },
};
