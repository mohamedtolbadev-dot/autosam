import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/index';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setInitializing(false);
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await authApi.getProfile();
      
      // If user is admin, don't treat them as customer
      if (profile.role === 'admin') {
        localStorage.removeItem('token');
        setCustomer(null);
        setIsAuthenticated(false);
        return;
      }
      
      setCustomer(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      setCustomer(null);
      setIsAuthenticated(false);
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
      
      localStorage.setItem('token', response.token);
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
      
      localStorage.setItem('token', response.token);
      setCustomer(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
