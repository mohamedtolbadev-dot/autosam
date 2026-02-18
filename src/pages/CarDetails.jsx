import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../context/CarContext';
import { useCurrency } from '../context/CurrencyContext';
import { isValidCarId } from '../utils/security';

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

// SVG Icons
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
  const [searchParams] = useSearchParams();
  const { selectedCar, fetchCarById, loading, error } = useCars();
  const { formatPrice } = useCurrency();
  const { t, i18n } = useTranslation(['cars', 'common', 'booking']);
  
  const car = selectedCar;

  // Get URL params for pre-filling form
  const urlLocation = searchParams.get('location') || '';
  const urlDropoffLocation = searchParams.get('dropoffLocation') || '';
  const urlStartDate = searchParams.get('startDate') || '';
  const urlEndDate = searchParams.get('endDate') || '';

  const [activeImage, setActiveImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  // Load car on mount
  useEffect(() => {
    if (id && isValidCarId(id)) {
      fetchCarById(id);
    } else if (id && !isValidCarId(id)) {
      navigate('/cars');
    }
  }, [id, fetchCarById, navigate]);

  // Set initial active image when car is loaded
  useEffect(() => {
    if (car) {
      setActiveImage(car.image);
    }
  }, [car]);
  
  const inputBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition';
  const selectBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition cursor-pointer appearance-none';

  // Get all images array (main + additional) for lightbox
  const allImages = car ? [
    car.image,
    ...(car.images || []).filter(img => img !== car.image)
  ].filter(Boolean) : [];

  // Lightbox navigation functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Mobile navigation
  const nextMobileImage = () => {
    const nextIndex = (currentMobileIndex + 1) % allImages.length;
    setCurrentMobileIndex(nextIndex);
    setActiveImage(allImages[nextIndex]);
  };

  const prevMobileImage = () => {
    const prevIndex = (currentMobileIndex - 1 + allImages.length) % allImages.length;
    setCurrentMobileIndex(prevIndex);
    setActiveImage(allImages[prevIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  const [rentalForm, setRentalForm] = useState({
    pickupLocation: urlLocation,
    dropoffLocation: urlDropoffLocation,
    startDate: urlStartDate,
    endDate: urlEndDate
  });

  const getTodayInputValue = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayInputValue = getTodayInputValue();

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const parseInputDate = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const toInputDate = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const openDateModal = (field) => {
    setActiveDateField(field);
    const current = field === 'start' ? rentalForm.startDate : rentalForm.endDate;
    const currentDate = parseInputDate(current);
    const base = currentDate || new Date();
    setCalendarMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    setDateModalOpen(true);
  };

  const closeDateModal = () => {
    setDateModalOpen(false);
    setActiveDateField(null);
  };

  const minSelectableInputValue =
    activeDateField === 'end' ? (rentalForm.startDate || todayInputValue) : todayInputValue;
  const minSelectableDate = parseInputDate(minSelectableInputValue);

  const selectDate = (date) => {
    const value = toInputDate(date);
    if (activeDateField === 'start') {
      setRentalForm((prev) => {
        const next = { ...prev, startDate: value };
        if (next.endDate && value && next.endDate < value) {
          next.endDate = '';
        }
        return next;
      });
    }
    if (activeDateField === 'end') {
      setRentalForm((prev) => ({ ...prev, endDate: value }));
    }
    closeDateModal();
  };

  const clearActiveDate = () => {
    if (activeDateField === 'start') {
      setRentalForm((prev) => ({ ...prev, startDate: '', endDate: '' }));
    }
    if (activeDateField === 'end') {
      setRentalForm((prev) => ({ ...prev, endDate: '' }));
    }
    closeDateModal();
  };

  const monthLabel = (date) =>
    date.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

  const isDateRangeValid =
    rentalForm.startDate >= todayInputValue &&
    rentalForm.endDate >= (rentalForm.startDate || todayInputValue);

  const isRentalFormValid =
    Boolean(rentalForm.pickupLocation) &&
    Boolean(rentalForm.startDate) &&
    Boolean(rentalForm.endDate) &&
    rentalForm.startDate !== rentalForm.endDate &&
    isDateRangeValid;

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

  const additionalImages = car.images?.filter(img => img !== car.image) || [];

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
            <span>{t('common:actions.back')}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4 sm:py-6 lg:py-8 min-w-0 space-y-6">
        {/* Image Gallery - Mobile & Desktop */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile: Single image with counter and arrows */}
          <div className="md:hidden relative aspect-[4/3] bg-slate-100 overflow-hidden">
            {activeImage ? (
              <>
                <img
                  src={activeImage.startsWith('http') ? activeImage : `https://server-chi-two-10.vercel.app${activeImage}`}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  onClick={() => openLightbox(currentMobileIndex)}
                />
                {/* Counter */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 text-white text-sm font-semibold rounded-full">
                  {currentMobileIndex + 1} / {allImages.length}
                </div>
                {/* Left arrow */}
                {allImages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevMobileImage();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg text-slate-800"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                )}
                {/* Right arrow */}
                {allImages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextMobileImage();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg text-slate-800"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconCar className="w-20 h-20 text-slate-300" />
              </div>
            )}
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-5 gap-2 p-2">
            {/* Main large image - takes 3 columns */}
            <div className="md:col-span-3 relative aspect-[4/3] md:aspect-auto md:h-full bg-slate-100 rounded-xl overflow-hidden cursor-pointer group" onClick={() => openLightbox(0)}>
              {activeImage ? (
                <>
                  <img
                    src={activeImage.startsWith('http') ? activeImage : `https://server-chi-two-10.vercel.app${activeImage}`}
                    alt={car.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IconCar className="w-20 h-20 sm:w-24 sm:h-24 text-slate-300" />
                </div>
              )}
            </div>

            {/* Right side - 2 stacked images */}
            <div className="md:col-span-2 grid grid-rows-2 gap-2">
              {/* First additional image */}
              {additionalImages[0] ? (
                <div 
                  className="relative aspect-[16/9] md:aspect-auto bg-slate-100 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(1)}
                >
                  <img
                    src={additionalImages[0].startsWith('http') ? additionalImages[0] : `https://server-chi-two-10.vercel.app${additionalImages[0]}`}
                    alt="Image 1"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ) : (
                <div className="relative aspect-[16/9] md:aspect-auto bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                  <IconCar className="w-12 h-12 text-slate-200" />
                </div>
              )}

              {/* Second additional image with View all photos */}
              <div 
                className="relative aspect-[16/9] md:aspect-auto bg-slate-100 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(2)}
              >
                {additionalImages[1] ? (
                  <img
                    src={additionalImages[1].startsWith('http') ? additionalImages[1] : `https://server-chi-two-10.vercel.app${additionalImages[1]}`}
                    alt="Image 2"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconCar className="w-12 h-12 text-slate-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(0);
                    }}
                    className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-800 px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Afficher toutes les photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details + Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Car Details - Left Column */}
          <div className="lg:col-span-2 space-y-6">
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

              {/* Specs */}
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

          {/* Booking Sidebar - Right Column */}
          <div className="lg:col-span-1 lg:order-last">
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
                    {t('booking:form.pickup')}
                  </label>
                  <select
                    className={`${selectBaseClassName} text-sm`}
                    value={rentalForm.pickupLocation}
                    onChange={(e) => setRentalForm({ ...rentalForm, pickupLocation: e.target.value })}
                  >
                    <option value="">{t('booking:form.pickup')}</option>
                    <option value="casablanca_airport">{t('common:cities.casablanca')} - {t('common:locations.airport')}</option>
                    <option value="casablanca_city">{t('common:cities.casablanca')} - {t('common:locations.cityCenter')}</option>
                    <option value="casablanca_train">{t('common:cities.casablanca')} - {t('common:locations.trainStation')}</option>
                    <option value="rabat_airport">{t('common:cities.rabat')} - {t('common:locations.airport')}</option>
                    <option value="rabat_city">{t('common:cities.rabat')} - {t('common:locations.cityCenter')}</option>
                    <option value="rabat_train">{t('common:cities.rabat')} - {t('common:locations.trainStation')}</option>
                    <option value="marrakech_airport">{t('common:cities.marrakech')} - {t('common:locations.airport')}</option>
                    <option value="marrakech_city">{t('common:cities.marrakech')} - {t('common:locations.cityCenter')}</option>
                    <option value="marrakech_train">{t('common:cities.marrakech')} - {t('common:locations.trainStation')}</option>
                    <option value="fes_airport">{t('common:cities.fes')} - {t('common:locations.airport')}</option>
                    <option value="fes_city">{t('common:cities.fes')} - {t('common:locations.cityCenter')}</option>
                    <option value="fes_train">{t('common:cities.fes')} - {t('common:locations.trainStation')}</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    <IconMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    {t('booking:form.dropoff')}
                  </label>
                  <select
                    className={`${selectBaseClassName} text-sm`}
                    value={rentalForm.dropoffLocation}
                    onChange={(e) => setRentalForm({ ...rentalForm, dropoffLocation: e.target.value })}
                  >
                    <option value="">{t('booking:form.dropoff')}</option>
                    <option value="casablanca_airport">{t('common:cities.casablanca')} - {t('common:locations.airport')}</option>
                    <option value="casablanca_city">{t('common:cities.casablanca')} - {t('common:locations.cityCenter')}</option>
                    <option value="casablanca_train">{t('common:cities.casablanca')} - {t('common:locations.trainStation')}</option>
                    <option value="rabat_airport">{t('common:cities.rabat')} - {t('common:locations.airport')}</option>
                    <option value="rabat_city">{t('common:cities.rabat')} - {t('common:locations.cityCenter')}</option>
                    <option value="rabat_train">{t('common:cities.rabat')} - {t('common:locations.trainStation')}</option>
                    <option value="marrakech_airport">{t('common:cities.marrakech')} - {t('common:locations.airport')}</option>
                    <option value="marrakech_city">{t('common:cities.marrakech')} - {t('common:locations.cityCenter')}</option>
                    <option value="marrakech_train">{t('common:cities.marrakech')} - {t('common:locations.trainStation')}</option>
                    <option value="fes_airport">{t('common:cities.fes')} - {t('common:locations.airport')}</option>
                    <option value="fes_city">{t('common:cities.fes')} - {t('common:locations.cityCenter')}</option>
                    <option value="fes_train">{t('common:cities.fes')} - {t('common:locations.trainStation')}</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    <IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    {t('booking:form.startDate')}
                  </label>
                  <input
                    type="text"
                    readOnly
                    name="startDate"
                    placeholder="Date de début"
                    value={rentalForm.startDate}
                    onClick={() => openDateModal('start')}
                    className={`${inputBaseClassName} text-sm`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    <IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                    {t('booking:form.endDate')}
                  </label>
                  <input
                    type="text"
                    readOnly
                    name="endDate"
                    placeholder="Date de fin"
                    value={rentalForm.endDate}
                    onClick={() => openDateModal('end')}
                    className={`${inputBaseClassName} text-sm`}
                  />
                </div>
              </div>

              <Link
                to={`/booking?car=${car.id}&location=${encodeURIComponent(rentalForm.pickupLocation)}&dropoffLocation=${encodeURIComponent(rentalForm.dropoffLocation)}&startDate=${rentalForm.startDate}&endDate=${rentalForm.endDate}`}
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

      {/* Date Modal */}
      {dateModalOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close"
            onClick={closeDateModal}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
          />

          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {activeDateField === 'start' ? t('booking:form.startDate') : t('booking:form.endDate')}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{monthLabel(calendarMonth)}</p>
                </div>
                <button
                  type="button"
                  onClick={closeDateModal}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-600"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <div className="text-sm font-bold text-slate-900">
                  {monthLabel(calendarMonth)}
                </div>
                <button
                  type="button"
                  onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="grid grid-cols-7 gap-1 text-[11px] font-semibold text-slate-500 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="text-center py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const firstOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
                    const startDay = firstOfMonth.getDay();
                    const gridStart = new Date(firstOfMonth);
                    gridStart.setDate(firstOfMonth.getDate() - startDay);

                    const selectedValue =
                      activeDateField === 'start' ? rentalForm.startDate : rentalForm.endDate;
                    const selectedDate = parseInputDate(selectedValue);

                    const cells = [];
                    for (let i = 0; i < 42; i++) {
                      const cellDate = new Date(gridStart);
                      cellDate.setDate(gridStart.getDate() + i);

                      const inMonth = cellDate.getMonth() === calendarMonth.getMonth();
                      const disabled = minSelectableDate ? cellDate < minSelectableDate : false;
                      const isSelected =
                        selectedDate && toInputDate(selectedDate) === toInputDate(cellDate);

                      const base =
                        'h-10 w-10 mx-auto rounded-xl text-sm font-semibold transition flex items-center justify-center';
                      const classes = disabled
                        ? `${base} text-slate-300 cursor-not-allowed`
                        : isSelected
                          ? `${base} bg-red-600 text-white shadow-sm`
                          : inMonth
                            ? `${base} text-slate-800 hover:bg-red-50 hover:text-red-700`
                            : `${base} text-slate-400 hover:bg-slate-50`;

                      cells.push(
                        <button
                          key={toInputDate(cellDate)}
                          type="button"
                          disabled={disabled}
                          onClick={() => selectDate(cellDate)}
                          className={classes}
                        >
                          {cellDate.getDate()}
                        </button>
                      );
                    }
                    return cells;
                  })()}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={clearActiveDate}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    {t('actions.clear')}
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDate(parseInputDate(minSelectableInputValue) || new Date())}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                  >
                    {t('actions.today')}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
            {currentImageIndex + 1} / {allImages.length}
          </div>

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 sm:left-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            className="relative w-full h-full flex items-center justify-center px-16 sm:px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={ 
                allImages[currentImageIndex]?.startsWith('http')
                  ? allImages[currentImageIndex]
                  : `http://localhost:5000${allImages[currentImageIndex]}`
              }
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 sm:right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {allImages.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-2xl overflow-x-auto max-w-[90vw]">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation() ;
                    setCurrentImageIndex(index);
                  }}
                  className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-red-500'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img?.startsWith('http') ? img : `http://localhost:5000${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarDetails;
