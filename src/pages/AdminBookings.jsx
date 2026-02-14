import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';

const AdminBookings = () => {
  const navigate = useNavigate();
  const { 
    allBookings, 
    pagination,
    fetchAllBookings, 
    updateBookingStatus,
    deleteBooking,
    loading,
    initializing,
    isAuthenticated 
  } = useAdmin();

  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'info' });
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchAllBookings(filters);
  }, [initializing, isAuthenticated, navigate, fetchAllBookings, filters]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleStatusChange = async (bookingId, newStatus) => {
    const statusLabels = { pending: 'En attente', confirmed: 'Confirmée', completed: 'Terminée', cancelled: 'Annulée' };
    setConfirmModal({
      show: true,
      title: 'Changer le statut',
      message: `Voulez-vous changer le statut en "${statusLabels[newStatus]}" ?`,
      type: 'warning',
      onConfirm: async () => {
        setUpdatingStatus(bookingId);
        try {
          await updateBookingStatus(bookingId, newStatus);
          setConfirmModal({ show: false, title: '', message: '', onConfirm: null, type: 'info' });
        } catch (error) {
          setConfirmModal({
            show: true,
            title: 'Erreur',
            message: 'Erreur lors de la mise à jour du statut',
            type: 'error',
            onConfirm: () => setConfirmModal({ show: false, title: '', message: '', onConfirm: null, type: 'info' })
          });
        } finally {
          setUpdatingStatus(null);
        }
      }
    });
  };

  const handleDelete = async (bookingId) => {
    setConfirmModal({
      show: true,
      title: 'Supprimer la réservation',
      message: 'Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteBooking(bookingId);
          setConfirmModal({ show: false, title: '', message: '', onConfirm: null, type: 'info' });
        } catch (error) {
          setConfirmModal({
            show: true,
            title: 'Erreur',
            message: 'Erreur lors de la suppression',
            type: 'error',
            onConfirm: () => setConfirmModal({ show: false, title: '', message: '', onConfirm: null, type: 'info' })
          });
        }
      }
    });
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Parse notes field to extract Permis, Options, Assurance
  const parseNotes = (notes) => {
    if (!notes) return { permis: null, options: null, assurance: null, message: null };
    
    const permisMatch = notes.match(/Permis:\s*([^,]+)/i);
    const optionsMatch = notes.match(/Options:\s*([^,]+)/i);
    const assuranceMatch = notes.match(/Assurance:\s*([^,]+)/i);
    
    // Remove extracted parts to get remaining message
    let message = notes
      .replace(/Permis:\s*[^,]+,?/i, '')
      .replace(/Options:\s*[^,]+,?/i, '')
      .replace(/Assurance:\s*[^,]+,?/i, '')
      .trim();
    
    return {
      permis: permisMatch ? permisMatch[1].trim() : null,
      options: optionsMatch ? optionsMatch[1].trim() : null,
      assurance: assuranceMatch ? assuranceMatch[1].trim() : null,
      message: message || null
    };
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gestion des Réservations</h1>
            <p className="text-sm text-slate-500">Gérez toutes les réservations et leurs statuts</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par client, voiture, email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none text-sm"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Voiture</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dates</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allBookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                          Aucune réservation trouvée
                        </td>
                      </tr>
                    ) : (
                      allBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-600">#{booking.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-slate-800">{booking.first_name} {booking.last_name}</div>
                            <div className="text-xs text-slate-500">{booking.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-slate-800">{booking.car_name}</div>
                            <div className="text-xs text-slate-500">{booking.car_category}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            <div className="text-xs">{new Date(booking.pickup_date).toLocaleDateString('fr-FR')}</div>
                            <div className="text-xs text-slate-400">→ {new Date(booking.return_date).toLocaleDateString('fr-FR')}</div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{booking.total_price} MAD</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                disabled={updatingStatus === booking.id}
                                className={`text-xs px-2 py-1 rounded border font-medium cursor-pointer outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(booking.status)}`}
                              >
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="completed">Terminée</option>
                                <option value="cancelled">Annulée</option>
                              </select>
                              {updatingStatus === booking.id && (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => openDetails(booking)}
                                className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition"
                              >
                                Détails
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Desktop */}
              {pagination.total > 0 && (
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    {pagination.total} résultat{pagination.total > 1 ? 's' : ''}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={filters.page === 1}
                      className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <span className="px-3 py-1.5 text-sm text-slate-600">
                      Page {filters.page} / {pagination.pages || 1}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={filters.page === pagination.pages}
                      className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : allBookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              Aucune réservation trouvée
            </div>
          ) : (
            allBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-slate-500">#{booking.id}</span>
                    <h3 className="font-semibold text-slate-800">{booking.first_name} {booking.last_name}</h3>
                    <p className="text-sm text-slate-500">{booking.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      disabled={updatingStatus === booking.id}
                      className={`text-xs px-2 py-1 rounded border font-medium cursor-pointer outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(booking.status)}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                    {updatingStatus === booking.id && (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Voiture:</span>
                    <span className="font-medium text-slate-800">{booking.car_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Dates:</span>
                    <span className="text-slate-800">
                      {new Date(booking.pickup_date).toLocaleDateString('fr-FR')} → {new Date(booking.return_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Lieu:</span>
                    <span className="text-slate-800">{booking.pickup_location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total:</span>
                    <span className="font-semibold text-slate-800">{booking.total_price} MAD</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openDetails(booking)}
                    className="flex-1 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                  >
                    Détails
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Mobile Pagination */}
          {!loading && pagination.total > 0 && (
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                ← Précédent
              </button>
              <span className="text-sm text-slate-600">
                Page {filters.page} / {pagination.pages || 1}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.pages}
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showModal && selectedBooking && (
          (() => {
            const notesData = parseNotes(selectedBooking.notes);
            return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Détails de la réservation</h2>
                  <p className="text-sm text-slate-500">#{selectedBooking.id}</p>
                </div>
                <button
                  onClick={closeModal}
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
                      Créée le {new Date(selectedBooking.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Client Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Informations client
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
                    <div>
                      <p className="text-sm text-slate-500">N° Permis de conduire</p>
                      <p className="font-medium text-slate-800">{notesData.permis || selectedBooking.license_number || 'Non renseigné'}</p>
                    </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                      <div>
                        <p className="text-sm text-slate-500">Modèle</p>
                        <p className="font-medium text-slate-800">{selectedBooking.car_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Catégorie</p>
                        <p className="font-medium text-slate-800">{selectedBooking.car_category}</p>
                      </div>
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
                    <div>
                      <p className="text-sm text-slate-500">Nombre de jours</p>
                      <p className="font-medium text-slate-800">
                        {Math.ceil((new Date(selectedBooking.return_date) - new Date(selectedBooking.pickup_date)) / (1000 * 60 * 60 * 24))} jour(s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown & Options */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Détail de la réservation
                  </h3>
                  
                  {/* Options & Assurance Details */}
                  {(notesData.options || notesData.assurance) && (
                    <div className="mb-3 pb-3 border-b border-slate-200">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm">
                        {notesData.options && (
                          <div className="flex items-start gap-2 flex-1 min-w-[200px]">
                            <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-slate-500">Options:</span>
                              <span className="font-medium text-slate-800 ml-1 wrap-break-word">{notesData.options}</span>
                            </div>
                          </div>
                        )}
                        {notesData.assurance && (
                          <div className="flex items-start gap-2 flex-1 min-w-[200px]">
                            <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div className="flex-1">
                              <span className="text-slate-500">Assurance:</span>
                              <span className="font-medium text-slate-800 capitalize ml-1">{notesData.assurance}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Location véhicule</span>
                      <span className="font-medium">{selectedBooking.rental_price} MAD</span>
                    </div>
                    {selectedBooking.insurance_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Assurance premium</span>
                        <span className="font-medium">{selectedBooking.insurance_price} MAD</span>
                      </div>
                    )}
                    {selectedBooking.options_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Options</span>
                        <span className="font-medium">{selectedBooking.options_price} MAD</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-800">Total</span>
                        <span className="font-bold text-lg text-red-600">{selectedBooking.total_price} MAD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Message from Notes */}
                {notesData.message && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Message du client
                    </h3>
                    <p className="text-sm text-slate-600 italic">"{notesData.message}"</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-200 flex flex-wrap gap-2 sticky bottom-0 bg-white">
                <button
                  onClick={closeModal}
                  disabled={updatingStatus === selectedBooking.id}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Fermer
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => { handleStatusChange(selectedBooking.id, e.target.value); }}
                    disabled={updatingStatus === selectedBooking.id}
                    className={`px-4 py-2 rounded-lg border font-medium cursor-pointer outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(selectedBooking.status)}`}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="completed">Terminée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                  {updatingStatus === selectedBooking.id && (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <button
                  onClick={() => { handleDelete(selectedBooking.id); closeModal(); }}
                  disabled={updatingStatus === selectedBooking.id}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition ml-auto disabled:opacity-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
          );
          })()
        )}

        {/* Confirmation Modal */}
        {confirmModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  confirmModal.type === 'danger' ? 'bg-red-100 text-red-600' :
                  confirmModal.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  confirmModal.type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {confirmModal.type === 'danger' || confirmModal.type === 'error' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : confirmModal.type === 'warning' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{confirmModal.title}</h3>
              </div>
              <p className="text-slate-600 mb-6">{confirmModal.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null, type: 'info' })}
                  disabled={updatingStatus !== null}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  disabled={updatingStatus !== null}
                  className={`px-4 py-2 rounded-lg transition disabled:opacity-50 ${
                    confirmModal.type === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                    confirmModal.type === 'warning' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                    'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {updatingStatus !== null ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mise à jour...
                    </span>
                  ) : (
                    'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
