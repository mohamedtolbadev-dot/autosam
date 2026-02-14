import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';

const AdminContact = () => {
  const navigate = useNavigate();
  const {
    allContactMessages,
    fetchAllContactMessages,
    markMessageAsRead,
    deleteContactMessage,
    loading,
    initializing,
    isAuthenticated
  } = useAdmin();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchAllContactMessages();
  }, [initializing, isAuthenticated, navigate, fetchAllContactMessages]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    // Marquer comme lu si non lu
    if (!message.is_read) {
      markMessageAsRead(message.id);
    }
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setShowModal(false);
  };

  const handleDelete = async (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      await deleteContactMessage(messageToDelete);
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
      closeModal();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubjectLabel = (subject) => {
    const subjects = {
      reservation: 'Réservation',
      information: 'Information',
      modification: 'Modification',
      reclamation: 'Réclamation',
      autre: 'Autre'
    };
    return subjects[subject] || subject;
  };

  const unreadCount = allContactMessages.filter(msg => !msg.is_read).length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Messages de Contact</h1>
            <p className="text-slate-500">
              {unreadCount > 0 ? (
                <span className="text-red-600 font-medium">{unreadCount} message(s) non lu(s)</span>
              ) : (
                'Tous les messages ont été lus'
              )}
            </p>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : allContactMessages.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-lg font-medium">Aucun message</p>
              <p className="text-sm text-slate-400 mt-1">Les messages des visiteurs apparaîtront ici</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="sm:hidden">
                {allContactMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b border-slate-100 last:border-b-0 ${
                      !message.is_read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        !message.is_read ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                        <svg className={`w-5 h-5 ${!message.is_read ? 'text-blue-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800 text-sm">{message.name}</p>
                          {!message.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{message.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                            {getSubjectLabel(message.subject)}
                          </span>
                          <span className="text-xs text-slate-400">{formatDate(message.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Mobile Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => openMessageModal(message)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expéditeur</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sujet</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allContactMessages.map((message) => (
                      <tr
                        key={message.id}
                        className={`hover:bg-slate-50 ${!message.is_read ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="px-4 py-4">
                          {!message.is_read ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Non lu
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              Lu
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              !message.is_read ? 'bg-blue-100' : 'bg-slate-100'
                            }`}>
                              <svg className={`w-4 h-4 ${!message.is_read ? 'text-blue-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className={`font-medium text-sm ${!message.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                              {message.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 hidden md:table-cell">{message.email}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                            {getSubjectLabel(message.subject)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-500 hidden lg:table-cell">{formatDate(message.created_at)}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openMessageModal(message)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition"
                            >
                              Voir
                            </button>
                            <button
                              onClick={() => handleDelete(message.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Message Details Modal */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
            <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-4" style={{ backgroundColor: '#E2E8F0' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">{selectedMessage.name}</h2>
                      <p className="text-slate-600 text-sm">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-slate-600 hover:text-slate-800 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {/* Subject Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-slate-100 text-slate-700">
                    {getSubjectLabel(selectedMessage.subject)}
                  </span>
                </div>

                {/* Message Info */}
                <div className="space-y-2">
                  {/* Contact Section */}
                  <div className="bg-slate-50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-medium text-slate-800 text-sm">{selectedMessage.email}</p>
                        </div>
                      </div>

                      {selectedMessage.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Téléphone</p>
                            <p className="font-medium text-slate-800 text-sm">{selectedMessage.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="bg-slate-50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Message</h4>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {/* Date Section */}
                  <div className="bg-slate-50 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Informations</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Reçu le</span>
                        <span className="font-medium text-slate-800 text-sm">{formatDate(selectedMessage.created_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Statut</span>
                        <span className={`font-medium text-sm ${selectedMessage.is_read ? 'text-green-600' : 'text-blue-600'}`}>
                          {selectedMessage.is_read ? 'Lu' : 'Non lu'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 flex justify-between">
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-5 py-2 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition text-sm"
                >
                  Supprimer
                </button>
                <button
                  onClick={closeModal}
                  className="px-5 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={cancelDelete} />
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 bg-red-50 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Confirmer la suppression</h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-slate-600">
                  Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2 text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
