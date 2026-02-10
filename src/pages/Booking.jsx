import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCarById, cars } from '../data/cars';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const carId = searchParams.get('car');
  const searchLocation = searchParams.get('location');
  const searchStartDate = searchParams.get('startDate');
  const searchEndDate = searchParams.get('endDate');

  const car = getCarById(carId) || cars[0];

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
    insurance: 'basic'
  });

  const [step, setStep] = useState(1);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process booking
      alert('Réservation confirmée !');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Header — aligné avec Home/Cars (slate) */}
      <section className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800">
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-14 min-w-0">
          <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Réservation</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">Complétez votre réservation</h1>
          <p className="text-slate-200 text-base sm:text-lg">En quelques étapes — informations, options, paiement.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-6 sm:py-8 min-w-0">
        {/* Étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  s <= step ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 sm:w-24 h-1 transition-colors ${s < step ? 'bg-red-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 gap-8 sm:gap-20">
            <span className={`text-xs sm:text-sm ${step >= 1 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              Informations
            </span>
            <span className={`text-xs sm:text-sm ${step >= 2 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              Options
            </span>
            <span className={`text-xs sm:text-sm ${step >= 3 ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
              Paiement
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 min-w-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Vos informations</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconUser className="w-4 h-4 text-slate-500" />
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconUser className="w-4 h-4 text-slate-500" />
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconMail className="w-4 h-4 text-slate-500" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconPhone className="w-4 h-4 text-slate-500" />
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+212 6XX XXX XXX"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <IconCreditCard className="w-4 h-4 text-slate-500" />
                      Numéro de permis de conduire *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <hr className="my-6 border-slate-200" />

                  <h3 className="text-lg font-bold text-slate-800 mb-4">Détails de location</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconMapPin className="w-4 h-4 text-slate-500" />
                        Lieu de prise en charge *
                      </label>
                      <select
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option>Casablanca</option>
                        <option>Rabat</option>
                        <option>Marrakech</option>
                        <option>Fès</option>
                        <option>Tanger</option>
                        <option>Agadir</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconMapPin className="w-4 h-4 text-slate-500" />
                        Lieu de restitution *
                      </label>
                      <select
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option>Casablanca</option>
                        <option>Rabat</option>
                        <option>Marrakech</option>
                        <option>Fès</option>
                        <option>Tanger</option>
                        <option>Agadir</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconCalendar className="w-4 h-4 text-slate-500" />
                        Date de début *
                      </label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <IconCalendar className="w-4 h-4 text-slate-500" />
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        name="dropoffDate"
                        value={formData.dropoffDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Options supplémentaires</h2>

                  <div className="space-y-4 mb-6">
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition-colors">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="gps"
                          checked={formData.gps}
                          onChange={handleChange}
                          className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <p className="font-semibold text-slate-800">GPS</p>
                              <p className="text-sm text-slate-600">Système de navigation</p>
                            </div>
                            <p className="text-red-600 font-bold">+50 MAD/jour</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition-colors">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="childSeat"
                          checked={formData.childSeat}
                          onChange={handleChange}
                          className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <p className="font-semibold text-slate-800">Siège bébé</p>
                              <p className="text-sm text-slate-600">Siège pour enfant (0-4 ans)</p>
                            </div>
                            <p className="text-red-600 font-bold">+30 MAD/jour</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-4">Assurance</h3>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.insurance === 'basic' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                      <input
                        type="radio"
                        name="insurance"
                        value="basic"
                        checked={formData.insurance === 'basic'}
                        onChange={handleChange}
                        className="mt-1 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold text-slate-800">Assurance de base</p>
                            <p className="text-sm text-slate-600">Inclus dans le prix</p>
                          </div>
                          <p className="text-emerald-600 font-bold">Inclus</p>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.insurance === 'premium' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}>
                      <input
                        type="radio"
                        name="insurance"
                        value="premium"
                        checked={formData.insurance === 'premium'}
                        onChange={handleChange}
                        className="mt-1 border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold text-slate-800">Assurance premium</p>
                            <p className="text-sm text-slate-600">Zéro franchise, couverture maximale</p>
                          </div>
                          <p className="text-red-600 font-bold">+100 MAD/jour</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Paiement</h2>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex gap-3">
                    <IconInfo className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">
                      Paiement sécurisé. Annulation gratuite jusqu'à 24h avant la prise en charge.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <IconCreditCard className="w-4 h-4 text-slate-500" />
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date d'expiration</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 mb-6">
                    <input type="checkbox" required className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                    <span className="text-sm text-slate-600">
                      J'accepte les <a href="#" className="text-red-600 hover:underline">conditions générales</a> et
                      la <a href="#" className="text-red-600 hover:underline">politique de confidentialité</a>
                    </span>
                  </label>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-colors ${
                    step === 1
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500'
                  }`}
                  disabled={step === 1}
                >
                  Précédent
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  {step === 3 ? 'Confirmer la réservation' : 'Suivant'}
                </button>
              </div>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:sticky lg:top-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Récapitulatif</h3>

              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800 mb-1">{car.name}</p>
                <p className="text-sm text-slate-500">{car.category}</p>
              </div>

              {calculateDays() > 0 && (
                <>
                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Location ({calculateDays()} jour{calculateDays() > 1 ? 's' : ''})</span>
                      <span className="font-semibold text-slate-800">{car.price * calculateDays()} MAD</span>
                    </div>
                    {formData.gps && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">GPS</span>
                        <span className="font-semibold text-slate-800">{50 * calculateDays()} MAD</span>
                      </div>
                    )}
                    {formData.childSeat && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Siège bébé</span>
                        <span className="font-semibold text-slate-800">{30 * calculateDays()} MAD</span>
                      </div>
                    )}
                    {formData.insurance === 'premium' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Assurance premium</span>
                        <span className="font-semibold text-slate-800">{100 * calculateDays()} MAD</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-red-600">{calculateTotal()} MAD</span>
                  </div>
                </>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconShield className="w-5 h-5" />
                  </div>
                  <div className="text-sm text-slate-700 min-w-0">
                    <p className="font-semibold text-slate-800 mb-1">Inclus :</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Assurance tous risques</li>
                      <li>• Kilométrage illimité</li>
                      <li>• Assistance 24/7</li>
                      <li>• Annulation gratuite</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;