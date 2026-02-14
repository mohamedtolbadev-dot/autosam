import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../context/CarContext';
import { useCurrency } from '../context/CurrencyContext';

// --- NOUVELLES ICÔNES ---
const IconHeart = ({ className = 'w-5 h-5', filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconEye = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
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
  const { t } = useTranslation('cars');
  const { cars: allCarsData, loading, error } = useCars();
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  
  // États de l'interface
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [visibleCount, setVisibleCount] = useState(6); // Pagination simple
  const [favorites, setFavorites] = useState([]); // Liste des IDs favoris
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // Afficher uniquement les favoris
  
  // États de filtrage et tri
  const [filters, setFilters] = useState({
    category: 'all',
    transmission: 'all',
    priceRange: 'all',
    seats: 'all',
    fuel: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // 'priceAsc', 'priceDesc', 'recommended'

  // Persistance des favoris (localStorage)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('favorites');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setFavorites(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

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
      if (filters.fuel !== 'all' && car.fuel !== filters.fuel) return false;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max && (car.price < min || car.price > max)) return false;
        if (!max && car.price < min) return false;
      }
      
      // Filtre "favoris uniquement"
      if (showOnlyFavorites && !favorites.includes(car.id)) return false;

      // Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const haystacks = [
          car.name,
          car.category,
          car.transmission,
          car.fuel,
          String(car.price),
          String(car.seats),
          String(car.year)
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        const features = Array.isArray(car.features)
          ? car.features.map((f) => String(f).toLowerCase())
          : [];
        return haystacks.some((h) => h.includes(query)) || features.some((f) => f.includes(query));
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
  }, [filters, searchQuery, sortBy, favorites, showOnlyFavorites]);

  const displayedCars = processedCars.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      
      {/* Header — Design "Flat" Solide */}
      <section className="bg-slate-900 text-white pt-12 pb-24 sm:pt-16 sm:pb-32 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
            <div className="max-w-2xl">
                <p className="text-red-400 font-bold tracking-widest uppercase text-xs mb-3">
                    {t('header.subtitle')}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
                    {t('header.title')}
                </h1>
                <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                    {t('header.description')}
                </p>
            </div>
        </div>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-red-500/10 blur-2xl" />
        </div>
      </section>

      {/* Barre de recherche active & Contrôles principaux - Chevauchement Header */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-16 relative z-20 mb-8">
        {/* Résumé Recherche Contextuelle */}
        {(searchLocation || searchStartDate || searchEndDate) && (
            <div className="bg-slate-800 text-slate-200 p-4 rounded-t-xl flex flex-wrap items-center gap-4 text-sm border-b border-slate-700">
                <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">{t('search.yourSearch')}</span>
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
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Input Recherche */}
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder={t('search.placeholder')}
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
                    <option value="recommended">{t('sort.recommended')}</option>
                    <option value="priceAsc">{t('sort.priceAscShort')}</option>
                    <option value="priceDesc">{t('sort.priceDescShort')}</option>
                </select>

                {/* Bouton "Favoris" */}
                <button
                    type="button"
                    onClick={() => setShowOnlyFavorites(prev => !prev)}
                    className={`hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      showOnlyFavorites
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <IconHeart className="w-4 h-4" filled={showOnlyFavorites} />
                    {showOnlyFavorites ? t('favorites.badge') : t('favorites.all')}
                </button>

                {/* Toggle Vue */}
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        aria-label={t('view.gridLabel')}
                    >
                        <IconLayoutGrid className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        aria-label={t('view.listLabel')}
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
                    {t('filters.title')}
                </h2>
                {(filters.category !== 'all' || filters.transmission !== 'all' || filters.priceRange !== 'all' || filters.seats !== 'all' || filters.fuel !== 'all') && (
                    <button 
                        onClick={() => setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all', fuel: 'all' })}
                        className="text-xs text-red-600 font-semibold hover:underline"
                    >
                        {t('filters.reset')}
                    </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Groupe Filtre */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('filters.category')}</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="all">{t('filters.categoryAll')}</option>
                    <option value="Économique">{t('filters.economic')}</option>
                    <option value="Compacte">{t('filters.compact') || 'Compacte'}</option>
                    <option value="SUV">{t('filters.suv')}</option>
                    <option value="Luxe">{t('filters.premium')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('filters.transmission')}</label>
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
                            {type === 'all' ? t('filters.transmissionAll') : type}
                        </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('filters.budget')}</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="all">{t('filters.priceAll')}</option>
                    <option value="0-300">{t('filters.priceUnder300')}</option>
                    <option value="300-500">{t('filters.price300to500')}</option>
                    <option value="500-700">{t('filters.price500to700')}</option>
                    <option value="700">{t('filters.priceOver700')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('filters.seats')}</label>
                  <select
                    value={filters.seats}
                    onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="all">{t('filters.seatsAll')}</option>
                    <option value="4">{t('filters.seats4')}</option>
                    <option value="5">{t('filters.seats5')}</option>
                    <option value="7">{t('filters.seats7')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('filters.fuel')}</label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="all">{t('filters.fuelAll')}</option>
                    <option value="Essence">{t('filters.gasoline')}</option>
                    <option value="Diesel">{t('filters.diesel')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des Résultats */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm text-slate-500">
                    <span className="font-bold text-slate-900">{processedCars.length}</span> {t('results.found')}
                    {showOnlyFavorites && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-[11px] font-semibold border border-red-100">
                        <IconHeart className="w-3 h-3" filled />
                        {t('favorites.badge')}
                      </span>
                    )}
                </p>

                {/* Résumé des filtres actifs */}
                {(filters.category !== 'all' ||
                  filters.transmission !== 'all' ||
                  filters.priceRange !== 'all' ||
                  filters.seats !== 'all' ||
                  filters.fuel !== 'all') && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {filters.category !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {t('results.category')}: {filters.category}
                      </span>
                    )}
                    {filters.transmission !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {t('results.transmission')}: {filters.transmission}
                      </span>
                    )}
                    {filters.priceRange !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {t('results.budget')}: {filters.priceRange === '700' ? '700+ MAD' : filters.priceRange + ' MAD'}
                      </span>
                    )}
                    {filters.seats !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {t('results.seats')}: {filters.seats}
                      </span>
                    )}
                    {filters.fuel !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {t('results.fuel')}: {filters.fuel}
                      </span>
                    )}
                  </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-red-500 rounded-full mb-4 animate-pulse">
                  <IconCar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('loading.title')}</h3>
                <p className="text-slate-500">{t('loading.subtitle')}</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white rounded-xl border border-red-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('error.connection')}</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('error.retry')}
                </button>
              </div>
            )}

            {!loading && !error && displayedCars.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 rounded-full mb-4">
                  <IconCar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('empty.title')}</h3>
                <p className="text-slate-500 mb-6">{t('empty.subtitle')}</p>
                <button
                  onClick={() => {
                      setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all', fuel: 'all' });
                      setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {t('empty.clearAll')}
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {displayedCars.map((car) => (
                  <article 
                    key={car.id} 
                    className={`group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-red-100 transition-all duration-300 ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
                  >
                    {/* Image Section */}
                    <div className={`relative bg-slate-100 flex items-center justify-center overflow-hidden ${viewMode === 'list' ? 'sm:w-64 shrink-0 aspect-[4/3] sm:aspect-auto' : 'aspect-[4/3] h-48'}`}>
                        {car.image ? (
                            <img src={car.image.startsWith('http') ? car.image : `http://localhost:5000${car.image}`} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <IconCar className="w-12 h-12 text-slate-300" />
                        )}
                        
                        {/* Tags Flottants */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                             {car.price < 350 && <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-emerald-200 uppercase tracking-wide">{t('car.ecoDeal')}</span>}
                             {car.category === 'Luxe' && <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">{t('car.premium')}</span>}
                        </div>
                        
                        {/* Bouton Favoris */}
                        <button 
                            onClick={(e) => toggleFavorite(e, car.id)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors border border-transparent hover:border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={favorites.includes(car.id) ? t('car.favoriteRemove') : t('car.favoriteAdd')}
                        >
                            <IconHeart className="w-4 h-4" filled={favorites.includes(car.id)} />
                        </button>

                        {!car.available && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">{t('car.unavailable')}</span>
                            </div>
                        )}
                        {car.reserved && car.available && (
                            <div className="absolute inset-0 bg-[#F01023]/40 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="bg-[#F01023] text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">{t('car.reserved')}</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors truncate">
                              {car.name}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">{car.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-slate-400 font-medium uppercase">{t('cars.from')}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-extrabold text-[#0F172B]">{formatPrice(car.price)}</span>
                              <span className="text-xs font-bold text-slate-500">{t('common:currency.perDayShort')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 my-4">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <IconUsers className="w-4 h-4 text-slate-400" />
                                <span>{car.seats} {t('car.seats')}</span>
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
                                <span>{t('car.ac')}</span>
                            </div>
                        </div>

                        {/* Features Tags */}
                        {car.features && car.features.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {car.features.slice(0, 4).map((feature, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {feature}
                                    </span>
                                ))}
                                {car.features.length > 4 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                        +{car.features.length - 4}
                                    </span>
                                )}
                            </div>
                        )}
                      </div>

                      {/* Footer: Actions */}
                      <div
                        className={`mt-2 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-end gap-3 ${
                          viewMode === 'list' ? 'sm:gap-6' : ''
                        }`}
                      >
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Link
                            to={`/cars/${car.id}`}
                            aria-label={t('car.details') || 'Voir les détails'}
                            className="inline-flex items-center justify-center px-1 py-2.5 rounded-lg border border-transparent text-[#101424] bg-transparent underline underline-offset-4 hover:opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium"
                          >
                            {t('car.detail') || 'Détail'}
                          </Link>
                          <Link
                            to={
                              car.available && !car.reserved
                                ? `/booking?car=${car.id}` +
                                  (searchLocation ? `&location=${searchLocation}` : '') +
                                  (searchStartDate ? `&startDate=${searchStartDate}` : '') +
                                  (searchEndDate ? `&endDate=${searchEndDate}` : '')
                                : '#'
                            }
                            className={`inline-flex items-center justify-center gap-2 px-1 py-2.5 rounded-lg text-sm font-bold transition-all shadow-none flex-1 sm:flex-none focus:outline-none focus:ring-2 focus:ring-red-500 underline underline-offset-4 ${
                              car.available && !car.reserved
                                ? 'bg-transparent text-red-600 hover:opacity-80'
                                : 'bg-transparent text-slate-400 cursor-not-allowed no-underline'
                            }`}
                            onClick={(e) => !(car.available && !car.reserved) && e.preventDefault()}
                          >
                            {car.available && !car.reserved ? t('common:actions.book') : t('cars:car.reserved')}
                            <IconArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
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
                        {t('loadMore') || 'Afficher plus de véhicules'}
                    </button>
                    <p className="text-xs text-slate-400 mt-3">
                        {t('showingResults', { displayed: displayedCars.length, total: processedCars.length }) || `Affichage de ${displayedCars.length} sur ${processedCars.length} véhicules`}
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