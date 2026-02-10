import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCarById, getRentalOptions } from '../data/cars';

// Icônes SVG inline (alignées avec Home.jsx / Cars.jsx)
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
  const car = getCarById(id);
  const rentalOptions = car ? getRentalOptions(car.price) : [];

  if (!car) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Véhicule introuvable</h1>
          <p className="text-slate-600 mb-4">Ce véhicule n'existe pas ou a été retiré.</p>
          <Link to="/cars" className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700">
            <IconArrowLeft className="w-5 h-5" />
            Retour à la flotte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
          >
            <IconArrowLeft className="w-5 h-5 shrink-0" />
            Retour aux véhicules
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-6 sm:py-8 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image principale + miniatures */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="aspect-[4/3] max-h-[380px] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconCar className="w-24 h-24 text-slate-300" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 p-3 border-t border-slate-100">
                {[1, 2, 3].map((img) => (
                  <div key={img} className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {car.image ? (
                      <img src={car.image} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" />
                    ) : (
                      <IconCar className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fiche véhicule */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{car.name}</h1>
                  <p className="text-slate-500">{car.category} • {car.year}</p>
                </div>
                {car.available ? (
                  <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold shrink-0">
                    Disponible
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold shrink-0">
                    Non disponible
                  </span>
                )}
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">{car.description}</p>

              {/* Specs — icônes et couleurs alignées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconUsers className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Places</p>
                    <p className="font-semibold text-slate-800">{car.seats}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconCog className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Transmission</p>
                    <p className="font-semibold text-slate-800">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconFuel className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Carburant</p>
                    <p className="font-semibold text-slate-800">{car.fuel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl shrink-0">
                    <IconDoor className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Portes</p>
                    <p className="font-semibold text-slate-800">{car.doors}</p>
                  </div>
                </div>
              </div>

              {/* Équipements */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Équipements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <IconCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inclus */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Inclus dans le prix</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.included.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <IconShield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 lg:sticky lg:top-4">
              <div className="text-center mb-6 pb-6 border-b border-slate-100">
                <p className="text-slate-500 text-sm mb-1">À partir de</p>
                <p className="text-3xl sm:text-4xl font-bold text-red-600">{car.price} MAD</p>
                <p className="text-slate-500 text-sm">par jour</p>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-800 mb-3">Tarifs dégressifs</h4>
                <div className="space-y-2">
                  {rentalOptions.map((option) => (
                    <div key={option.days} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-800">{option.days} jour{option.days > 1 ? 's' : ''}</p>
                        <p className="text-xs text-slate-500">{option.pricePerDay} MAD/jour</p>
                      </div>
                      <p className="font-bold text-red-600">{option.total} MAD</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <IconMapPin className="w-4 h-4 text-slate-500" />
                    Lieu de prise en charge
                  </label>
                  <select className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer">
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
                    <IconCalendar className="w-4 h-4 text-slate-500" />
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <IconCalendar className="w-4 h-4 text-slate-500" />
                    Date de fin
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Link
                to={`/booking?car=${car.id}`}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  car.available
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
                onClick={(e) => !car.available && e.preventDefault()}
              >
                {car.available ? 'Réserver maintenant' : 'Non disponible'}
              </Link>

              <p className="text-xs text-slate-500 text-center mt-4">
                Annulation gratuite jusqu'à 24h avant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;