import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cars as allCarsData } from '../data/cars';

// Icônes SVG inline (alignées avec Home.jsx)
const IconCar = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H8.5a1 1 0 0 0-.8.4L5 11l-.16.01a1 1 0 0 0-.84.99V16h3" />
    <path d="M17 21H7a2 2 0 0 1-2-2v-3h14v3a2 2 0 0 1-2 2Z" />
  </svg>
);
const IconSliders = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
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
const IconUsers = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCog = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconFuel = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="15" y2="22" />
    <line x1="4" y1="9" x2="14" y2="9" />
    <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 6" />
  </svg>
);
const IconArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// Alias au cas où une référence à l'ancien composant Car existerait (cache / build)
const Car = IconCar;

const Cars = () => {
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: 'all',
    transmission: 'all',
    priceRange: 'all',
    seats: 'all'
  });

  // Récupérer les paramètres de recherche de l'URL
  const searchLocation = searchParams.get('location');
  const searchStartDate = searchParams.get('startDate');
  const searchEndDate = searchParams.get('endDate');

  const allCars = allCarsData;

  const filteredCars = allCars.filter(car => {
    if (filters.category !== 'all' && car.category !== filters.category) return false;
    if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
    if (filters.seats !== 'all' && car.seats.toString() !== filters.seats) return false;
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max && (car.price < min || car.price > max)) return false;
      if (!max && car.price < min) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Header — aligné avec le hero Home (slate, pas dégradé orange) */}
      <section className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800">
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-16 md:py-20 min-w-0">
          <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">
            Notre flotte
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-3 text-white break-words">
            Trouvez le véhicule parfait
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-xl">
            Pour votre voyage au Maroc — économiques, compactes, SUV ou luxe.
          </p>
        </div>
      </section>

      {/* Bandeau recherche active — palette slate comme Home */}
      {(searchLocation || searchStartDate || searchEndDate) && (
        <div className="bg-white border-b border-slate-200 shadow-sm overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3 sm:py-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-semibold text-slate-700">Recherche active :</span>
              {searchLocation && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                  <IconMapPin className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-sm text-slate-700">{searchLocation}</span>
                </div>
              )}
              {searchStartDate && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                  <IconCalendar className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-sm text-slate-700">
                    Du {new Date(searchStartDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {searchEndDate && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                  <IconCalendar className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-sm text-slate-700">
                    Au {new Date(searchEndDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-6 sm:py-8 md:py-10 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {/* Sidebar Filtres — affichage amélioré, sticky uniquement sur desktop */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:sticky lg:top-4">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
                <div className="inline-flex items-center justify-center w-9 h-9 bg-red-50 text-red-600 rounded-lg shrink-0">
                  <IconSliders className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Filtres</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Catégorie</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="Économique">Économique</option>
                    <option value="Compacte">Compacte</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxe">Luxe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">Toutes</option>
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Prix / jour (MAD)</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">Tous les prix</option>
                    <option value="0-300">0 - 300 MAD</option>
                    <option value="300-500">300 - 500 MAD</option>
                    <option value="500-700">500 - 700 MAD</option>
                    <option value="700">700+ MAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Places</label>
                  <select
                    value={filters.seats}
                    onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">Tous</option>
                    <option value="5">5 places</option>
                    <option value="7">7 places</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all' })}
                  className="w-full text-red-600 border-2 border-red-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Grille véhicules — cartes style Home */}
          <div className="lg:col-span-3 order-1 lg:order-2 min-w-0">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row flex-wrap justify-between items-stretch sm:items-center gap-3 sm:gap-4">
              <p className="text-sm sm:text-base text-slate-600 order-2 sm:order-1">
                <span className="font-semibold text-slate-800">{filteredCars.length}</span> véhicule(s) trouvé(s)
              </p>
              <select className="w-full sm:w-auto min-w-0 sm:min-w-[180px] border border-slate-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer order-1 sm:order-2">
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Popularité</option>
              </select>
            </div>

            {filteredCars.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-2xl mb-4">
                  <IconCar className="w-12 h-12" />
                </div>
                <p className="text-slate-600 text-lg mb-2">
                  Aucun véhicule ne correspond à vos critères
                </p>
                <button
                  onClick={() => setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all' })}
                  className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
                >
                  Réinitialiser les filtres
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {filteredCars.map((car) => (
                  <article key={car.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 min-w-0">
                    <div className="aspect-[4/3] max-h-32 sm:max-h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden rounded-t-xl">
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.classList.remove('hidden'); }}
                        />
                      ) : null}
                      <div className={`${car.image ? 'hidden ' : ''}absolute inset-0 bg-slate-100 flex items-center justify-center w-full h-full`}>
                        <IconCar className="w-14 h-14 text-slate-300" />
                      </div>
                      {!car.available && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Non disponible
                        </div>
                      )}
                      {car.available && (
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Disponible
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-800 truncate">{car.name}</h3>
                          <p className="text-xs text-slate-500">{car.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-red-600">{car.price} MAD</p>
                          <p className="text-[10px] text-slate-500 leading-tight">par jour</p>
                        </div>
                      </div>

                      <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-slate-600 mb-3">
                        <li className="flex items-center gap-1">
                          <IconUsers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{car.seats} pl.</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <IconCog className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{car.transmission}</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <IconFuel className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{car.fuel}</span>
                        </li>
                      </ul>

                      <div className="flex gap-2">
                        <Link
                          to={`/cars/${car.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-red-600 border border-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        >
                          Détails
                          <IconArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={car.available ? `/booking?car=${car.id}${searchLocation ? `&location=${searchLocation}` : ''}${searchStartDate ? `&startDate=${searchStartDate}` : ''}${searchEndDate ? `&endDate=${searchEndDate}` : ''}` : '#'}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            car.available
                              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          }`}
                          onClick={(e) => !car.available && e.preventDefault()}
                        >
                          Réserver
                          <IconArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;