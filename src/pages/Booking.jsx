import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../context/CarContext';
import { useBookings } from '../context/BookingContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCustomer } from '../context/CustomerContext';

// Icônes SVG inline (alignées avec Home / Cars / CarDetails)
const IconUser = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMail = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconPhone = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
const IconCreditCard = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <path d="M1 10h22" />
  </svg>
);
const IconShield = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconInfo = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const Booking = () => {
  const { t } = useTranslation('booking');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cars, loading: carsLoading } = useCars();
  const { createBooking, loading: bookingLoading, error: bookingError } = useBookings();
  const { formatPrice } = useCurrency();
  const { customer, isAuthenticated } = useCustomer();
  
  const carId = searchParams.get('car');
  const searchLocation = searchParams.get('location');
  const searchStartDate = searchParams.get('startDate');
  const searchEndDate = searchParams.get('endDate');

  // Trouver la voiture depuis le contexte (serveur)
  const car = cars.find(c => c.id === Number(carId)) || cars[0] || { 
    name: t('messages.loading'), 
    category: '', 
    price: 0, 
    image: '' 
  };

  const inputBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition';
  const selectBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition cursor-pointer appearance-none';
  const inputSmallClassName =
    'w-full rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    pickupLocation: searchLocation || 'Casablanca',
    dropoffLocation: searchLocation || 'Casablanca',
    pickupDate: searchStartDate || '',
    dropoffDate: searchEndDate || '',
    additionalDriver: false,
    gps: false,
    childSeat: false,
    insurance: ''
  });

  // Pre-fill form with customer data when available
  useEffect(() => {
    if (isAuthenticated && customer) {
      setFormData(prev => ({
        ...prev,
        firstName: customer.first_name || prev.firstName,
        lastName: customer.last_name || prev.lastName,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone
      }));
    }
  }, [isAuthenticated, customer]);

  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.dropoffDate) return 0;
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.dropoffDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    let total = car.price * days;
    
    if (formData.gps) total += 50 * days;
    if (formData.childSeat) total += 30 * days;
    if (formData.insurance === 'premium') total += 100 * days;
    
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Envoyer la réservation au serveur
      try {
        const bookingData = {
          car_id: Number(carId),
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          pickup_location: formData.pickupLocation,
          pickup_date: formData.pickupDate,
          return_date: formData.dropoffDate,
          total_price: calculateTotal(),
          notes: `Permis: ${formData.licenseNumber}, Options: ${formData.gps ? 'GPS ' : ''}${formData.childSeat ? 'Siège bébé ' : ''}Assurance: ${formData.insurance}`
        };
        
        await createBooking(bookingData);
        // Skip success modal, directly show account prompt or redirect
        if (!isAuthenticated) {
          setShowAccountPrompt(true);
        } else {
          navigate('/');
        }
      } catch (error) {
        alert('Erreur lors de la réservation: ' + error.message);
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const canGoNextFromStep1 = () => {
    const hasRequired =
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.licenseNumber &&
      formData.pickupDate &&
      formData.dropoffDate;

    return hasRequired && calculateDays() > 0;
  };


  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('messages.success')}
        >
          <div className="absolute inset-0 bg-slate-900/60" onClick={handleCloseSuccessModal} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <IconShield className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900">{t('messages.success')}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {t('messages.successDesc')}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleCloseSuccessModal}
                className="px-4 py-2.5 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Creation Prompt Modal - Elegant Compact Design */}
      {showAccountPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Créer un compte"
        >
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowAccountPrompt(false)} />
          <div className="relative z-10 w-full max-w-xs rounded-2xl bg-white shadow-2xl p-6 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">Réservation confirmée !</h3>
            <p className="text-sm text-slate-500 mb-5">
              N° #{Math.floor(Math.random() * 9000) + 1000}
            </p>

            {/* Benefits */}
            <div className="bg-slate-50 rounded-xl p-4 mb-5 text-left">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 text-center">
                Créez un compte pour
              </p>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <div>
                    <span className="font-medium">Suivre votre réservation</span>
                    <p className="text-xs text-slate-500">En temps réel, 24h/24</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <div>
                    <span className="font-medium">Recevoir une confirmation</span>
                    <p className="text-xs text-slate-500">Notification dès validation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div>
                    <span className="font-medium">Modifier ou annuler</span>
                    <p className="text-xs text-slate-500">Gérez votre réservation facilement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Créer mon compte
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAccountPrompt(false);
                  navigate('/');
                }}
                className="w-full py-2 px-4 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800">
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-14 min-w-0">
          <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">{t('title')}</p>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 text-white">{t('heroTitle')}</h1>
          <p className="text-slate-200 text-sm sm:text-lg">{t('heroSubtitle')}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4 sm:py-8 min-w-0">
        {/* Étapes */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center px-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-colors ${
                  s <= step ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-10 sm:w-16 lg:w-24 h-1 transition-colors ${s < step ? 'bg-red-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 gap-4 sm:gap-8 lg:gap-20">
            <span className={`text-[10px] sm:text-xs lg:text-sm ${step >= 1 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              {t('steps.dates')}
            </span>
            <span className={`text-[10px] sm:text-xs lg:text-sm ${step >= 2 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              {t('steps.options')}
            </span>
            <span className={`text-[10px] sm:text-xs lg:text-sm ${step >= 3 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              {t('steps.confirm')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Récapitulatif - Sidebar (top on mobile) */}
          <div className="lg:col-span-1 order-first lg:order-last min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6 lg:sticky lg:top-4 space-y-4 sm:space-y-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-4">{t('summary.title')}</h3>

              <div className="flex gap-3 mb-2">
                <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                  {car.image ? (
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] sm:text-xs text-slate-400">{t('vehicle.preview')}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{car.name}</p>
                  <p className="text-xs sm:text-sm text-slate-500">{car.category}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">{formData.pickupLocation} → {formData.dropoffLocation}</p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>{t('form.startDate')}</span>
                  <span className="font-medium">{formData.pickupDate ? new Date(formData.pickupDate).toLocaleDateString('fr-FR') : '—'}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>{t('form.endDate')}</span>
                  <span className="font-medium">{formData.dropoffDate ? new Date(formData.dropoffDate).toLocaleDateString('fr-FR') : '—'}</span>
                </div>
              </div>

              {calculateDays() > 0 && (
                <>
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-100">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-600">{t('summary.rental')} ({calculateDays()} {t('summary.days')})</span>
                      <span className="font-semibold text-slate-800">{formatPrice(car.price * calculateDays())}</span>
                    </div>
                    {formData.gps && <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('options.gps.title')}</span><span className="font-semibold text-slate-800">{formatPrice(50 * calculateDays())}</span></div>}
                    {formData.childSeat && <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('options.childSeat.title')}</span><span className="font-semibold text-slate-800">{formatPrice(30 * calculateDays())}</span></div>}
                    {formData.insurance === 'premium' && <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('insurance.premium.title')}</span><span className="font-semibold text-slate-800">{formatPrice(100 * calculateDays())}</span></div>}
                  </div>
                  <div className="flex justify-between items-center pt-2 mb-4 sm:mb-6">
                    <span className="text-base sm:text-lg font-bold text-slate-800">{t('summary.total')}</span>
                    <span className="text-xl sm:text-2xl font-bold text-red-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconShield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 min-w-0">
                    <p className="font-semibold text-slate-800 mb-1">{t('included.title')}</p>
                    <ul className="space-y-0.5 sm:space-y-1 text-slate-600 text-xs sm:text-sm">
                      <li>• {t('included.allRisk')}</li>
                      <li>• {t('included.unlimited')}</li>
                      <li>• {t('included.assistance')}</li>
                      <li>• {t('included.cancellation')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2 min-w-0 order-last lg:order-first">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">{t('form.yourInfo')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.firstName')} *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder={t('form.firstNamePlaceholder')} className={`${inputBaseClassName} text-sm sm:text-base`} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.lastName')} *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder={t('form.lastNamePlaceholder')} className={`${inputBaseClassName} text-sm sm:text-base`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.email')} *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t('form.emailPlaceholder')} className={`${inputBaseClassName} text-sm sm:text-base`} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.phone')} *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder={t('form.phonePlaceholder')} className={`${inputBaseClassName} text-sm sm:text-base`} />
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconCreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.license')} *</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required placeholder={t('form.licensePlaceholder')} className={`${inputBaseClassName} text-sm sm:text-base`} />
                  </div>
                  <hr className="my-4 sm:my-6 border-slate-200" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">{t('form.rentalDetails')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.pickup')} *</label>
                      <select name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={`${selectBaseClassName} text-sm sm:text-base`}>
                        <option>Casablanca</option><option>Rabat</option><option>Marrakech</option><option>Fès</option><option>Tanger</option><option>Agadir</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.dropoff')} *</label>
                      <select name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={`${selectBaseClassName} text-sm sm:text-base`}>
                        <option>Casablanca</option><option>Rabat</option><option>Marrakech</option><option>Fès</option><option>Tanger</option><option>Agadir</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.startDate')} *</label>
                      <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required className={`${inputBaseClassName} text-sm sm:text-base`} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2"><IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />{t('form.endDate')} *</label>
                      <input type="date" name="dropoffDate" value={formData.dropoffDate} onChange={handleChange} required className={`${inputBaseClassName} text-sm sm:text-base`} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">{t('options.title')}</h2>
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-slate-50/50 hover:border-slate-300 transition-colors">
                      <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                        <input type="checkbox" name="gps" checked={formData.gps} onChange={handleChange} className="mt-0.5 sm:mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="min-w-0"><p className="font-semibold text-slate-800 text-sm sm:text-base">{t('options.gps.title')}</p><p className="text-xs sm:text-sm text-slate-600">{t('options.gps.desc')}</p></div>
                            <p className="text-red-600 font-bold text-sm sm:text-base">+{formatPrice(50)}/jour</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-3 sm:p-4 bg-slate-50/50 hover:border-slate-300 transition-colors">
                      <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
                        <input type="checkbox" name="childSeat" checked={formData.childSeat} onChange={handleChange} className="mt-0.5 sm:mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="min-w-0"><p className="font-semibold text-slate-800 text-sm sm:text-base">{t('options.childSeat.title')}</p><p className="text-xs sm:text-sm text-slate-600">{t('options.childSeat.desc')}</p></div>
                            <p className="text-red-600 font-bold text-sm sm:text-base">+{formatPrice(30)}/jour</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">{t('insurance.title')}</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <label className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.insurance === 'basic' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                      <input type="radio" name="insurance" value="basic" checked={formData.insurance === 'basic'} onChange={handleChange} className="mt-0.5 sm:mt-1 border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div className="min-w-0"><p className="font-semibold text-slate-800 text-sm sm:text-base">{t('insurance.basic.title')}</p><p className="text-xs sm:text-sm text-slate-600">{t('insurance.basic.desc')}</p></div>
                          <p className="text-emerald-600 font-bold text-sm sm:text-base">{t('summary.included')}</p>
                        </div>
                      </div>
                    </label>
                    <label className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.insurance === 'premium' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                      <input type="radio" name="insurance" value="premium" checked={formData.insurance === 'premium'} onChange={handleChange} className="mt-0.5 sm:mt-1 border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div className="min-w-0"><p className="font-semibold text-slate-800 text-sm sm:text-base">{t('insurance.premium.title')}</p><p className="text-xs sm:text-sm text-slate-600">{t('insurance.premium.desc')}</p></div>
                          <p className="text-red-600 font-bold text-sm sm:text-base">+{formatPrice(100)}/jour</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">{t('steps.confirm')}</h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3">
                    <IconInfo className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700">{t('messages.confirmInfo')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">{t('summary.title')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('form.client')}</span><span className="font-semibold text-slate-800 truncate">{formData.firstName} {formData.lastName}</span></div>
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('form.email')}</span><span className="font-semibold text-slate-800 truncate">{formData.email}</span></div>
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('form.phone')}</span><span className="font-semibold text-slate-800 truncate">{formData.phone}</span></div>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('form.pickup')}</span><span className="font-semibold text-slate-800 truncate">{formData.pickupLocation}</span></div>
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('form.dropoff')}</span><span className="font-semibold text-slate-800 truncate">{formData.dropoffLocation}</span></div>
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-slate-600">{t('form.dates')}</span><span className="font-semibold text-slate-800 truncate">{formData.pickupDate ? new Date(formData.pickupDate).toLocaleDateString('fr-FR') : '—'} → {formData.dropoffDate ? new Date(formData.dropoffDate).toLocaleDateString('fr-FR') : '—'}</span></div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">{t('summary.total')}</span>
                      <span className="text-base sm:text-lg font-bold text-red-600">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 mb-4 sm:mb-6">
                    <input type="checkbox" required className="mt-0.5 sm:mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4" />
                    <span className="text-xs sm:text-sm text-slate-600">{t('messages.termsPart1')} <a href="#" className="text-red-600 hover:underline">{t('messages.termsPart2')}</a>.</span>
                  </label>
                </div>
              )}

              <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                <button type="button" onClick={() => step > 1 && setStep(step - 1)} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-colors ${step === 1 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500'}`} disabled={step === 1}>{t('actions.previous')}</button>
                <button type="submit" disabled={step === 1 && !canGoNextFromStep1()} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ${step === 1 && !canGoNextFromStep1() ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}>{step === 3 ? t('actions.confirmBooking') : t('actions.next')}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;