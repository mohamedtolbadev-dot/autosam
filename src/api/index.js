const API_URL = 'https://server-chi-two-10.vercel.app/api';

/**
 * Fonction API générique pour appeler le backend
 * @param {string} endpoint - Route API (ex: '/cars')
 * @param {Object} options - Options fetch (method, body, etc.)
 * @returns {Promise} - Données JSON
 */
export const api = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Check if body is FormData - don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData;
  
  // Get token from localStorage - check for both admin and customer tokens
  const adminToken = localStorage.getItem('adminToken');
  const customerToken = localStorage.getItem('customerToken');
  const token = adminToken || customerToken; // Use whichever is available
  
  console.log('🔑 API call to', endpoint, '- Admin token:', !!adminToken, '- Customer token:', !!customerToken, '- Using token:', token ? token.substring(0, 20) + '...' : 'none');
  
  const config = {
    ...options,
    headers: {
      // Only set Content-Type if not FormData (browser will set with boundary)
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      // Add Authorization header if token exists
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Clone response before reading to allow retry
      const errorResponse = response.clone();
      let errorMessage;
      let errorData = {};
      try {
        errorData = await errorResponse.json();
        errorMessage = errorData.message || `HTTP ${response.status}`;
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}`;
      }
      
      // Add status code to error message for better handling
      if (response.status === 401) {
        console.error('❌ 401 Unauthorized - Token may be invalid or expired');
        throw new Error(`401 - ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }
    
    // Try to parse as JSON, fallback to text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Fonctions spécifiques pour les voitures
export const carApi = {
  getAll: () => api('/cars'),
  getById: (id) => api(`/cars/${id}`),
  create: (data) => api('/cars', { method: 'POST', body: JSON.stringify(data) }),
};

// Fonctions spécifiques pour les messages de contact
export const contactApi = {
  submit: (data) => api('/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// Fonctions spécifiques pour les réservations
export const bookingApi = {
  getAll: () => api('/bookings'),
  getById: (id) => api(`/bookings/${id}`),
  getMyBookings: () => api('/bookings/my-bookings'),
  create: (data) => api('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => api(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id) => api(`/bookings/${id}`, { method: 'DELETE' }),
};

// Fonctions spécifiques pour l'authentification client
export const authApi = {
  register: (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  getProfile: () => api('/auth/profile'),
  updateProfile: (data) => api('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
