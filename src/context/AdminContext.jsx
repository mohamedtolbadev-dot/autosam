import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    monthRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [weeklyBookings, setWeeklyBookings] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [topPickupLocations, setTopPickupLocations] = useState([]);
  const [topReturnLocations, setTopReturnLocations] = useState([]);
  const [detailedStats, setDetailedStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allContactMessages, setAllContactMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Vérifier si l'admin est déjà connecté (via localStorage)
  useEffect(() => {
    const verifyAuth = async () => {
      await verifyAdminToken();
      setInitializing(false);
    };
    verifyAuth();
  }, []);

  // Vérifier le token admin via localStorage
  const verifyAdminToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAdmin(null);
      return;
    }
    
    try {
      const data = await api('/auth/verify');
      
      if (data.user.role === 'admin') {
        setAdmin(data.user);
      } else {
        setAdmin(null);
        localStorage.removeItem('token');
      }
    } catch (err) {
      setAdmin(null);
      localStorage.removeItem('token');
      console.error('Token verification failed:', err);
    }
  }, []);

  // Connexion admin
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (data.user.role !== 'admin') {
        throw new Error('Accès réservé aux administrateurs');
      }

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setAdmin(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    // Remove token from localStorage
    localStorage.removeItem('token');
    setAdmin(null);
    setStats({
      totalCars: 0, totalBookings: 0, totalUsers: 0, pendingBookings: 0,
      confirmedBookings: 0, completedBookings: 0, cancelledBookings: 0,
      totalRevenue: 0, monthRevenue: 0
    });
    setRecentBookings([]);
    setWeeklyBookings([]);
    setMonthlyBookings([]);
    setTopCars([]);
    setTopPickupLocations([]);
    setTopReturnLocations([]);
    setAllBookings([]);
    setAllCars([]);
    setAllUsers([]);
    setAllContactMessages([]);
  }, []);

  // Récupérer les statistiques du tableau de bord
  const fetchDashboard = useCallback(async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const data = await api('/admin/dashboard');
      
      setStats(data.stats);
      setRecentBookings(data.recentBookings);
      setWeeklyBookings(data.weeklyBookings);
      setMonthlyBookings(data.monthlyBookings);
      setTopCars(data.topCars);
      setTopPickupLocations(data.topPickupLocations);
      setTopReturnLocations(data.topReturnLocations);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Récupérer toutes les réservations avec filtres
  const fetchAllBookings = useCallback(async (filters = {}) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const { status, search, page = 1, limit = 20 } = filters;
      
      let url = `/admin/bookings?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const data = await api(url);
      
      setAllBookings(data.bookings);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Bookings error:', err);
      return { bookings: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = useCallback(async (bookingId, status) => {
    if (!admin) return;
    
    try {
      await api(`/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      
      await fetchDashboard();
      await fetchAllBookings();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Update error:', err);
      throw err;
    }
  }, [admin, fetchDashboard, fetchAllBookings]);

  // Supprimer une réservation
  const deleteBooking = useCallback(async (bookingId) => {
    if (!admin) return;
    
    try {
      await api(`/admin/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      
      await fetchDashboard();
      await fetchAllBookings();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error('Delete error:', err);
      throw err;
    }
  }, [admin, fetchDashboard, fetchAllBookings]);

  // Récupérer les statistiques détaillées
  const fetchStatistics = useCallback(async (period = 'year') => {
    if (!admin) return;
    
    setLoading(true);
    try {
            const data = await api(`/admin/statistics?period=${period}`, {
                      });
      
      setDetailedStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Statistics error:', err);
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Récupérer toutes les voitures
  const fetchAllCars = useCallback(async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
            const data = await api('/admin/cars', {
                      });
      
      setAllCars(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Cars error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Créer une voiture avec FormData pour les images
  const createCar = useCallback(async (carData) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      // Check if carData is FormData (contains files) or regular object
      const isFormData = carData instanceof FormData;
      
      const data = await api('/admin/cars', {
        method: 'POST',
        body: isFormData ? carData : JSON.stringify(carData),
      });
      
      await fetchAllCars();
      await fetchDashboard();
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      console.error('Create car error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin, fetchAllCars, fetchDashboard]);

  // Mettre à jour une voiture avec FormData pour les images
  const updateCar = useCallback(async (carId, carData) => {
    if (!admin) return;
    
    try {
      // Check if carData is FormData (contains files) or regular object
      const isFormData = carData instanceof FormData;
      
      await api(`/admin/cars/${carId}`, {
        method: 'PUT',
        body: isFormData ? carData : JSON.stringify(carData),
      });
      
      await fetchAllCars();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Update car error:', err);
      throw err;
    }
  }, [admin, fetchAllCars]);

  // Supprimer une voiture
  const deleteCar = useCallback(async (carId) => {
    if (!admin) return;
    
    try {
            await api(`/admin/cars/${carId}`, {
        method: 'DELETE'
      });
      
      await fetchAllCars();
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error('Delete car error:', err);
      throw err;
    }
  }, [admin, fetchAllCars, fetchDashboard]);

  // Récupérer tous les utilisateurs
  const fetchAllUsers = useCallback(async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
            const data = await api('/admin/users', {
                      });
      
      setAllUsers(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Users error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Récupérer tous les messages de contact
  const fetchAllContactMessages = useCallback(async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
            const data = await api('/admin/contact-messages', {
                      });
      
      setAllContactMessages(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Contact messages error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Marquer un message comme lu
  const markMessageAsRead = useCallback(async (messageId) => {
    if (!admin) return;
    
    try {
            await api(`/admin/contact-messages/${messageId}/read`, {
        method: 'PUT',
                      });
      
      // Mettre à jour la liste locale
      setAllContactMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, is_read: true } : msg)
      );
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Mark as read error:', err);
      throw err;
    }
  }, [admin]);

  // Supprimer un message
  const deleteContactMessage = useCallback(async (messageId) => {
    if (!admin) return;
    
    try {
            await api(`/admin/contact-messages/${messageId}`, {
        method: 'DELETE'
      });
      
      await fetchAllContactMessages();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error('Delete message error:', err);
      throw err;
    }
  }, [admin, fetchAllContactMessages]);

  const value = {
    admin,
    loading,
    initializing,
    error,
    stats,
    recentBookings,
    weeklyBookings,
    monthlyBookings,
    topCars,
    topPickupLocations,
    topReturnLocations,
    detailedStats,
    allBookings,
    allCars,
    allUsers,
    allContactMessages,
    pagination,
    isAuthenticated: !!admin,
    login,
    logout,
    fetchDashboard,
    fetchStatistics,
    fetchAllBookings,
    updateBookingStatus,
    deleteBooking,
    fetchAllCars,
    createCar,
    updateCar,
    deleteCar,
    fetchAllUsers,
    fetchAllContactMessages,
    markMessageAsRead,
    deleteContactMessage,
    clearError: () => setError(null)
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin doit être utilisé dans un AdminProvider');
  }
  return context;
};

export default AdminContext;
