import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../context/CarContext';
import { useCurrency } from '../context/CurrencyContext';
import { isValidCarId } from '../utils/security';

// Helper function to format location keys to human-readable names
const formatLocation = (locationKey, t) => {
  if (!locationKey) return '';
  
  // If no underscore, add default airport location
  if (!locationKey.includes('_')) {
    const cityNames = {
      casablanca: t('common:cities.casablanca'),
      marrakech: t('common:cities.marrakech'),
      rabat: t('common:cities.rabat'),
      tangier: t('common:cities.tangier'),
      agadir: t('common:cities.agadir'),
      fes: t('common:cities.fes')
    };
    const cityName = cityNames[locationKey.toLowerCase()] || locationKey;
    const defaultLocation = t('common:locations.airport');
    return `${cityName} - ${defaultLocation}`;
  }
  
  const [city, location] = locationKey.split('_');
  const cityNames = {
    casablanca: t('common:cities.casablanca'),
    marrakech: t('common:cities.marrakech'),
    rabat: t('common:cities.rabat'),
    tangier: t('common:cities.tangier'),
    agadir: t('common:cities.agadir'),
    fes: t('common:cities.fes')
  };
  const locationTypes = {
    airport: t('common:locations.airport'),
    cityCenter: t('common:locations.cityCenter'),
    city: t('common:locations.cityCenter'),
    trainStation: t('common:locations.trainStation'),
    train: t('common:locations.trainStation')
  };
  const cityName = cityNames[city] || city;
  const locationType = locationTypes[location] || (location ? location : t('common:locations.airport'));
  return `${cityName} - ${locationType}`;
};

// --- ICONS ---
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
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconList = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconCar = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H8.5a1 1 0 0 0-.8.4L5 11l-.16.01a1 1 0 0 0-.84.99V16h3" />
    <path d="M17 21H7a2 2 0 0 1-2-2v-3h14v3a2 2 0 0 1-2 2Z" />
  </svg>
);
const IconSliders = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
const IconMapPin = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCalendar = ({ className = 'w-4 h-4' }) => (
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
    <line x1="3" y1="22" x2="15" y2="22" /><line x1="4" y1="9" x2="14" y2="9" />
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
const IconX = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <article className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
    <div className="h-48 bg-slate-100 animate-pulse" />
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="pt-3 border-t border-slate-100 flex gap-2">
        <div className="h-10 flex-1 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-10 flex-1 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </article>
);

// ─── Filter Section Label ─────────────────────────────────────────────────────
const FilterSection = ({ label, children }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    {children}
  </div>
);

// ─── Active Filter Tag ────────────────────────────────────────────────────────
const FilterTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
    {label}
    <button
      onClick={onRemove}
      className="w-4 h-4 rounded-full bg-slate-300 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
    >
      <IconX className="w-2.5 h-2.5" />
    </button>
  </span>
);

