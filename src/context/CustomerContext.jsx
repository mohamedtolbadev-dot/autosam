import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/index';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Check authentication on mount using localStorage
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCustomer(null);
      setIsAuthenticated(false);
      setLoading(false);
      setInitializing(false);
      return;
    }
    
    try {
      setLoading(true);
      const profile = await authApi.getProfile();
      
      // If user is admin, don't treat them as customer
      if (profile.role === 'admin') {
        setCustomer(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        return;
      }
      
      setCustomer(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Not authenticated or token invalid
      setCustomer(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      
      // Reject if user is an admin - admins must use admin login
      if (response.user.role === 'admin') {
        return { success: false, error: 'Veuillez utiliser la page de connexion administrateur' };
      }
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      setCustomer(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      
      // Reject if user is an admin - shouldn't happen via registration
      if (response.user.role === 'admin') {
        return { success: false, error: 'Inscription non autorisée' };
      }
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      setCustomer(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Remove token from localStorage
    localStorage.removeItem('token');
    setCustomer(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const updated = await authApi.updateProfile(data);
      setCustomer(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    customer,
    isAuthenticated,
    loading,
    initializing,
    login,
    register,
    logout,
    updateProfile,
    fetchProfile,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export default CustomerContext;
