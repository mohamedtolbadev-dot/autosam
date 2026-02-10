import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedCars } from '../data/cars';

// Icônes SVG inline
const IconShield = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconClock = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const IconMapPin = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCar = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H8.5a1 1 0 0 0-.8.4L5 11l-.16.01a1 1 0 0 0-.84.99V16h3" />
    <path d="M17 21H7a2 2 0 0 1-2-2v-3h14v3a2 2 0 0 1-2 2Z" />
  </svg>
);
const IconStar = ({ className = "w-5 h-5", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconArrowRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconUsers = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCog = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconFuel = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="15" y2="22" />
    <line x1="4" y1="9" x2="14" y2="9" />
    <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
    <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 6" />
  </svg>
);
const IconCalendar = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// Hero decorative car silhouette (SVG)
const HeroCarSilhouette = () => (
  <svg className="w-full h-full max-h-64 md:max-h-80 opacity-20" viewBox="0 0 400 160" fill="none" aria-hidden>
    <path d="M40 100h320v24a4 4 0 01-4 4H44a4 4 0 01-4-4V100z" fill="currentColor" />
    <path d="M60 84h280l-24-32H84L60 84z" fill="currentColor" />
    <circle cx="100" cy="128" r="16" fill="currentColor" />
    <circle cx="300" cy="128" r="16" fill="currentColor" />
    <path d="M120 60h160v8H120z" fill="currentColor" opacity="0.6" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: 'Casablanca',
    startDate: '',
    endDate: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.startDate) params.append('startDate', searchData.startDate);
    if (searchData.endDate) params.append('endDate', searchData.endDate);
    navigate(`/cars?${params.toString()}`);
  };

  const featuredCars = getFeaturedCars();

  const features = [
    {
      icon: <IconShield />,
      title: 'Assurance complète',
      description: 'Tous nos véhicules sont couverts par une assurance tous risques'
    },
    {
      icon: <IconClock />,
      title: 'Service 24/7',
      description: 'Assistance disponible jour et nuit partout au Maroc'
    },
    {
      icon: <IconMapPin />,
      title: 'Plusieurs agences',
      description: 'Présents dans toutes les grandes villes du royaume'
    },
    {
      icon: <IconCar />,
      title: 'Flotte récente',
      description: 'Véhicules neufs et bien entretenus'
    }
  ];

  const testimonials = [
    { name: 'Ahmed Benani', location: 'Casablanca', rating: 5, comment: 'Excellent service ! Voiture impeccable et équipe très professionnelle.' },
    { name: 'Sarah Alami', location: 'Marrakech', rating: 5, comment: 'Très satisfaite de ma location. Processus simple et rapide.' },
    { name: 'Mohammed Tazi', location: 'Rabat', rating: 5, comment: 'Je recommande vivement ! Prix compétitifs et service irréprochable.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Hero — image Maroc en fond, overlay pour lisibilité */}
      <section
        className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800"
        style={{
          backgroundImage: 'url(https://www.goride.ma/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoride-ma.c6b6281e.jpg&w=3840&q=75)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay sombre pour contraste du texte */}
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        {/* Légère grille optionnelle */}
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 32V0h32" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-12 md:gap-10 lg:gap-14 items-center">
            {/* Copy block */}
            <div className="md:col-span-7 min-w-0">
              <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-3 sm:mb-4">
                Location de véhicules
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5 text-white break-words">
                Louez votre voiture au Maroc
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                Des prix compétitifs, un service de qualité et une flotte moderne pour tous vos déplacements au royaume.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 bg-white text-red-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm sm:text-base"
                >
                  Voir nos véhicules
                  <IconArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center border-2 border-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm sm:text-base"
                >
                  Nous contacter
                </Link>
              </div>
              {/* Trust line */}
              <ul className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300" role="list">
                <li className="flex items-center gap-2">
                  <IconShield className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>Assurance incluse</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconClock className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>Assistance 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconMapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>Agences partout au Maroc</span>
                </li>
              </ul>
            </div>
            {/* Decorative visual */}
            <div className="hidden md:flex md:col-span-5 justify-end items-center pt-8 md:pt-0">
              <HeroCarSilhouette />
            </div>
          </div>
        </div>
      </section>

      {/* Barre de recherche — champs détaillés, placeholder date masqué */}
      <section className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
        <div className="container mx-auto max-w-5xl min-w-0">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 md:p-6">
            <form onSubmit={handleSearch} className="space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Lieu */}
                <div className="flex flex-col">
                  <label htmlFor="search-location" className="text-sm font-medium text-slate-700 mb-2">
                    Lieu de prise en charge
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden>
                      <IconMapPin className="w-5 h-5" />
                    </span>
                    <select
                      id="search-location"
                      value={searchData.location}
                      onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                      className="search-field-input w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option>Casablanca</option>
                      <option>Rabat</option>
                      <option>Marrakech</option>
                      <option>Fès</option>
                      <option>Tanger</option>
                      <option>Agadir</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    </span>
                  </div>
                </div>

                {/* Date de début — placeholder natif masqué */}
                <div className="flex flex-col">
                  <label htmlFor="search-start" className="text-sm font-medium text-slate-700 mb-2">
                    Date de début
                  </label>
                  <div className={`relative date-field-wrapper ${!searchData.startDate ? 'date-field-empty' : ''}`}>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" aria-hidden>
                      <IconCalendar className="w-5 h-5" />
                    </span>
                    <input
                      id="search-start"
                      type="date"
                      value={searchData.startDate}
                      onChange={(e) => setSearchData({ ...searchData, startDate: e.target.value })}
                      className="search-date-input w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors min-h-11"
                    />
                    {!searchData.startDate && (
                      <span className="date-custom-placeholder pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-[15px]">
                        Choisir une date
                      </span>
                    )}
                  </div>
                </div>

                {/* Date de fin — placeholder natif masqué */}
                <div className="flex flex-col">
                  <label htmlFor="search-end" className="text-sm font-medium text-slate-700 mb-2">
                    Date de fin
                  </label>
                  <div className={`relative date-field-wrapper ${!searchData.endDate ? 'date-field-empty' : ''}`}>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" aria-hidden>
                      <IconCalendar className="w-5 h-5" />
                    </span>
                    <input
                      id="search-end"
                      type="date"
                      value={searchData.endDate}
                      onChange={(e) => setSearchData({ ...searchData, endDate: e.target.value })}
                      className="search-date-input w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-800 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-colors min-h-11"
                    />
                    {!searchData.endDate && (
                      <span className="date-custom-placeholder pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-[15px]">
                        Choisir une date
                      </span>
                    )}
                  </div>
                </div>

                {/* Bouton Rechercher */}
                <div className="flex flex-col justify-end">
                  <label className="text-sm font-medium text-slate-700 mb-2 invisible">Rechercher</label>
                  <button
                    type="submit"
                    className="search-submit-btn w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors min-h-11"
                  >
                    <IconSearch className="w-5 h-5 shrink-0" />
                    Rechercher
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Véhicules en vedette — bandeau avec défilement auto vers la gauche */}
      <section className="py-10 sm:py-14 md:py-16 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl min-w-0">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                Véhicules en vedette
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Découvrez notre sélection — défilement automatique
              </p>
            </div>
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 shrink-0"
            >
              Voir tous les véhicules
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </header>
        </div>
        <div className="relative overflow-hidden">
          {/* Masque en dégradé à gauche (optionnel) */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-slate-50 z-10 pointer-events-none [mask-image:linear-gradient(to_right,black,transparent)]" aria-hidden />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-slate-50 z-10 pointer-events-none [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
          <div className="flex w-max cars-scroll-track" style={{ width: 'max-content' }}>
            {[...featuredCars, ...featuredCars].map((car, index) => (
              <article
                key={`${car.id}-${index}`}
                className="w-[260px] sm:w-[300px] md:w-[340px] shrink-0 mx-2 md:mx-3 first:ml-4 last:mr-4 sm:first:ml-4 md:first:ml-6 md:last:mr-6"
              >
                <Link to={`/cars/${car.id}`} className="block group">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden rounded-t-2xl">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-red-600 transition-colors">{car.name}</h3>
                          <p className="text-sm text-slate-500">{car.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-red-600">{car.price} MAD</p>
                          <p className="text-xs text-slate-500">par jour</p>
                        </div>
                      </div>
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600 mb-3">
                        <li className="flex items-center gap-1">
                          <IconUsers className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{car.seats} pl.</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <IconCog className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{car.transmission}</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <IconFuel className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{car.fuel}</span>
                        </li>
                      </ul>
                      <span className="inline-flex items-center gap-1.5 text-red-600 font-medium text-sm group-hover:gap-2 transition-all">
                        Réserver
                        <IconArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

       
        <div className="relative overflow-hidden mt-6">
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-slate-50 z-10 pointer-events-none [mask-image:linear-gradient(to_right,black,transparent)]" aria-hidden />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-slate-50 z-10 pointer-events-none [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
          <div className="flex w-max cars-scroll-track-right" style={{ width: 'max-content' }}>
            {[...featuredCars, ...featuredCars].map((car, index) => (
              <article
                key={`right-2-${car.id}-${index}`}
                className="w-[240px] sm:w-[280px] md:w-[320px] shrink-0 mx-2 md:mx-3 first:ml-4 last:mr-4 md:first:ml-6 md:last:mr-6"
              >
                <Link to={`/cars/${car.id}`} className="block group">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden rounded-t-2xl">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-red-600 transition-colors">{car.name}</h3>
                          <p className="text-sm text-slate-500">{car.category}</p>
                        </div>
                        <p className="text-lg font-bold text-red-600 shrink-0">{car.price} MAD</p>
                      </div>
                      <ul className="flex flex-wrap gap-x-3 text-sm text-slate-600 mb-3">
                        <li className="flex items-center gap-1"><IconUsers className="w-4 h-4 text-slate-500 shrink-0" /><span>{car.seats} pl.</span></li>
                        <li className="flex items-center gap-1"><IconCog className="w-4 h-4 text-slate-500 shrink-0" /><span>{car.transmission}</span></li>
                        <li className="flex items-center gap-1"><IconFuel className="w-4 h-4 text-slate-500 shrink-0" /><span>{car.fuel}</span></li>
                      </ul>
                      <span className="inline-flex items-center gap-1.5 text-red-600 font-medium text-sm group-hover:gap-2 transition-all">Réserver <IconArrowRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir — icônes SVG */}
      <section className="py-10 sm:py-14 md:py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl min-w-0">
          <header className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              Pourquoi nous choisir ?
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 text-red-600 rounded-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-10 sm:py-14 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl min-w-0">
          <header className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              Ce que disent nos clients
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <div className="flex gap-1 mb-4 text-amber-500">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <IconStar key={i} className="w-5 h-5" filled />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold text-slate-800">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — fond uni */}
      <section className="bg-red-600 text-white py-10 sm:py-14 md:py-16 rounded-t-2xl sm:rounded-t-3xl">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl text-center min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 px-1">
            Prêt à partir à l'aventure ?
          </h2>
          <p className="text-base sm:text-lg text-red-100 mb-4 sm:mb-6">
            Réservez votre véhicule en quelques clics
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-red-50 transition-colors text-sm sm:text-base"
          >
            Découvrir nos offres
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
