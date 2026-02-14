import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { bookingApi } from '../api/index';
import { useTranslation } from 'react-i18next';

const MyBookings = () => {
  const { customer, isAuthenticated, loading: authLoading } = useCustomer();
  const { t } = useTranslation();
  
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
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'confirmed': 
        return 'Votre réservation est confirmée. La voiture vous attend à la date prévue.';
      case 'pending': 
        return 'Votre demande est en cours de traitement. Vous recevrez une confirmation par email.';
      case 'cancelled': 
        return 'Cette réservation a été annulée.';
      case 'completed': 
        return 'Location terminée. Merci de nous avoir fait confiance !';
      default: 
        return '';
    }
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

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
          <img src="/imgs/autosam1.jpg" alt="Logo" className="h-12 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Connexion requise</h2>
          <p className="text-slate-600 mb-6">Connectez-vous pour voir vos réservations.</p>
          <Link
            to="/login"
            className="inline-block bg-red-600 text-white py-3 px-8 rounded-xl font-medium hover:bg-red-700 transition"
          >
            Se connecter
          </Link>
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
            Mes réservations
          </h1>
          <p className="text-slate-600">
            Bienvenue, {customer?.first_name || customer?.email}. Suivez l'état de vos locations.
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
            <h3 className="text-lg font-medium text-slate-800 mb-2">Aucune réservation</h3>
            <p className="text-slate-600 mb-4">Vous n'avez pas encore effectué de réservation.</p>
            <Link
              to="/cars"
              className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Découvrir nos voitures
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
                        <span className="text-sm text-slate-500">Réservation #{booking.id}</span>
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
                          Code {booking.promo_code} appliqué (-{formatPrice(booking.discount_amount || 0)})
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
                        <strong>Confirmation envoyée !</strong> Vérifiez votre email ({booking.email}) pour les détails complets de votre réservation.
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
                        <p className="text-sm font-medium text-slate-700">Dates</p>
                        <p className="text-sm text-slate-600">
                          Du {formatDate(booking.pickup_date)} au {formatDate(booking.return_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Lieu de retrait</p>
                        <p className="text-sm text-slate-600">{booking.pickup_location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => openDetailsModal(booking)}
                    className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir les détails
                  </button>
                  <span className="text-xs text-slate-500">
                    Réservé le {formatDate(booking.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeDetailsModal} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Détails de la réservation</h2>
                  <p className="text-sm text-slate-500">#{selectedBooking.id}</p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Banner */}
                <div className={`p-4 rounded-lg border ${getStatusColor(selectedBooking.status)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Statut: {getStatusLabel(selectedBooking.status)}</span>
                    <span className="text-sm">
                      Réservée le {formatDate(selectedBooking.created_at)}
                    </span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Véhicule
                  </h3>
                  <div className="flex gap-4 items-start">
                    {selectedBooking.car_image && (
                      <div className="w-32 h-24 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <img 
                          src={selectedBooking.car_image} 
                          alt={selectedBooking.car_name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Modèle</p>
                      <p className="font-medium text-slate-800">{selectedBooking.car_name}</p>
                      <p className="text-sm text-slate-500 mt-2">Catégorie</p>
                      <p className="font-medium text-slate-800">{selectedBooking.car_category}</p>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Détails de la location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Date de départ</p>
                      <p className="font-medium text-slate-800">{formatDate(selectedBooking.pickup_date)}</p>
                      <p className="text-sm text-slate-600">{selectedBooking.pickup_time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date de retour</p>
                      <p className="font-medium text-slate-800">{formatDate(selectedBooking.return_date)}</p>
                      <p className="text-sm text-slate-600">{selectedBooking.return_time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Lieu de retrait</p>
                      <p className="font-medium text-slate-800">{selectedBooking.pickup_location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Lieu de retour</p>
                      <p className="font-medium text-slate-800">{selectedBooking.dropoff_location || selectedBooking.pickup_location}</p>
                    </div>
                  </div>
                </div>

                {/* Price Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Détail du prix
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Location véhicule</span>
                      <span className="font-medium">{formatPrice(selectedBooking.rental_price || selectedBooking.total_price)}</span>
                    </div>
                    {selectedBooking.insurance_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Assurance premium</span>
                        <span className="font-medium">{formatPrice(selectedBooking.insurance_price)}</span>
                      </div>
                    )}
                    {selectedBooking.options_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Options</span>
                        <span className="font-medium">{formatPrice(selectedBooking.options_price)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-800">Total</span>
                        <span className="font-bold text-lg text-red-600">{formatPrice(selectedBooking.total_price)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Vos coordonnées
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Nom complet</p>
                      <p className="font-medium text-slate-800">{selectedBooking.first_name} {selectedBooking.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-800">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Téléphone</p>
                      <p className="font-medium text-slate-800">{selectedBooking.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Notes
                    </h3>
                    <p className="text-sm text-slate-600 italic">"{selectedBooking.notes}"</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-slate-600 hover:text-slate-800 font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
