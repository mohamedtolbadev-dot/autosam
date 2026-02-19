import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { bookingApi } from '../api/index';
import { useTranslation } from 'react-i18next';

// Helper function to format location keys to human-readable names
const formatLocation = (locationKey, t) => {
  if (!locationKey) return '';
  const [city, location] = locationKey.split('_');
  const cityNames = {
    casablanca: t('common:cities.casablanca'),
    marrakech: t('common:cities.marrakech'),
    rabat: t('common:cities.rabat'),
    tangier: t('common:cities.tangier'),
    agadir: t('common:cities.agadir'),
    fes: t('common:cities.fes')
  };
  const locationTypes = {
    airport: t('common:locations.airport'),
    cityCenter: t('common:locations.cityCenter'),
    city: t('common:locations.cityCenter'),
    trainStation: t('common:locations.trainStation'),
    train: t('common:locations.trainStation')
  };
  const cityName = cityNames[city] || city;
  const locationType = locationTypes[location] || location;
  return `${cityName} - ${locationType}`;
};

const MyBookings = () => {
  const { customer, isAuthenticated, loading: authLoading, setShowLoginModal } = useCustomer();
  const { t } = useTranslation(['booking', 'common']);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  
  const [bookings, setBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyBookings();
      
      // Poll for status updates every 30 seconds
      const interval = setInterval(() => {
        fetchMyBookings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Add shimmer animation styles
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

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getMyBookings();
      
      // Check for status changes
      if (previousBookings.length > 0) {
        data.forEach((newBooking) => {
          const oldBooking = previousBookings.find(b => b.id === newBooking.id);
          if (oldBooking && oldBooking.status !== newBooking.status) {
            addNotification(
              newBooking.id,
              `Réservation #${newBooking.id} : ${getStatusLabel(newBooking.status)}`,
              getStatusDescription(newBooking.status)
            );
          }
        });
      }
      
      setPreviousBookings(bookings);
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-bl@ue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    return t(`booking:myBookings.status.${status}`) || status;
  };

  const getStatusDescription = (status) => {
    return t(`booking:myBookings.statusDescription.${status}`) || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
    }).format(price);
  };

  const addNotification = (id, title, message) => {
    const notification = { id: Date.now(), bookingId: id, title, message };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setBookingToCancel(null);
    setShowCancelModal(false);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setCancelling(true);
      await bookingApi.updateStatus(bookingToCancel.id, 'cancelled');
      
      // Refresh bookings
      await fetchMyBookings();
      
      // Close modal
      closeCancelModal();
      
      // Show success notification
      addNotification(
        Date.now(),
        t('booking:myBookings.cancelSuccess'),
        t('booking:myBookings.cancelSuccessMessage', { id: bookingToCancel.id })
      );
    } catch (err) {
      setError(err.message || t('booking:myBookings.cancelError'));
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = (booking) => {
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedBooking(null);
    setShowDetailsModal(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gradient-to-r from-slate-100 to-slate-200 rounded mb-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
            </div>
            <div className="h-4 w-64 bg-slate-100 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          
          {/* Booking cards skeleton - 3 cards */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Card Header skeleton */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-slate-100 rounded relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-5 w-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                        </div>
                      </div>
                      <div className="h-6 w-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-3 w-20 bg-slate-100 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-7 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline skeleton */}
                <div className="px-6 py-4 bg-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="h-4 w-20 bg-slate-100 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="h-4 w-48 bg-slate-100 rounded ml-5" />
                </div>

                {/* Details skeleton */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-slate-100 rounded mt-0.5" />
                      <div className="space-y-1">
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                        <div className="h-3 w-32 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-slate-100 rounded mt-0.5" />
                      <div className="space-y-1">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                        <div className="h-3 w-28 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer skeleton */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
          <img src="/imgs/autosam1.jpg" alt="Logo" className="h-12 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('booking:myBookings.loginRequired')}</h2>
          <p className="text-slate-600 mb-6">{t('booking:myBookings.loginMessage')}</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-block bg-red-600 text-white py-3 px-8 rounded-xl font-medium hover:bg-red-700 transition"
          >
            {t('booking:actions.login')}
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white border-l-4 border-red-500 shadow-lg rounded-lg p-4 max-w-sm animate-slide-in"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{notification.title}</p>
                <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            {t('booking:myBookings.title')}
          </h1>
          <p className="text-slate-600">
            {t('booking:myBookings.welcome', { name: customer?.first_name || customer?.email })}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">{t('booking:myBookings.noBookingsTitle')}</h3>
            <p className="text-slate-600 mb-4">{t('booking:myBookings.noBookings')}</p>
            <Link
              to="/cars"
              className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-red-700 transition"
            >
              {t('booking:myBookings.discoverCars')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-slate-500">{t('booking:myBookings.bookingNumber', { id: booking.id })}</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{booking.car_name}</h3>
                      <p className="text-sm text-slate-500">{booking.car_category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{formatPrice(booking.total_price)}</p>
                      {booking.promo_code && (
                        <p className="text-sm text-emerald-600">
                          {t('booking:myBookings.codeApplied', { code: booking.promo_code, amount: formatPrice(booking.discount_amount || 0) })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="px-6 py-4 bg-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      booking.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
                      booking.status === 'confirmed' ? 'bg-green-500' :
                      booking.status === 'completed' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-slate-700">
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 pl-5">
                    {getStatusDescription(booking.status)}
                  </p>
                  
                  {/* Email notification reminder for confirmed bookings */}
                  {booking.status === 'confirmed' && (
                    <div className="mt-3 pl-5 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>
                        <strong>{t('booking:myBookings.confirmationSent')}</strong> {t('booking:myBookings.checkEmail', { email: booking.email })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{t('booking:myBookings.dates')}</p>
                        <p className="text-sm text-slate-600">
                          {t('booking:myBookings.fromTo', { start: formatDate(booking.pickup_date), end: formatDate(booking.return_date) })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{t('booking:myBookings.pickupLocation')}</p>
                        <p className="text-sm text-slate-600">{formatLocation(booking.pickup_location, t)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openDetailsModal(booking)}
                      className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t('booking:myBookings.viewDetails')}
                    </button>
                    {canCancel(booking) && (
                      <button
                        onClick={() => openCancelModal(booking)}
                        className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {t('booking:myBookings.cancel')}
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {t('booking:myBookings.bookedOn', { date: formatDate(booking.created_at) })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeDetailsModal} />
            <div className="relative z-10 w-full sm:max-w-2xl h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto bg-white sm:rounded-2xl shadow-2xl rounded-t-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">{t('booking:myBookings.detailsModal.title')}</h2>
                  <p className="text-xs sm:text-sm text-slate-500">#{selectedBooking.id}</p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Status Banner */}
                <div className={`p-3 sm:p-4 rounded-lg border ${getStatusColor(selectedBooking.status)}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <span className="font-semibold text-sm sm:text-base">{t('booking:myBookings.detailsModal.status')}: {getStatusLabel(selectedBooking.status)}</span>
                    <span className="text-xs sm:text-sm">
                      {t('booking:myBookings.bookedOn', { date: formatDate(selectedBooking.created_at) })}
                    </span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    {t('booking:myBookings.detailsModal.vehicle')}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                    {selectedBooking.car_image && (
                      <div className="w-full sm:w-32 h-40 sm:h-24 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <img 
                          src={selectedBooking.car_image} 
                          alt={selectedBooking.car_name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex-1 w-full">
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.detailsModal.model')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{selectedBooking.car_name}</p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">{t('booking:myBookings.detailsModal.category')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{selectedBooking.car_category}</p>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('booking:myBookings.detailsModal.rentalDetails')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.detailsModal.startDate')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{formatDate(selectedBooking.pickup_date)}</p>
                      <p className="text-xs sm:text-sm text-slate-600">{selectedBooking.pickup_time}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.detailsModal.endDate')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{formatDate(selectedBooking.return_date)}</p>
                      <p className="text-xs sm:text-sm text-slate-600">{selectedBooking.return_time}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.pickupLocation')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{formatLocation(selectedBooking.pickup_location, t)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.returnLocation')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{formatLocation(selectedBooking.dropoff_location || selectedBooking.pickup_location, t)}</p>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('booking:myBookings.detailsModal.priceDetails')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 text-xs sm:text-sm">{t('booking:myBookings.detailsModal.vehicleRental')}</span>
                      <span className="font-medium text-sm sm:text-base">{formatPrice(selectedBooking.rental_price || selectedBooking.total_price)}</span>
                    </div>
                    {selectedBooking.insurance_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 text-xs sm:text-sm">{t('booking:myBookings.detailsModal.premiumInsurance')}</span>
                        <span className="font-medium text-sm sm:text-base">{formatPrice(selectedBooking.insurance_price)}</span>
                      </div>
                    )}
                    {selectedBooking.options_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 text-xs sm:text-sm">{t('booking:myBookings.detailsModal.options')}</span>
                        <span className="font-medium text-sm sm:text-base">{formatPrice(selectedBooking.options_price)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 text-sm sm:text-base">{t('booking:summary.total')}</span>
                        <span className="font-bold text-base sm:text-lg text-red-600">{formatPrice(selectedBooking.total_price)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('booking:myBookings.detailsModal.customerInfo')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.detailsModal.fullName')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{selectedBooking.first_name} {selectedBooking.last_name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.detailsModal.email')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base break-all">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.detailsModal.phone')}</p>
                      <p className="font-medium text-slate-800 text-sm sm:text-base">{selectedBooking.phone || t('booking:myBookings.detailsModal.notProvided')}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {t('booking:myBookings.detailsModal.notes')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 italic">"{selectedBooking.notes}"</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
                {canCancel(selectedBooking) && (
                  <button
                    onClick={() => {
                      closeDetailsModal();
                      openCancelModal(selectedBooking);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition"
                  >
                    {t('booking:myBookings.cancel')}
                  </button>
                )}
                <button
                  onClick={closeDetailsModal}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition ml-auto"
                >
                  {t('booking:actions.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && bookingToCancel && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">{t('booking:myBookings.cancelConfirmTitle')}</h3>
                    <p className="text-xs sm:text-sm text-slate-500">{t('booking:myBookings.cancelConfirmSubtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">{t('booking:myBookings.bookingId')}</span>
                    <span className="font-medium text-slate-800">#{bookingToCancel.id}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">{t('booking:myBookings.car')}</span>
                    <span className="font-medium text-slate-800 truncate ml-2">{bookingToCancel.car_name}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">{t('booking:myBookings.pickupDate')}</span>
                    <span className="font-medium text-slate-800">{formatDate(bookingToCancel.pickup_date)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                  {t('booking:myBookings.cancelWarning')}
                </p>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={closeCancelModal}
                  className="w-full px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition text-sm"
                >
                  {t('common:actions.keep')}
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm"
                >
                  {cancelling ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('common:actions.processing')}
                    </>
                  ) : (
                    t('booking:myBookings.confirmCancel')
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-600 hover:text-slate-800 font-medium">
            ← {t('booking:myBookings.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
