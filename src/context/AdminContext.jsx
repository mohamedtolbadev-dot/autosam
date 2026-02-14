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
  const [topLocations, setTopLocations] = useState([]);
  const [detailedStats, setDetailedStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allContactMessages, setAllContactMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Vérifier si l'admin est déjà connecté (token dans localStorage)
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await verifyAdminToken();
      }
      setInitializing(false);
    };
    verifyToken();
  }, []);

  // Vérifier le token admin
  const verifyAdminToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const data = await api('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
      if (data.user.role === 'admin') {
        setAdmin(data.user);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (err) {
      localStorage.removeItem('adminToken');
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

      localStorage.setItem('adminToken', data.token);
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
  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
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
    setTopLocations([]);
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
      const token = localStorage.getItem('adminToken');
      const data = await api('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
      setStats(data.stats);
      setRecentBookings(data.recentBookings);
      setWeeklyBookings(data.weeklyBookings);
      setMonthlyBookings(data.monthlyBookings);
      setTopCars(data.topCars);
      setTopLocations(data.topLocations);
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
      const token = localStorage.getItem('adminToken');
      const { status, search, page = 1, limit = 20 } = filters;
      
      let url = `/admin/bookings?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const data = await api(url, {
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
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
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api(`/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
        token: token
      });
      
      await fetchDashboard();
      await fetchAllBookings();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Update error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin, fetchDashboard, fetchAllBookings]);

  // Supprimer une réservation
  const deleteBooking = useCallback(async (bookingId) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api(`/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
      await fetchDashboard();
      await fetchAllBookings();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error('Delete error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin, fetchDashboard, fetchAllBookings]);

  // Récupérer les statistiques détaillées
  const fetchStatistics = useCallback(async (period = 'year') => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const data = await api(`/admin/statistics?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
        token: token
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
      const token = localStorage.getItem('adminToken');
      const data = await api('/admin/cars', {
        headers: { Authorization: `Bearer ${token}` },
        token: token
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
      const token = localStorage.getItem('adminToken');
      
      // Check if carData is FormData (contains files) or regular object
      const isFormData = carData instanceof FormData;
      
      const data = await api('/admin/cars', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? carData : JSON.stringify(carData),
        token: token
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
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Check if carData is FormData (contains files) or regular object
      const isFormData = carData instanceof FormData;
      
      await api(`/admin/cars/${carId}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? carData : JSON.stringify(carData),
        token: token
      });
      
      await fetchAllCars();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Update car error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin, fetchAllCars]);

  // Supprimer une voiture
  const deleteCar = useCallback(async (carId) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api(`/admin/cars/${carId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
      await fetchAllCars();
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error('Delete car error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin, fetchAllCars, fetchDashboard]);

  // Récupérer tous les utilisateurs
  const fetchAllUsers = useCallback(async () => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const data = await api('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        token: token
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
      const token = localStorage.getItem('adminToken');
      const data = await api('/admin/contact-messages', {
        headers: { Authorization: `Bearer ${token}` },
        token: token
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
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api(`/admin/contact-messages/${messageId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
      // Mettre à jour la liste locale
      setAllContactMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, is_read: true } : msg)
      );
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Mark as read error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [admin]);

  // Supprimer un message
  const deleteContactMessage = useCallback(async (messageId) => {
    if (!admin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api(`/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        token: token
      });
      
      await fetchAllContactMessages();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      console.error('Delete message error:', err);
      throw err;
    } finally {
      setLoading(false);
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
    topLocations,
    detailedStats,
    allBookings,
    allCars,
    allUsers,
    allContactMessages,
    pagination,
    isAuthenticated: !!admin,
    initializing,
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
