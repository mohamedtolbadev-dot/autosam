import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    admin,
    stats, 
    recentBookings, 
    monthlyBookings,
    topCars,
    topPickupLocations,
    topReturnLocations,
    fetchDashboard, 
    loading,
    initializing,
    isAuthenticated 
  } = useAdmin();

  const formatNumber = (num) => new Intl.NumberFormat('fr-FR').format(num);
  const formatCurrency = (num) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(num);
  
  // Format location names for display (e.g., 'casablanca_train' -> 'Gare Casablanca')
  const formatLocation = (location) => {
    if (!location) return '';
    
    // Mapping des lieux pour l'affichage
    const locationMap = {
      'casablanca_airport': 'Aéroport Casablanca',
      'casablanca_train': 'Gare Casablanca',
      'casablanca_city': 'Centre Casablanca',
      'rabat_airport': 'Aéroport Rabat',
      'rabat_train': 'Gare Rabat',
      'rabat_city': 'Centre Rabat',
      'marrakech_airport': 'Aéroport Marrakech',
      'marrakech_train': 'Gare Marrakech',
      'marrakech_city': 'Centre Marrakech',
      'agadir_airport': 'Aéroport Agadir',
      'agadir_city': 'Centre Agadir',
      'tanger_airport': 'Aéroport Tanger',
      'tanger_train': 'Gare Tanger',
      'tanger_city': 'Centre Tanger',
      'fes_airport': 'Aéroport Fès',
      'fes_train': 'Gare Fès',
      'fes_city': 'Centre Fès',
    };
    
    if (locationMap[location]) {
      return locationMap[location];
    }
    
    // Fallback : remplacer les underscores par des espaces et mettre en majuscule
    return location
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[monthNum - 1];
  };

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [seenBookingIds, setSeenBookingIds] = useState(() => {
    const saved = localStorage.getItem('seenBookingIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Save seen booking IDs to localStorage
  useEffect(() => {
    localStorage.setItem('seenBookingIds', JSON.stringify(seenBookingIds));
  }, [seenBookingIds]);

  // Detect new bookings and create notifications
  useEffect(() => {
    if (recentBookings.length > 0) {
      const newBookings = recentBookings.filter(
        booking => !seenBookingIds.includes(booking.id)
      );
      
      if (newBookings.length > 0) {
        const newNotifications = newBookings.map(booking => ({
          id: booking.id,
          bookingId: booking.id,
          message: `Réservation #${booking.id} - ${booking.first_name} ${booking.last_name}`,
          details: `${booking.car_name} - ${formatCurrency(booking.total_price)}`,
          timestamp: new Date(),
          isNew: true
        }));
        
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
          return [...uniqueNew, ...prev].slice(0, 10);
        });
      }
    }
  }, [recentBookings, seenBookingIds]);

  // Polling every 30 seconds for real-time updates (was 10 seconds - too frequent)
  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) return;
    
    fetchDashboard();
    
    const interval = setInterval(() => {
      fetchDashboard();
    }, 30000); // 30 seconds instead of 10
    
    return () => clearInterval(interval);
  }, [initializing, isAuthenticated, fetchDashboard]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add shimmer animation styles for skeleton
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const markAsSeen = (bookingId) => {
    setSeenBookingIds(prev => [...prev, bookingId]);
    setNotifications(prev => 
      prev.map(n => n.id === bookingId ? { ...n, isNew: false } : n)
    );
  };

  const markAllAsSeen = () => {
    const allIds = notifications.map(n => n.id);
    setSeenBookingIds(prev => [...new Set([...prev, ...allIds])]);
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const viewBookingDetails = (bookingId) => {
    markAsSeen(bookingId);
    setIsDropdownOpen(false);
    navigate(`/admin/bookings?id=${bookingId}`);
  };

  const unreadCount = notifications.filter(n => n.isNew).length;

  // Auth redirect check
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [initializing, isAuthenticated, navigate]);

  if (initializing) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Skeleton */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div>
              <div className="h-6 w-48 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              <div className="h-4 w-64 bg-slate-100 rounded" />
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                    <div className="h-6 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg" />
                </div>
                <div className="mt-3 sm:mt-4 h-3 w-28 bg-slate-100 rounded" />
              </div>
            ))}
          </div>

          {/* Three Column Section Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Top Cars Skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="h-5 w-28 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full" />
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-slate-100 rounded mb-1" />
                      <div className="h-2 w-16 bg-slate-100 rounded" />
                    </div>
                    <div className="h-3 w-8 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations Skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="h-5 w-28 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full" />
                      <div className="h-3 w-4 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution Skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="h-5 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <div className="h-3 w-16 bg-slate-100 rounded" />
                      <div className="h-3 w-6 bg-slate-100 rounded" />
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="h-5 w-40 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
            <div className="h-64 bg-slate-50 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header with Notification Bell */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tableau de bord</h1>
            <p className="text-sm sm:text-base text-slate-500">Bienvenue, {admin?.username}. Voici les dernières informations.</p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Notifications ({notifications.length})
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsSeen}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                          notification.isNew ? 'bg-red-50/50' : ''
                        }`}
                        onClick={() => viewBookingDetails(notification.bookingId)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.isNew ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notification.details}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {notification.timestamp.toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-slate-400 hover:text-slate-600 shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => {
                        markAllAsSeen();
                        navigate('/admin/bookings');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Voir toutes les réservations →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <>
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                      <div className="h-6 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </div>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="mt-3 sm:mt-4 h-3 w-28 bg-slate-100 rounded" />
                </div>
              ))}
            </div>

            {/* Three Column Section Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Top Cars Skeleton */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="h-5 w-28 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-100 rounded-full" />
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-slate-100 rounded mb-1" />
                        <div className="h-2 w-16 bg-slate-100 rounded" />
                      </div>
                      <div className="h-3 w-8 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Locations Skeleton */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="h-5 w-28 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="h-3 w-24 bg-slate-100 rounded" />
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full" />
                        <div className="h-3 w-4 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Distribution Skeleton */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="h-5 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <div className="h-3 w-16 bg-slate-100 rounded" />
                        <div className="h-3 w-6 bg-slate-100 rounded" />
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row Skeleton - Individual skeletons for each chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Répartition Chart Skeleton */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="h-5 w-40 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
                <div className="h-56 flex items-center justify-center relative">
                  {/* Donut shape skeleton */}
                  <div className="relative w-44 h-44">
                    <div className="absolute inset-0 rounded-full bg-slate-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                    {/* Center hole */}
                    <div className="absolute inset-[38%] rounded-full bg-white" />
                  </div>
                  {/* Legend skeleton on the right */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-100" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Chart Skeleton */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="h-5 w-48 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
                <div className="h-56 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between py-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-2 w-4 bg-slate-100 rounded" />
                    ))}
                  </div>
                  {/* Chart area with line skeleton */}
                  <div className="absolute left-8 right-0 top-0 bottom-0 bg-slate-50 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    {/* Animated line skeleton */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f1f5f9" />
                          <stop offset="50%" stopColor="#e2e8f0" />
                          <stop offset="100%" stopColor="#f1f5f9" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,120 Q50,80 100,100 T200,60 T300,90 T400,40"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                      />
                    </svg>
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-2 w-6 bg-slate-100 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl border border-emerald-700 p-4 sm:p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-emerald-100 mb-1 font-medium">Revenus totaux</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 rounded-xl text-white shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <span className="text-emerald-100">Ce mois: {formatCurrency(stats.monthRevenue)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl border border-blue-700 p-4 sm:p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-blue-100 mb-1 font-medium">Réservations</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatNumber(stats.totalBookings)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 rounded-xl text-white shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm gap-1 sm:gap-4">
                  <span className="text-blue-100">{stats.pendingBookings} en attente</span>
                  <span className="text-blue-200">{stats.confirmedBookings} confirmées</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl border border-red-700 p-4 sm:p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-red-100 mb-1 font-medium">Voitures</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatNumber(stats.totalCars)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 rounded-xl text-white shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                      <path fill="currentColor" d="M199.2 181.4L173.1 256L466.9 256L440.8 181.4C436.3 168.6 424.2 160 410.6 160L229.4 160C215.8 160 203.7 168.6 199.2 181.4zM103.6 260.8L138.8 160.3C152.3 121.8 188.6 96 229.4 96L410.6 96C451.4 96 487.7 121.8 501.2 160.3L536.4 260.8C559.6 270.4 576 293.3 576 320L576 512C576 529.7 561.7 544 544 544L512 544C494.3 544 480 529.7 480 512L480 480L160 480L160 512C160 529.7 145.7 544 128 544L96 544C78.3 544 64 529.7 64 512L64 320C64 293.3 80.4 270.4 103.6 260.8zM192 368C192 350.3 177.7 336 160 336C142.3 336 128 350.3 128 368C128 385.7 142.3 400 160 400C177.7 400 192 385.7 192 368zM480 400C497.7 400 512 385.7 512 368C512 350.3 497.7 336 480 336C462.3 336 448 350.3 448 368C448 385.7 462.3 400 480 400z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-100 truncate">
                  {topCars.length > 0 && `Top: ${topCars[0].name}`}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl border border-purple-700 p-4 sm:p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-purple-100 mb-1 font-medium">Utilisateurs</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{formatNumber(stats.totalUsers)}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 rounded-xl text-white shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-purple-100">
                  {stats.completedBookings} réservations complétées
                </div>
              </div>
            </div>

            {/* Row 1: Top 3 items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Top 5 Voitures */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Voitures</h3>
                <div className="space-y-3">
                  {topCars.slice(0, 5).map((car, index) => (
                    <div key={car.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{car.name}</p>
                        <p className="text-xs text-slate-500">{car.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 shrink-0">{car.booking_count} rés.</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Locations - Pickup */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Lieu de prise en charge</h3>
                <div className="space-y-3">
                  {(topPickupLocations || []).slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-700 truncate">{formatLocation(location.location)}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${(location.count / (topPickupLocations?.[0]?.count || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-500 w-6">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Locations - Return */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Lieu de restitution</h3>
                <div className="space-y-3">
                  {(topReturnLocations || []).slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-700 truncate">{formatLocation(location.location)}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(location.count / (topReturnLocations?.[0]?.count || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-500 w-6">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Répartition + Chart (equal split) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Répartition des statuts - Doughnut Chart (scientific design) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Répartition des statuts</h3>
                <div className="h-56 relative">
                  <Doughnut
                    data={{
                      labels: ['En attente', 'Confirmées', 'Terminées', 'Annulées'],
                      datasets: [
                        {
                          data: [
                            stats.pendingBookings,
                            stats.confirmedBookings,
                            stats.completedBookings,
                            stats.cancelledBookings,
                          ],
                          backgroundColor: [
                            '#F59E0B',   // amber-500
                            '#10B981',   // emerald-500
                            '#3B82F6',   // blue-500
                            '#EF4444',   // red-500
                          ],
                          borderColor: '#FFFFFF',
                          borderWidth: 3,
                          hoverOffset: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          position: 'right',
                          align: 'center',
                          labels: {
                            boxWidth: 16,
                            boxHeight: 16,
                            padding: 15,
                            font: {
                              size: 12,
                              weight: '500',
                            },
                            usePointStyle: true,
                            pointStyle: 'circle',
                          },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          titleFont: {
                            size: 13,
                            weight: '600',
                          },
                          bodyFont: {
                            size: 12,
                          },
                          padding: 12,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: (context) => {
                              const label = context.label || '';
                              const value = context.raw;
                              const total = stats.totalBookings;
                              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                              return ` ${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 800,
                        easing: 'easeOutQuart',
                      },
                    }}
                  />
                  {/* Center text showing total */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-24">
                    <div className="text-center">
                      <span className="text-xs text-slate-400 font-medium block mb-1">Total</span>
                      <span className="text-3xl font-bold text-slate-800">{stats.totalBookings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphique des réservations par mois (smaller) */}
              {monthlyBookings.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Réservations par mois ({new Date().getFullYear()})</h3>
                  <div className="h-56">
                    <Line
                      data={{
                        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                        datasets: [
                          {
                            label: 'Réservations',
                            data: Array.from({ length: 12 }, (_, i) => {
                              const monthData = monthlyBookings.find(m => m.month === i + 1);
                              return monthData ? monthData.count : 0;
                            }),
                            borderColor: 'rgba(239, 68, 68, 1)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.raw} réservation${context.raw > 1 ? 's' : ''}`,
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
