const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fonction API générique pour appeler le backend
 * @param {string} endpoint - Route API (ex: '/cars')
 * @param {Object} options - Options fetch (method, body, etc.)
 * @returns {Promise} - Données JSON
 */
export const api = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Get the token from options if explicitly provided, otherwise don't send any token
  // This prevents mixing admin and customer tokens
  const token = options.token || null;
  
  // Check if body is FormData - don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData;
  
  const config = {
    ...options,
    headers: {
      // Only set Content-Type if not FormData (browser will set with boundary)
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Clone response before reading to allow retry
      const errorResponse = response.clone();
      let errorMessage;
      try {
        const error = await errorResponse.json();
        errorMessage = error.message || `HTTP ${response.status}`;
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}`;
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
  getMyBookings: () => {
    const token = localStorage.getItem('token');
    return api('/bookings/my-bookings', { token });
  },
  create: (data) => api('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => api(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id) => api(`/bookings/${id}`, { method: 'DELETE' }),
};

// Fonctions spécifiques pour l'authentification client
export const authApi = {
  register: (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => {
    const token = localStorage.getItem('token');
    return api('/auth/profile', { token });
  },
  updateProfile: (data) => {
    const token = localStorage.getItem('token');
    return api('/auth/profile', { method: 'PUT', body: JSON.stringify(data), token });
  },
};

export default api;
