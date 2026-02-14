import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { carApi } from '../api';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  // Charger toutes les voitures
  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carApi.getAll();
      setCars(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des voitures');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger une voiture par ID
  const fetchCarById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await carApi.getById(id);
      setSelectedCar(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du véhicule');
      console.error('Error fetching car:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les voitures au montage
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const value = {
    cars,
    loading,
    error,
    selectedCar,
    setSelectedCar,
    fetchCars,
    fetchCarById,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars doit être utilisé dans un CarProvider');
  }
  return context;
};

export default CarContext;
