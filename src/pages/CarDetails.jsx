import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../context/CarContext';
import { useCurrency } from '../context/CurrencyContext';

// Utility function to calculate tiered pricing options
const getRentalOptions = (pricePerDay) => {
  const tiers = [
    { days: 1, factor: 1 },
    { days: 3, factor: 0.92 },
    { days: 7, factor: 0.84 },
    { days: 14, factor: 0.76 },
    { days: 30, factor: 0.68 }
  ];
  return tiers.map(({ days, factor }) => ({
    days,
    pricePerDay: Math.round(pricePerDay * factor),
    total: Math.round(pricePerDay * factor * days)
  }));
};

// Inline SVG icons (aligned with Home.jsx / Cars.jsx)
const IconCar = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H8.5a1 1 0 0 0-.8.4L5 11l-.16.01a1 1 0 0 0-.84.99V16h3" />
    <path d="M17 21H7a2 2 0 0 1-2-2v-3h14v3a2 2 0 0 1-2 2Z" />
  </svg>
);
const IconUsers = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCog = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconFuel = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="15" y2="22" />
    <line x1="4" y1="9" x2="14" y2="9" />
    <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 6" />
  </svg>
);
const IconShield = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconMapPin = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCalendar = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconArrowLeft = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const IconCheck = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconDoor = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 3v18h18V3M9 9v6M15 9v6" />
  </svg>
);

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCar, fetchCarById, loading, error } = useCars();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation(['cars', 'common', 'booking']);
  
  // Load car on mount
  useEffect(() => {
    if (id) {
      fetchCarById(id);
    }
  }, [id, fetchCarById]);
  
  const car = selectedCar;
  const rentalOptions = car ? getRentalOptions(car.price) : [];

  const inputBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition';
  const selectBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition cursor-pointer appearance-none';

  const [rentalForm, setRentalForm] = useState({
    pickupLocation: '',
    startDate: '',
    endDate: ''
  });

  const isRentalFormValid =
    Boolean(rentalForm.pickupLocation) && Boolean(rentalForm.startDate) && Boolean(rentalForm.endDate);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-4 animate-pulse">
            <IconCar className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">{t('cars.loading')}</h1>
          <p className="text-slate-600">{t('cars.loadingDetails')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">{t('cars.error')}</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('common:actions.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">{t('cars.empty')}</h1>
          <p className="text-slate-600 mb-4">{t('cars.emptyDetails')}</p>
          <Link to="/cars" className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700">
            <IconArrowLeft className="w-5 h-5" />
            {t('common:actions.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3 sm:py-4 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg text-sm sm:text-base"
          >
            <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="hidden sm:inline">{t('common:actions.back')}</span>
            <span className="sm:hidden">{t('common:actions.back')}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4 sm:py-6 lg:py-8 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image + thumbnails */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="aspect-[16/10] sm:aspect-[4/3] max-h-[300px] sm:max-h-[380px] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {car.image ? (
                  <img
                    src={car.image.startsWith('http') ? car.image : `http://localhost:5000${car.image}`}
                    alt={car.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <IconCar className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-3 border-t border-slate-100">
                {car.images && car.images.length > 0 ? (
                  car.images.slice(0, 3).map((img, index) => (
                    <div key={index} className="aspect-video bg-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden">
                      <img 
                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`} 
                        alt={`Image ${index + 1}`} 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" 
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-slate-400 text-sm">
                    {t('cars.noAdditionalImages')}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start gap-3 sm:gap-4 mb-4">
                <div className="min-w-0 space-y-1 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
                    {car.name}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600">
                    {car.category} • {car.year}
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-700 border border-slate-200">
                      <IconFuel className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-slate-500" />
                      {car.fuel}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-700 border border-slate-200">
                      <IconCog className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-slate-500" />
                      {car.transmission}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-700 border border-slate-200">
                      <IconUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-slate-500" />
                      {car.seats} {t('cars.seats')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2 shrink-0 w-full sm:w-auto">
                  {car.available ? (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-50 text-emerald-700 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold">
                      <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                      {t('cars.available')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-50 text-red-700 px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold">
                      <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
                      {t('cars.notAvailable')}
                    </span>
                  )}
                  <div className="text-right text-xs text-slate-500 ml-auto sm:ml-0">
                    <p>{t('cars.from')}</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                      {formatPrice(car.price)} <span className="text-[10px] sm:text-xs font-semibold text-slate-600">{t('cars.perDay')}</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6 leading-relaxed">
                {car.description}
              </p>

              {/* Specs — icons and colors aligned */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-5 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconUsers className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-slate-500">{t('cars.seatsLabel')}</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">{car.seats}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconCog className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-slate-500">{t('specs.transmission')}</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconFuel className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-slate-500">{t('specs.fuel')}</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">{car.fuel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconDoor className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-slate-500">{t('cars.doors')}</p>
                    <p className="font-semibold text-slate-800 text-sm sm:text-base">{car.doors}</p>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-3">{t('cars.equipments')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <IconCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Included */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-3">{t('cars.included')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {car.included.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3">
                    <IconShield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6 lg:sticky lg:top-4">
              <div className="text-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100">
                <p className="text-slate-500 text-xs sm:text-sm mb-1">{t('booking.startingFrom')}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">{formatPrice(car.price)}</p>
                <p className="text-slate-500 text-xs sm:text-sm">{t('common:currency.perDay')}</p>
              </div>

              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    <IconMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    {t('booking.pickupLocation')}
                  </label>
                  <select
                    className={`${selectBaseClassName} text-sm`}
                    value={rentalForm.pickupLocation}
                    onChange={(e) => setRentalForm({ ...rentalForm, pickupLocation: e.target.value })}
                  >
                    <option value="">{t('booking.pickupLocation')}</option>
                    <option>{t('booking.casablanca')}</option>
                    <option>{t('booking.rabat')}</option>
                    <option>{t('booking.marrakech')}</option>
                    <option>{t('booking.fes')}</option>
                    <option>{t('booking.tanger')}</option>
                    <option>{t('booking.agadir')}</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    <IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    {t('booking:form.startDate')}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={rentalForm.startDate}
                    onChange={(e) => setRentalForm({ ...rentalForm, startDate: e.target.value })}
                    className={`${inputBaseClassName} text-sm`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    <IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    {t('booking:form.endDate')}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={rentalForm.endDate}
                    onChange={(e) => setRentalForm({ ...rentalForm, endDate: e.target.value })}
                    className={`${inputBaseClassName} text-sm`}
                  />
                </div>
              </div>

              <Link
                to={`/booking?car=${car.id}&location=${encodeURIComponent(rentalForm.pickupLocation)}&startDate=${rentalForm.startDate}&endDate=${rentalForm.endDate}`}
                aria-disabled={!car.available || !isRentalFormValid}
                className={`block w-full text-center py-2.5 sm:py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base ${
                  car.available && isRentalFormValid
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md active:shadow-sm'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!car.available || !isRentalFormValid) e.preventDefault();
                }}
              >
                {!car.available
                  ? t('cars.notAvailableButton')
                  : !isRentalFormValid
                    ? t('cars.completeDates')
                    : t('cars.bookNow')}
              </Link>

              <p className="text-[10px] sm:text-xs text-slate-500 text-center mt-3 sm:mt-4">
                {t('booking.freeCancellation')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;