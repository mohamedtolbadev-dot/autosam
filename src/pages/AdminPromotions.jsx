import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const AdminPromotions = () => {
  const { isAuthenticated, token } = useAdmin();
  const navigate = useNavigate();
  
  const [promotions, setPromotions] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_fr: '',
    title_en: '',
    description: '',
    description_fr: '',
    description_en: '',
    discount_percent: 0,
    discount_amount: 0,
    code: '',
    start_date: '',
    end_date: '',
    is_active: true,
    display_order: 0,
    car_id: ''
  });

  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.car_id) {
      errors.car_id = 'Veuillez sélectionner une voiture';
    }
    
    if (!formData.end_date) {
      errors.end_date = 'La date de fin est obligatoire';
    }
    
    if (formData.end_date && formData.start_date && formData.end_date < formData.start_date) {
      errors.end_date = 'La date de fin doit être après la date de début';
    }
    
    if (formData.discount_percent < 0 || formData.discount_percent > 100) {
      errors.discount_percent = 'Le pourcentage doit être entre 0 et 100';
    }
    
    if (formData.discount_amount < 0) {
      errors.discount_amount = 'Le montant ne peut pas être négatif';
    }
    
    if (formData.code && formData.code.length < 3) {
      errors.code = 'Le code doit contenir au moins 3 caractères';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // API URL - use production Vercel API
  const API_URL = 'https://server-chi-two-10.vercel.app/api';

  // Fetch all cars for dropdown
  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_URL}/cars`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Cars fetch failed:', response.status);
        setCars([]);
        return;
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCars(data);
      } else if (data.data) {
        setCars(data.data);
      } else {
        setCars([]);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setCars([]);
    }
  };

  // Fetch all promotions
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/promotions/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPromotions(data.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des promotions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPromotions();
      fetchCars();
    }
  }, [isAuthenticated]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If car is selected, auto-populate title from car data
    if (name === 'car_id' && value) {
      const selectedCar = cars.find(car => car.id.toString() === value.toString());
      if (selectedCar) {
        setFormData(prev => ({
          ...prev,
          car_id: value,
          title: selectedCar.name
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Open modal for creating new promotion
  const handleAddNew = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      title_fr: '',
      title_en: '',
      description: '',
      description_fr: '',
      description_en: '',
      discount_percent: 0,
      discount_amount: 0,
      code: '',
      start_date: '',
      end_date: '',
      is_active: true,
      display_order: 0,
      car_id: ''
    });
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title || '',
      title_fr: promotion.title_fr || '',
      title_en: promotion.title_en || '',
      description: promotion.description || '',
      description_fr: promotion.description_fr || '',
      description_en: promotion.description_en || '',
      discount_percent: promotion.discount_percent || 0,
      discount_amount: promotion.discount_amount || 0,
      code: promotion.code || '',
      start_date: promotion.start_date ? promotion.start_date.split('T')[0] : '',
      end_date: promotion.end_date ? promotion.end_date.split('T')[0] : '',
      is_active: promotion.is_active !== undefined ? promotion.is_active : true,
      display_order: promotion.display_order || 0,
      car_id: promotion.car_id || ''
    });
    setShowModal(true);
  };

  // Save promotion (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    if (!token) {
      showToast('Token manquant. Veuillez vous reconnecter.', 'error');
      navigate('/admin/login');
      return;
    }
    
    const url = editingPromotion 
      ? `${API_URL}/promotions/${editingPromotion.id}`
      : `${API_URL}/promotions`;
    
    const method = editingPromotion ? 'PUT' : 'POST';
    
    try {
      const requestBody = {
        ...formData,
        discount_percent: parseInt(formData.discount_percent) || 0,
        discount_amount: parseFloat(formData.discount_amount) || 0,
        display_order: parseInt(formData.display_order) || 0
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showToast('Erreur serveur: ' + (data.message || 'Erreur inconnue'), 'error');
        return;
      }
      
      if (data.success) {
        setShowModal(false);
        fetchPromotions();
        showToast(editingPromotion ? 'Promotion mise à jour avec succès' : 'Promotion créée avec succès', 'success');
      } else {
        showToast('Erreur: ' + data.message, 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  // Delete promotion
  const handleDelete = async (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`${API_URL}/promotions/${confirmDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchPromotions();
        showToast('Promotion supprimée avec succès', 'success');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Erreur lors de la suppression', 'error');
    }
    setConfirmDelete(null);
  };

  // Toggle active status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/promotions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchPromotions();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Helper function to format image URL
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a relative path starting with /uploads, prepend the API base URL
    if (imageUrl.startsWith('/uploads/')) {
      // Remove '/api' from the end of API_URL if present
      const baseUrl = API_URL.replace(/\/api$/, '');
      return `${baseUrl}${imageUrl}`;
    }
    return imageUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Veuillez vous connecter pour accéder à cette page</p>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Promotions</h1>
          <p className="text-slate-500 mt-1">Créez et gérez vos offres spéciales</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Total Promotions</p>
          <p className="text-2xl font-bold text-slate-900">{promotions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Actives</p>
          <p className="text-2xl font-bold text-green-600">
            {promotions.filter(p => p.is_active).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Inactives</p>
          <p className="text-2xl font-bold text-slate-600">
            {promotions.filter(p => !p.is_active).length}
          </p>
        </div>
      </div>

      {/* Promotions List - Mobile Responsive Cards */}
      {loading ? (
        <>
          {/* Desktop Skeleton - Light & Content Based */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-slate-100 rounded w-32 animate-pulse" />
                    <div className="h-2.5 bg-slate-50 rounded w-48 animate-pulse" />
                  </div>
                  <div className="w-20 h-6 bg-slate-50 rounded animate-pulse" />
                  <div className="w-16 h-5 bg-slate-50 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          {/* Mobile Skeleton - Light & Content Based */}
          <div className="md:hidden space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-3">
                <div className="flex gap-3 mb-2">
                  <div className="w-16 h-12 bg-slate-100 rounded-lg shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="h-3.5 bg-slate-100 rounded w-3/4 animate-pulse" />
                    <div className="h-2.5 bg-slate-50 rounded w-1/2 animate-pulse" />
                    <div className="h-2 bg-slate-50 rounded w-20 animate-pulse" />
                  </div>
                </div>
                <div className="h-8 bg-slate-50 rounded-lg mb-2 animate-pulse" />
                <div className="flex justify-between items-center">
                  <div className="w-14 h-5 bg-slate-50 rounded-full animate-pulse" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-slate-50 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune promotion</h3>
          <p className="text-slate-500 mb-4">Commencez par créer votre première promotion</p>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Créer une promotion
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Titre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Voiture</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Remise</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Statut</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        {promo.image_url ? (
                          <img 
                            src={formatImageUrl(promo.image_url)} 
                            alt={promo.title}
                            className="w-16 h-12 object-cover rounded-lg"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{promo.title}</p>
                        <p className="text-sm text-slate-500 line-clamp-1">{promo.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        {promo.car_name ? (
                          <div className="text-sm">
                            <p className="font-medium text-slate-900">{promo.car_name}</p>
                            <p className="text-slate-500">
                              {promo.car_price && `${promo.car_price} MAD/jour`}
                              {promo.car_category && ` • ${promo.car_category}`}
                            </p>
                            <p className="text-slate-400 text-xs">
                              {promo.car_seats && `${promo.car_seats} places`}
                              {promo.car_transmission && ` • ${promo.car_transmission}`}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {promo.code ? (
                          <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 text-sm font-mono rounded">
                            {promo.code}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {promo.discount_percent > 0 ? (
                          <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                            -{promo.discount_percent}%
                          </span>
                        ) : promo.discount_amount > 0 ? (
                          <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                            -{promo.discount_amount} MAD
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <div className="flex flex-col">
                          <span>Début: {formatDate(promo.start_date)}</span>
                          <span>Fin: {formatDate(promo.end_date)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(promo.id, promo.is_active)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            promo.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {promo.is_active ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Active
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(promo)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                {/* Header with Image and Title */}
                <div className="flex gap-3 mb-3">
                  {promo.image_url ? (
                    <img 
                      src={formatImageUrl(promo.image_url)} 
                      alt={promo.title}
                      className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-20 h-16 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{promo.title}</p>
                    <p className="text-sm text-slate-500 line-clamp-1">{promo.description}</p>
                    {promo.code && (
                      <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-700 text-xs font-mono rounded mt-1">
                        {promo.code}
                      </span>
                    )}
                  </div>
                </div>

                {/* Car Info */}
                {promo.car_name && (
                  <div className="bg-slate-50 rounded-lg p-2 mb-3">
                    <p className="text-sm font-medium text-slate-900">{promo.car_name}</p>
                    <p className="text-xs text-slate-500">
                      {promo.car_price && `${promo.car_price} MAD/jour`}
                      {promo.car_category && ` • ${promo.car_category}`}
                    </p>
                  </div>
                )}

                {/* Details Row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {promo.discount_percent > 0 ? (
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      -{promo.discount_percent}%
                    </span>
                  ) : promo.discount_amount > 0 ? (
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      -{promo.discount_amount} MAD
                    </span>
                  ) : null}
                  <span className="text-xs text-slate-500">
                    Jusqu'au {formatDate(promo.end_date)}
                  </span>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleStatus(promo.id, promo.is_active)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      promo.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-slate-900/50" 
              onClick={() => setConfirmDelete(null)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm mx-4 sm:my-8 sm:align-middle relative z-10">
              <div className="bg-white p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">Confirmer la suppression</h3>
                <p className="text-sm text-slate-500 text-center mb-6">
                  Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDeleteAction}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-slate-900/50" 
              onClick={() => setShowModal(false)}
            ></div>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg sm:max-w-2xl mx-4 sm:my-8 sm:align-middle relative z-10"
                 onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-4 sm:px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    {editingPromotion ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSave} className="px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Car Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Voiture associée
                    </label>
                    <select
                      name="car_id"
                      value={formData.car_id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        formErrors.car_id ? 'border-red-500' : 'border-slate-300'
                      }`}
                      disabled={cars.length === 0}
                    >
                      <option value="" disabled>
                        {cars.length === 0 
                          ? 'Aucune voiture disponible' 
                          : 'Sélectionnez une voiture'}
                      </option>
                      {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.car_id && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.car_id}</p>
                    )}
                    {formData.car_id && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-2">Voiture sélectionnée:</p>
                        {(() => {
                          const car = cars.find(c => c.id === formData.car_id);
                          if (!car) return <p className="text-sm text-slate-600">Chargement...</p>;
                          return (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              {car.image && (
                                <img 
                                  src={formatImageUrl(car.image)} 
                                  alt={car.name}
                                  className="w-20 h-16 sm:w-16 sm:h-12 object-cover rounded-lg flex-shrink-0"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-900">{car.name}</p>
                                <p className="text-sm text-slate-500">
                                  {car.price_per_day} MAD/jour • {car.category}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {car.seats} places • {car.transmission} • {car.fuel}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  
                  {/* Title FR */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Titre (FR)
                    </label>
                    <input
                      type="text"
                      name="title_fr"
                      value={formData.title_fr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  {/* Title EN */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Titre (EN)
                    </label>
                    <input
                      type="text"
                      name="title_en"
                      value={formData.title_en}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  {/* Description FR */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description (FR)
                    </label>
                    <textarea
                      name="description_fr"
                      value={formData.description_fr}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Description en français"
                    />
                  </div>
                  
                  {/* Description EN */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description (EN)
                    </label>
                    <textarea
                      name="description_en"
                      value={formData.description_en}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Description in English"
                    />
                  </div>
                  
                  {/* Discount Percent */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Remise (%)
                    </label>
                    <input
                      type="number"
                      name="discount_percent"
                      value={formData.discount_percent}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        formErrors.discount_percent ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.discount_percent && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.discount_percent}</p>
                    )}
                  </div>
                  
                  {/* Discount Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Remise (MAD)
                    </label>
                    <input
                      type="number"
                      name="discount_amount"
                      value={formData.discount_amount}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        formErrors.discount_amount ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.discount_amount && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.discount_amount}</p>
                    )}
                  </div>
                  
                  {/* Code */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Code promo
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 uppercase ${
                        formErrors.code ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="PROMO2024"
                    />
                    {formErrors.code && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
                    )}
                  </div>
                  
                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date de fin *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                        formErrors.end_date ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.end_date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.end_date}</p>
                    )}
                  </div>
                  
                  {/* Active */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Promotion active</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                  >
                    {editingPromotion ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminPromotions;
