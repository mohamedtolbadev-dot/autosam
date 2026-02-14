import { createContext, useContext, useState, useCallback } from 'react';
import { bookingApi } from '../api';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer toutes les réservations (admin)
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getAll();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des réservations');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer mes réservations
  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getMyBookings();
      setMyBookings(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de vos réservations');
      console.error('Error fetching my bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer une réservation par ID
  const fetchBookingById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getById(id);
      setCurrentBooking(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de la réservation');
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une réservation
  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingApi.create(bookingData);
      setCurrentBooking(result);
      return result;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la réservation');
      console.error('Error creating booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      await bookingApi.updateStatus(id, status);
      // Mettre à jour la liste locale
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      setMyBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      console.error('Error updating booking status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Annuler une réservation
  const cancelBooking = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await bookingApi.delete(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      setMyBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'annulation');
      console.error('Error cancelling booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    bookings,
    myBookings,
    currentBooking,
    loading,
    error,
    setCurrentBooking,
    fetchBookings,
    fetchMyBookings,
    fetchBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings doit être utilisé dans un BookingProvider');
  }
  return context;
};

export default BookingContext;
