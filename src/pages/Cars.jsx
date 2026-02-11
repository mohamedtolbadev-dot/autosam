import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cars as allCarsData } from '../data/cars';

// --- NOUVELLES ICÔNES ---
const IconHeart = ({ className = 'w-5 h-5', filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconSearch = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconLayoutGrid = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconList = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

// --- ICÔNES EXISTANTES ---
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
const IconCheck = ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

const Cars = () => {
  const [searchParams] = useSearchParams();
  
  // États de l'interface
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [visibleCount, setVisibleCount] = useState(6); // Pagination simple
  const [favorites, setFavorites] = useState([]); // Liste des IDs favoris
  
  // États de filtrage et tri
  const [filters, setFilters] = useState({
    category: 'all',
    transmission: 'all',
    priceRange: 'all',
    seats: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // 'priceAsc', 'priceDesc', 'recommended'

  const searchLocation = searchParams.get('location');
  const searchStartDate = searchParams.get('startDate');
  const searchEndDate = searchParams.get('endDate');

  // Gestion des favoris
  const toggleFavorite = (e, id) => {
    e.preventDefault();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Logique principale de filtrage et tri (optimisée avec useMemo)
  const processedCars = useMemo(() => {
    let result = allCarsData.filter(car => {
      // Filtres existants
      if (filters.category !== 'all' && car.category !== filters.category) return false;
      if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
      if (filters.seats !== 'all' && car.seats.toString() !== filters.seats) return false;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max && (car.price < min || car.price > max)) return false;
        if (!max && car.price < min) return false;
      }
      
      // Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return car.name.toLowerCase().includes(query) || 
               car.category.toLowerCase().includes(query);
      }
      return true;
    });

    // Logique de tri
    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // 'recommended' - on pourrait trier par disponibilité ou popularité simulée
        result.sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1));
    }

    return result;
  }, [allCarsData, filters, searchQuery, sortBy]);

  const displayedCars = processedCars.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      
      {/* Header — Design "Flat" Solide */}
      <section className="bg-slate-900 text-white pt-12 pb-24 sm:pt-16 sm:pb-32 px-4 relative">
        <div className="container mx-auto max-w-6xl relative z-10">
            <div className="max-w-2xl">
                <p className="text-red-400 font-bold tracking-widest uppercase text-xs mb-3">
                    Notre Flotte Premium
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
                    Choisissez votre <br />compagnon de route
                </h1>
                <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                    De la citadine agile au SUV robuste, découvrez une sélection de véhicules entretenus avec soin pour une expérience de conduite sans compromis au Maroc.
                </p>
            </div>
        </div>
      </section>

      {/* Barre de recherche active & Contrôles principaux - Chevauchement Header */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-16 relative z-20 mb-8">
        {/* Résumé Recherche Contextuelle */}
        {(searchLocation || searchStartDate || searchEndDate) && (
            <div className="bg-slate-800 text-slate-200 p-4 rounded-t-xl flex flex-wrap items-center gap-4 text-sm border-b border-slate-700">
                <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Votre recherche :</span>
                {searchLocation && (
                    <div className="flex items-center gap-2">
                        <IconMapPin className="w-4 h-4 text-red-400" />
                        <span>{searchLocation}</span>
                    </div>
                )}
                {(searchStartDate || searchEndDate) && (
                    <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4 text-red-400" />
                        <span>
                            {searchStartDate ? new Date(searchStartDate).toLocaleDateString('fr-FR') : '...'} 
                            {' → '} 
                            {searchEndDate ? new Date(searchEndDate).toLocaleDateString('fr-FR') : '...'}
                        </span>
                    </div>
                )}
            </div>
        )}

        {/* Barre d'outils (Recherche + Tri + Vue) */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Input Recherche */}
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher (ex: Clio, Dacia...)"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500 transition-colors sm:text-sm text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Tri */}
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 md:flex-none border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
                >
                    <option value="recommended">Recommandés</option>
                    <option value="priceAsc">Prix: Croissant</option>
                    <option value="priceDesc">Prix: Décroissant</option>
                </select>

                {/* Toggle Vue */}
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        aria-label="Vue Grille"
                    >
                        <IconLayoutGrid className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        aria-label="Vue Liste"
                    >
                        <IconList className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filtres */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <IconSliders className="w-5 h-5 text-red-600" />
                    Filtres
                </h2>
                {(filters.category !== 'all' || filters.transmission !== 'all' || filters.priceRange !== 'all' || filters.seats !== 'all') && (
                    <button 
                        onClick={() => setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all' })}
                        className="text-xs text-red-600 font-semibold hover:underline"
                    >
                        Reset
                    </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Groupe Filtre */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catégorie</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="all">Toutes</option>
                    <option value="Économique">Économique</option>
                    <option value="Compacte">Compacte</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxe">Luxe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transmission</label>
                  <div className="flex gap-2">
                    {['all', 'Manuelle', 'Automatique'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilters({ ...filters, transmission: type })}
                            className={`flex-1 py-2 px-1 text-xs font-medium rounded-lg border transition-colors ${
                                filters.transmission === type 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {type === 'all' ? 'Toutes' : type}
                        </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Budget (MAD/jour)</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="all">Tous les prix</option>
                    <option value="0-300">Moins de 300</option>
                    <option value="300-500">300 - 500</option>
                    <option value="500-700">500 - 700</option>
                    <option value="700">Plus de 700</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des Résultats */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-end">
                <p className="text-sm text-slate-500">
                    <span className="font-bold text-slate-900">{processedCars.length}</span> résultats trouvés
                </p>
            </div>

            {displayedCars.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 rounded-full mb-4">
                  <IconCar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Aucun résultat</h3>
                <p className="text-slate-500 mb-6">Essayez d'ajuster vos filtres ou votre recherche.</p>
                <button
                  onClick={() => {
                      setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all' });
                      setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Tout effacer
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {displayedCars.map((car) => (
                  <article 
                    key={car.id} 
                    className={`group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-300 ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
                  >
                    {/* Image Section */}
                    <div className={`relative bg-slate-100 flex items-center justify-center overflow-hidden ${viewMode === 'list' ? 'sm:w-64 shrink-0 aspect-[4/3] sm:aspect-auto' : 'aspect-[4/3] h-48'}`}>
                        {car.image ? (
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <IconCar className="w-12 h-12 text-slate-300" />
                        )}
                        
                        {/* Tags Flottants */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                             {car.price < 350 && <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-green-200 uppercase tracking-wide">Éco Deal</span>}
                             {car.category === 'Luxe' && <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">Premium</span>}
                        </div>
                        
                        {/* Bouton Favoris */}
                        <button 
                            onClick={(e) => toggleFavorite(e, car.id)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors border border-transparent hover:border-slate-100"
                        >
                            <IconHeart className="w-4 h-4" filled={favorites.includes(car.id)} />
                        </button>

                        {!car.available && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">Indisponible</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">{car.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{car.category}</p>
                           </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 my-4">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <IconUsers className="w-4 h-4 text-slate-400" />
                                <span>{car.seats} Sièges</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <IconCog className="w-4 h-4 text-slate-400" />
                                <span>{car.transmission}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <IconFuel className="w-4 h-4 text-slate-400" />
                                <span>{car.fuel}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                <span>Climatisée</span>
                            </div>
                        </div>
                      </div>

                      {/* Footer: Prix + Action */}
                      <div className={`mt-2 pt-4 border-t border-slate-100 flex items-center justify-between ${viewMode === 'list' ? 'sm:justify-end sm:gap-6' : ''}`}>
                         <div className="text-right sm:text-left">
                             <p className="text-xs text-slate-400 font-medium uppercase">À partir de</p>
                             <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold text-slate-900">{car.price}</span>
                                <span className="text-xs font-bold text-slate-500">MAD/j</span>
                             </div>
                         </div>
                         
                         <Link
                            to={car.available ? `/booking?car=${car.id}${searchLocation ? `&location=${searchLocation}` : ''}` : '#'}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                                car.available
                                ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200 hover:shadow-md'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            onClick={(e) => !car.available && e.preventDefault()}
                        >
                            Réserver
                            <IconArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            {displayedCars.length < processedCars.length && (
                <div className="mt-10 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 6)}
                        className="bg-white border border-slate-300 text-slate-700 font-semibold py-3 px-8 rounded-full hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
                    >
                        Afficher plus de véhicules
                    </button>
                    <p className="text-xs text-slate-400 mt-3">
                        Affichage de {displayedCars.length} sur {processedCars.length} véhicules
                    </p>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;