import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/AdminLayout';

const AdminCars = () => {
  const navigate = useNavigate();
  const { 
    allCars, 
    fetchAllCars,
    createCar,
    updateCar,
    deleteCar,
    loading,
    initializing,
    isAuthenticated 
  } = useAdmin();

  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Économique',
    price_per_day: '',
    seats: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    available: true,
    doors: 5,
    year_model: 2024,
    description: '',
    features: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Track existing images separately
  const [imagesToDelete, setImagesToDelete] = useState([]); // Track images marked for deletion
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0); // Track selected primary image
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 10;

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchAllCars();
  }, [initializing, isAuthenticated, navigate, fetchAllCars]);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add car data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price_per_day', parseInt(formData.price_per_day));
      formDataToSend.append('seats', parseInt(formData.seats));
      formDataToSend.append('transmission', formData.transmission);
      formDataToSend.append('fuel', formData.fuel);
      formDataToSend.append('available', formData.available);
      formDataToSend.append('doors', parseInt(formData.doors));
      formDataToSend.append('year_model', parseInt(formData.year_model));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('features', JSON.stringify(formData.features.split(',').map(f => f.trim()).filter(f => f)));
      
      // Add files
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Add primary image info
      if (primaryImageIndex >= 0 && primaryImageIndex < previewUrls.length) {
        formDataToSend.append('primary_image_index', primaryImageIndex);
      }

      // When editing, send remaining existing images and images to delete
      if (editingCar) {
        // Send remaining existing images (not marked for deletion)
        const remainingImages = existingImages.filter(img => !imagesToDelete.includes(img));
        if (remainingImages.length > 0) {
          formDataToSend.append('existing_images', JSON.stringify(remainingImages));
        }
        // Send images to delete
        if (imagesToDelete.length > 0) {
          formDataToSend.append('images_to_delete', JSON.stringify(imagesToDelete));
        }
      }

      if (editingCar) {
        await updateCar(editingCar.id, formDataToSend);
      } else {
        await createCar(formDataToSend);
      }
      setShowModal(false);
      setEditingCar(null);
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Économique',
      price_per_day: '',
      seats: 5,
      transmission: 'Manuelle',
      fuel: 'Essence',
      available: true,
      doors: 5,
      year_model: 2024,
      description: '',
      features: ''
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setImagesToDelete([]);
    setPrimaryImageIndex(0);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name || '',
      category: car.category || 'Économique',
      price_per_day: car.price || car.price_per_day || '',
      seats: car.seats || 5,
      transmission: car.transmission || 'Manuelle',
      fuel: car.fuel || 'Essence',
      available: car.available !== undefined ? car.available : true,
      doors: car.doors || 5,
      year_model: car.year_model || 2024,
      description: car.description || '',
      features: Array.isArray(car.features) 
        ? (car.features.length > 0 ? car.features.join(', ') : '') 
        : (car.features && car.features !== '[]' ? car.features : '')
    });
    // Show existing images as previews and track them separately
    let initialImages = [];
    if (car.images && car.images.length > 0) {
      initialImages = car.images.map(img => img.startsWith('http') ? img : `https://server-chi-two-10.vercel.app${img}`);
    } else if (car.image) {
      initialImages = [car.image.startsWith('http') ? car.image : `https://server-chi-two-10.vercel.app${car.image}`];
    }
    setExistingImages(initialImages);
    setPreviewUrls(initialImages);
    setImagesToDelete([]);
    setSelectedFiles([]);
    setPrimaryImageIndex(0); // First image is primary by default
    setShowModal(true);
  };

  const handleDelete = async (carId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      await deleteCar(carId);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    const validFiles = [];
    const errors = [];
    
    files.forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Type non autorisé (seuls JPEG, PNG, GIF, WebP sont acceptés)`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Fichier trop volumineux (max 5MB)`);
        return;
      }
      validFiles.push(file);
    });
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
    }
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...previews]);
    }
  };

  const removeFile = (index) => {
    const urlToRemove = previewUrls[index];
    
    // Check if this is an existing image or a new file
    const isExistingImage = existingImages.includes(urlToRemove);
    
    if (isExistingImage) {
      // Mark existing image for deletion
      setImagesToDelete(prev => [...prev, urlToRemove]);
      // Remove from preview
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // It's a new file, remove from selectedFiles
      // Find the index in selectedFiles by matching preview URL
      const newFileIndex = selectedFiles.findIndex((_, i) => {
        const previewIndex = previewUrls.findIndex(url => url === urlToRemove);
        return previewIndex === index;
      });
      
      if (newFileIndex !== -1) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      }
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const setPrimaryImage = (index) => {
    setPrimaryImageIndex(index);
  };
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = allCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(allCars.length / carsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setShowDetailModal(true);
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="border-b border-slate-100">
      <td className="px-2 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-100 rounded-lg animate-pulse shrink-0"></div>
          <div className="space-y-1">
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
            <div className="h-2 w-16 bg-slate-100 rounded animate-pulse sm:hidden"></div>
          </div>
        </div>
      </td>
      <td className="px-2 sm:px-6 py-3 sm:py-4 hidden sm:table-cell"><div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div></td>
      <td className="px-2 sm:px-6 py-3 sm:py-4"><div className="h-3 w-12 bg-slate-100 rounded animate-pulse"></div></td>
      <td className="px-2 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
        <div className="space-y-1">
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-2 w-12 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </td>
      <td className="px-2 sm:px-6 py-3 sm:py-4 hidden md:table-cell"><div className="h-3 w-8 bg-slate-100 rounded animate-pulse"></div></td>
      <td className="px-2 sm:px-6 py-3 sm:py-4 hidden lg:table-cell"><div className="h-3 w-10 bg-slate-100 rounded animate-pulse"></div></td>
      <td className="px-2 sm:px-6 py-3 sm:py-4 hidden sm:table-cell"><div className="h-5 w-14 bg-slate-100 rounded-full animate-pulse"></div></td>
      <td className="px-2 sm:px-6 py-3 sm:py-4">
        <div className="flex gap-1">
          <div className="h-7 w-7 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-7 w-7 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-7 w-7 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </td>
    </tr>
  );

  const categories = ['Économique', 'Compacte', 'Berline', 'SUV', 'Premium', 'Luxe'];
  const transmissions = ['Manuelle', 'Automatique'];
  const fuels = ['Essence', 'Diesel', 'Électrique', 'Hybride'];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gestion des Voitures</h1>
            <p className="text-sm text-slate-500">Gérez votre flotte de véhicules</p>
          </div>
          <button
            onClick={() => { setEditingCar(null); resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Ajouter une voiture</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-4">
              <table className="w-full min-w-[360px] sm:min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-2 sm:px-6 py-3 w-32 sm:w-40"><div className="h-3 w-16 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3 hidden sm:table-cell"><div className="h-3 w-16 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3"><div className="h-3 w-10 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3 hidden lg:table-cell"><div className="h-3 w-12 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3 hidden md:table-cell"><div className="h-3 w-8 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3 hidden lg:table-cell"><div className="h-3 w-10 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3 hidden sm:table-cell"><div className="h-3 w-12 bg-slate-200 rounded"></div></th>
                    <th className="px-2 sm:px-6 py-3"><div className="h-3 w-14 bg-slate-200 rounded"></div></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[360px] sm:min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Voiture</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Catégorie</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Prix</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Chiffre d'affaires</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Trans.</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Dispo</th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allCars.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-3 sm:px-6 py-8 text-center text-slate-500">
                        Aucune voiture disponible
                      </td>
                    </tr>
                  ) : (
                    currentCars.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50">
                        <td className="px-2 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {car.image ? (
                              <img src={car.image.startsWith('http') ? car.image : `https://server-chi-two-10.vercel.app${car.image}`} alt={car.name} className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-slate-800 truncate">{car.name}</div>
                              <div className="text-[10px] text-slate-500 sm:hidden">{car.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs text-slate-600 whitespace-nowrap hidden sm:table-cell">{car.category}</td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs font-medium text-slate-800 whitespace-nowrap">{car.price} <span className="text-[10px]">MAD</span></td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs text-slate-600 hidden lg:table-cell">
                          <div className="font-semibold text-emerald-600">{(car.total_revenue || 0).toLocaleString()} MAD</div>
                          <div className="text-[10px] text-slate-400">{car.booking_count || 0} réservations</div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs text-slate-600 hidden lg:table-cell">{car.transmission.substring(0, 3)}</td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                            car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {car.available ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4">
                          <div className="flex flex-row gap-1">
                            <button
                              onClick={() => handleShowDetails(car)}
                              className="p-1.5 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition flex items-center justify-center"
                              title="Détails"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(car)}
                              className="p-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center justify-center"
                              title="Modifier"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(car.id)}
                              className="p-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center justify-center"
                              title="Supprimer"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Précédent
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  currentPage === page
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingCar ? 'Modifier la voiture' : 'Ajouter une voiture'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prix/jour (MAD)</label>
                    <input
                      type="number"
                      value={formData.price_per_day}
                      onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Places</label>
                    <input
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Portes</label>
                    <input
                      type="number"
                      value={formData.doors}
                      onChange={(e) => setFormData({ ...formData, doors: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Année</label>
                    <input
                      type="number"
                      value={formData.year_model}
                      onChange={(e) => setFormData({ ...formData, year_model: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transmission</label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                    >
                      {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Carburant</label>
                    <select
                      value={formData.fuel}
                      onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                    >
                      {fuels.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Images de la voiture {editingCar ? '(laisser vide pour conserver les images existantes)' : ''}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  <p className="text-xs text-slate-500 mt-1">Première image = image principale. Max 5MB par image.</p>
                  
                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        {selectedFiles.length > 0 ? 'Nouvelles images:' : 'Images existantes:'}
                      </p>
                      <p className="text-xs text-slate-500 mb-2">Cochez "Principale" pour choisir l'image principale</p>
                      <div className="flex flex-wrap gap-3">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Preview ${index + 1}`} 
                              className={`w-24 h-24 object-cover rounded-lg border-2 ${primaryImageIndex === index ? 'border-red-500' : 'border-slate-200'}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                            {/* Primary image checkbox */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-1 rounded-b-lg">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={primaryImageIndex === index}
                                  onChange={() => setPrimaryImage(index)}
                                  className="w-3 h-3 text-red-600 rounded focus:ring-red-500"
                                />
                                <span className="text-xs text-slate-700">Principale</span>
                              </label>
                            </div>
                            {primaryImageIndex === index && (
                              <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg">
                                ★
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Équipements (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none"
                    placeholder="Climatisation, GPS, Bluetooth..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="available" className="text-sm text-slate-700">Disponible à la location</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading 
                      ? (editingCar ? 'Mise à jour...' : 'Ajout...')
                      : (editingCar ? 'Mettre à jour' : 'Ajouter')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedCar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Détails de la voiture</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Images</h3>
                  {selectedCar.images && selectedCar.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {selectedCar.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.startsWith('http') ? img : `https://server-chi-two-10.vercel.app${img}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                          />
                          {index === 0 && (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                              Principale
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : selectedCar.image ? (
                    <img
                      src={selectedCar.image.startsWith('http') ? selectedCar.image : `https://server-chi-two-10.vercel.app${selectedCar.image}`}
                      alt={selectedCar.name}
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200"
                    />
                  ) : (
                    <p className="text-slate-500">Aucune image disponible</p>
                  )}
                </div>

                {/* Informations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Nom</p>
                    <p className="font-medium text-slate-800">{selectedCar.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Catégorie</p>
                    <p className="font-medium text-slate-800">{selectedCar.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Prix/jour</p>
                    <p className="font-medium text-slate-800">{selectedCar.price} MAD</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Places</p>
                    <p className="font-medium text-slate-800">{selectedCar.seats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Portes</p>
                    <p className="font-medium text-slate-800">{selectedCar.doors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Année</p>
                    <p className="font-medium text-slate-800">{selectedCar.year_model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Transmission</p>
                    <p className="font-medium text-slate-800">{selectedCar.transmission}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Carburant</p>
                    <p className="font-medium text-slate-800">{selectedCar.fuel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Chiffre d'affaires</p>
                    <p className="font-bold text-emerald-600">{(selectedCar.total_revenue || 0).toLocaleString()} MAD</p>
                    <p className="text-xs text-slate-400">{selectedCar.booking_count || 0} réservations confirmées</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Disponible</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCar.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedCar.available ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {selectedCar.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                    <p className="text-slate-600">{selectedCar.description}</p>
                  </div>
                )}

                {/* Équipements */}
                {selectedCar.features && selectedCar.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Équipements</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCar.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleEdit(selectedCar);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