// ─── Spec Item ────────────────────────────────────────────────────────────────
const SpecItem = ({ icon, label, highlight }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500">
    <span className={highlight ? 'text-emerald-500' : 'text-slate-400'}>{icon}</span>
    <span className="font-medium text-slate-700">{label}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Cars = () => {
  const { t } = useTranslation(['cars', 'common']);
  const { cars: allCarsData, loading, error } = useCars();
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(9);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all', transmission: 'all', priceRange: 'all', seats: 'all', fuel: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const searchLocation       = searchParams.get('location');
  const searchDropoffLocation= searchParams.get('dropoffLocation');
  const searchStartDate      = searchParams.get('startDate');
  const searchEndDate        = searchParams.get('endDate');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('favorites');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setFavorites(parsed.filter(id => isValidCarId(id)));
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem('favorites', JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const resetFilter = (key) => setFilters(prev => ({ ...prev, [key]: 'all' }));

  const processedCars = useMemo(() => {
    let result = allCarsData.filter(car => {
      const carStatus = car.status?.toLowerCase?.() || '';
      if (carStatus === 'booked' || carStatus === 'reserved' || car.reserved === true) return false;
      if (filters.category !== 'all' && car.category !== filters.category) return false;
      if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
      if (filters.seats !== 'all' && car.seats.toString() !== filters.seats) return false;
      if (filters.fuel !== 'all' && car.fuel !== filters.fuel) return false;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max && (car.price < min || car.price > max)) return false;
        if (!max && car.price < min) return false;
      }
      if (showOnlyFavorites && !favorites.includes(car.id)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const haystacks = [car.name, car.category, car.transmission, car.fuel, String(car.price), String(car.seats), String(car.year)]
          .filter(Boolean).map(v => String(v).toLowerCase());
        const features = Array.isArray(car.features) ? car.features.map(f => String(f).toLowerCase()) : [];
        return haystacks.some(h => h.includes(query)) || features.some(f => f.includes(query));
      }
      return true;
    });

    switch (sortBy) {
      case 'priceAsc':  result.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': result.sort((a, b) => b.price - a.price); break;
      default:          result.sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1));
    }
    return result;
  }, [allCarsData, filters, searchQuery, sortBy, favorites, showOnlyFavorites]);

  const displayedCars    = processedCars.slice(0, visibleCount);
  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  const buildCarUrl = (base, carId) => {
    if (base === 'detail') {
      let url = `/cars/${carId}`;
      const qs = [];
      if (searchLocation)       qs.push(`location=${searchLocation}`);
      if (searchDropoffLocation) qs.push(`dropoffLocation=${searchDropoffLocation}`);
      if (searchStartDate)      qs.push(`startDate=${searchStartDate}`);
      if (searchEndDate)        qs.push(`endDate=${searchEndDate}`);
      return qs.length ? `${url}?${qs.join('&')}` : url;
    }
    const params = new URLSearchParams();
    params.set('car', carId);
    if (searchLocation)        params.set('location', searchLocation);
    if (searchDropoffLocation) params.set('dropoffLocation', searchDropoffLocation);
    if (searchStartDate)       params.set('startDate', searchStartDate);
    if (searchEndDate)         params.set('endDate', searchEndDate);
    return `/booking?${params.toString()}`;
  };

  const hasSearchContext = searchLocation || searchDropoffLocation || searchStartDate || searchEndDate;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0F172B] text-white pt-16 pb-32 px-4 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
          aria-hidden="true"
        />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-xl pl-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-red-600" />
              <p className="text-red-500 font-bold tracking-[0.25em] uppercase text-[10px]">
                {t('header.subtitle')}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-[1.08]">
              {t('header.title')}
            </h1>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('header.description')}
            </p>
          </div>
        </div>
      </section>

      {/* ── TOOLBAR (overlaps header) ───────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-14 relative z-20 mb-10">

        {/* Search context banner */}
        {hasSearchContext && (
          <div className="bg-[#0F172B] border border-slate-700 border-b-0 px-5 py-3 rounded-t-2xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              <span className="text-slate-500 uppercase font-bold tracking-[0.15em] text-[10px] shrink-0">
                {t('search.yourSearch')}
              </span>
              {searchLocation && (
                <span className="flex items-center gap-1.5 text-slate-300">
                  <IconMapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="text-slate-500">{t('search.pickup')}:</span>
                  <strong className="text-white font-semibold">{formatLocation(searchLocation, t)}</strong>
                </span>
              )}
              {searchDropoffLocation && (
                <span className="flex items-center gap-1.5 text-slate-300">
                  <IconMapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="text-slate-500">{t('search.dropoff')}:</span>
                  <strong className="text-white font-semibold">{formatLocation(searchDropoffLocation, t)}</strong>
                </span>
              )}
              {(searchStartDate || searchEndDate) && (
                <span className="flex items-center gap-1.5 text-slate-300">
                  <IconCalendar className="w-3 h-3 text-red-500 shrink-0" />
                  <strong className="text-white font-semibold">
                    {searchStartDate ? new Date(searchStartDate).toLocaleDateString('fr-FR') : '…'}
                  </strong>
                  <span className="text-slate-600 mx-0.5">→</span>
                  <strong className="text-white font-semibold">
                    {searchEndDate ? new Date(searchEndDate).toLocaleDateString('fr-FR') : '…'}
                  </strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className={`bg-white shadow-lg border border-slate-200 px-5 py-4 flex flex-col md:flex-row gap-4 items-center justify-between ${hasSearchContext ? 'rounded-b-2xl' : 'rounded-2xl'}`}>
          {/* Search */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <IconSearch className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="flex-1 md:flex-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none cursor-pointer transition-all hover:border-slate-300"
            >
              <option value="recommended">{t('sort.recommended')}</option>
              <option value="priceAsc">{t('sort.priceAscShort')}</option>
              <option value="priceDesc">{t('sort.priceDescShort')}</option>
            </select>

            {/* Favorites toggle */}
            <button
              type="button"
              onClick={() => setShowOnlyFavorites(p => !p)}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl border transition-all ${
                showOnlyFavorites
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <IconHeart className="w-4 h-4" filled={showOnlyFavorites} />
              {showOnlyFavorites ? t('favorites.badge') : t('favorites.all')}
            </button>

            {/* View toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#0F172B] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <IconLayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#0F172B] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <IconList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            {/* Mobile toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <IconSliders className="w-4 h-4 text-red-600" />
                  {t('filters.title')}
                  {hasActiveFilters && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {Object.values(filters).filter(v => v !== 'all').length}
                    </span>
                  )}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>

            {/* Filters Panel */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-4">

                {/* Panel header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#0F172B] flex items-center gap-2">
                    <IconSliders className="w-4 h-4 text-red-600" />
                    {t('filters.title')}
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={() => setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all', fuel: 'all' })}
                      className="text-[11px] text-red-600 font-bold hover:text-red-700 transition-colors"
                    >
                      {t('filters.reset')}
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-6">

                  {/* Category */}
                  <FilterSection label={t('filters.category')}>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', 'Économique', 'Compacte', 'SUV', 'Luxe'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilters(p => ({ ...p, category: cat }))}
                          className={`py-2.5 px-2 text-[11px] font-semibold rounded-xl border transition-all text-center ${
                            filters.category === cat
                              ? 'bg-[#0F172B] text-white border-[#0F172B]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800'
                          }`}
                        >
                          {cat === 'all' ? t('filters.categoryAll') : cat}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Transmission */}
                  <FilterSection label={t('filters.transmission')}>
                    <div className="flex gap-2">
                      {['all', 'Manuelle', 'Automatique'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFilters(p => ({ ...p, transmission: type }))}
                          className={`flex-1 py-2.5 px-1 text-[11px] font-semibold rounded-xl border transition-all ${
                            filters.transmission === type
                              ? 'bg-[#0F172B] text-white border-[#0F172B]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {type === 'all' ? t('filters.transmissionAll') : type === 'Manuelle' ? 'Man.' : 'Auto.'}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Budget */}
                  <FilterSection label={t('filters.budget')}>
                    <div className="space-y-1">
                      {[
                        { value: 'all',     label: t('filters.priceAll') },
                        { value: '0-300',   label: t('filters.priceUnder300') },
                        { value: '300-500', label: t('filters.price300to500') },
                        { value: '500-700', label: t('filters.price500to700') },
                        { value: '700',     label: t('filters.priceOver700') },
                      ].map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            filters.priceRange === opt.value
                              ? 'border-red-600 bg-red-600'
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}>
                            {filters.priceRange === opt.value && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                            )}
                          </span>
                          <input
                            type="radio"
                            className="sr-only"
                            checked={filters.priceRange === opt.value}
                            onChange={() => setFilters(p => ({ ...p, priceRange: opt.value }))}
                          />
                          <span className={`text-xs transition-colors ${
                            filters.priceRange === opt.value
                              ? 'text-[#0F172B] font-bold'
                              : 'text-slate-500 group-hover:text-slate-700'
                          }`}>
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Seats */}
                  <FilterSection label={t('filters.seats')}>
                    <div className="flex gap-2">
                      {['all', '4', '5', '7'].map(s => (
                        <button
                          key={s}
                          onClick={() => setFilters(p => ({ ...p, seats: s }))}
                          className={`flex-1 py-2.5 text-[11px] font-semibold rounded-xl border transition-all ${
                            filters.seats === s
                              ? 'bg-[#0F172B] text-white border-[#0F172B]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {s === 'all' ? t('filters.seatsAll') : s}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Fuel */}
                  <FilterSection label={t('filters.fuel')}>
                    <div className="flex gap-2">
                      {['all', 'Essence', 'Diesel'].map(f => (
                        <button
                          key={f}
                          onClick={() => setFilters(p => ({ ...p, fuel: f }))}
                          className={`flex-1 py-2.5 px-1 text-[11px] font-semibold rounded-xl border transition-all ${
                            filters.fuel === f
                              ? 'bg-[#0F172B] text-white border-[#0F172B]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {f === 'all' ? t('filters.fuelAll') : f}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                </div>
              </div>
            </div>
          </aside>

          {/* ── RESULTS ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">

            {/* Meta row */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-[#0F172B] text-base">{processedCars.length}</span>
                {' '}{t('results.found')}
                {showOnlyFavorites && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 px-2.5 py-0.5 text-[10px] font-bold border border-red-100">
                    <IconHeart className="w-3 h-3" filled /> {t('favorites.badge')}
                  </span>
                )}
              </p>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {filters.category !== 'all' && (
                    <FilterTag label={`${t('results.category')}: ${filters.category}`} onRemove={() => resetFilter('category')} />
                  )}
                  {filters.transmission !== 'all' && (
                    <FilterTag label={filters.transmission} onRemove={() => resetFilter('transmission')} />
                  )}
                  {filters.priceRange !== 'all' && (
                    <FilterTag
                      label={filters.priceRange === '700' ? '700+ MAD' : `${filters.priceRange} MAD`}
                      onRemove={() => resetFilter('priceRange')}
                    />
                  )}
                  {filters.seats !== 'all' && (
                    <FilterTag label={`${filters.seats} ${t('car.seats')}`} onRemove={() => resetFilter('seats')} />
                  )}
                  {filters.fuel !== 'all' && (
                    <FilterTag label={filters.fuel} onRemove={() => resetFilter('fuel')} />
                  )}
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-white rounded-2xl border border-red-100 p-14 text-center shadow-sm">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#0F172B] mb-2">{t('error.connection')}</h3>
                <p className="text-sm text-slate-500 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all"
                >
                  {t('error.retry')}
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && displayedCars.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
                <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-200">
                  <IconCar className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#0F172B] mb-2">{t('empty.title')}</h3>
                <p className="text-sm text-slate-500 mb-6">{t('empty.subtitle')}</p>
                <button
                  onClick={() => {
                    setFilters({ category: 'all', transmission: 'all', priceRange: 'all', seats: 'all', fuel: 'all' });
                    setSearchQuery('');
                  }}
                  className="px-6 py-2.5 bg-[#0F172B] text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  {t('empty.clearAll')}
                </button>
              </div>
            )}

            {/* ── CAR CARDS ─────────────────────────────────────────────── */}
            {!loading && !error && displayedCars.length > 0 && (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                : 'space-y-4'
              }>
                {displayedCars.map(car => (
                  <article
                    key={car.id}
                    className={`group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'
                    }`}
                  >
                    {/* ── IMAGE ── */}
                    <div className={`relative bg-slate-50 flex items-center justify-center overflow-hidden ${
                      viewMode === 'list'
                        ? 'sm:w-56 shrink-0 sm:h-auto aspect-[4/3] sm:aspect-auto'
                        : 'h-48'
                    }`}>
                      {car.image ? (
                        <img
                          src={car.image.startsWith('http') ? car.image : `https://server-chi-two-10.vercel.app${car.image}`}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <IconCar className="w-14 h-14 text-slate-200" />
                      )}

                      {/* Category badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white text-[#0F172B] border border-slate-200 shadow-sm">
                        {car.category}
                      </span>

                      {/* Favorite */}
                      <button
                        onClick={e => toggleFavorite(e, car.id)}
                        aria-label={favorites.includes(car.id) ? t('car.favoriteRemove') : t('car.favoriteAdd')}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm ${
                          favorites.includes(car.id)
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-300'
                        }`}
                      >
                        <IconHeart className="w-3.5 h-3.5" filled={favorites.includes(car.id)} />
                      </button>

                      {/* Unavailable overlay */}
                      {!car.available && (
                        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-[#0F172B] text-white px-4 py-1.5 rounded-lg font-bold text-xs border border-white/10 shadow-xl">
                            {t('car.unavailable')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── CONTENT ── */}
                    <div className="p-5 flex flex-col flex-1">

                      {/* Name + Price */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[#0F172B] text-[15px] leading-snug truncate group-hover:text-red-600 transition-colors duration-200">
                            {car.name}
                          </h3>
                          {car.year && (
                            <span className="text-xs text-slate-400 font-medium mt-0.5 block">{car.year}</span>
                          )}
                        </div>
                        {/* Price block — flat, no gradient */}
                        <div className="shrink-0 text-right">
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest mb-1">{t('cars.from')}</p>
                          <div className="bg-red-600 px-3 py-1.5 rounded-lg inline-flex items-baseline gap-1">
                            <span className="text-base font-black text-white leading-none">{formatPrice(car.price)}</span>
                            <span className="text-[9px] font-bold text-white/75 leading-none">{t('common:currency.perDayShort')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-100 mb-4" />

                      {/* Specs grid */}
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-4">
                        <SpecItem icon={<IconUsers className="w-3.5 h-3.5" />} label={`${car.seats} ${t('car.seats')}`} />
                        <SpecItem icon={<IconCog className="w-3.5 h-3.5" />} label={car.transmission} />
                        <SpecItem icon={<IconFuel className="w-3.5 h-3.5" />} label={car.fuel} />
                        <SpecItem icon={<IconCheck className="w-3.5 h-3.5" />} label={t('car.ac')} highlight />
                      </div>

                      {/* Feature tags */}
                      {car.features?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {car.features.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 rounded-full"
                            >
                              {f}
                            </span>
                          ))}
                          {car.features.length > 3 && (
                            <span className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
                              +{car.features.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2">
                        <Link
                          to={buildCarUrl('detail', car.id)}
                          className="flex-1 py-2.5 text-center text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                          {t('car.detail') || 'Détail'}
                        </Link>
                        <Link
                          to={car.available && !car.reserved ? buildCarUrl('booking', car.id) : '#'}
                          onClick={e => !(car.available && !car.reserved) && e.preventDefault()}
                          className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 ${
                            car.available && !car.reserved
                              ? 'bg-[#0F172B] text-white hover:bg-slate-800'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {car.available && !car.reserved ? t('common:actions.book') : t('cars:car.reserved')}
                          {car.available && !car.reserved && <IconArrowRight className="w-3.5 h-3.5" />}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load more */}
            {displayedCars.length < processedCars.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount(p => p + 9)}
                  className="bg-white border border-slate-200 text-[#0F172B] font-bold py-3.5 px-12 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm text-sm"
                >
                  {t('loadMore') || 'Afficher plus'}
                </button>
                <p className="text-xs text-slate-400 mt-3 font-medium">
                  {t('showingResults', { displayed: displayedCars.length, total: processedCars.length })
                    || `${displayedCars.length} / ${processedCars.length}`}
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