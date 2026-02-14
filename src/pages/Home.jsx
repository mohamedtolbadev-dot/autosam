import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../context/CarContext';
import { useCurrency } from '../context/CurrencyContext';

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
  const { t, i18n, ready } = useTranslation('home');
  const { formatPrice } = useCurrency();
  const inputBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition min-h-11';
  const inputWithIconClassName =
    'w-full rounded-xl pl-10 pr-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition min-h-11';
  const selectWithIconClassName =
    'w-full rounded-xl pl-10 pr-10 py-3 text-slate-800 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition cursor-pointer appearance-none min-h-11';

  const [searchData, setSearchData] = useState({
    location: 'Casablanca',
    startDate: '',
    endDate: ''
  });

  const clientCount = '10K+';

  const testimonials = [
    {
      name: 'Sara A.',
      city: 'Casablanca',
      rating: 5,
      text: t('testimonials.reviews.sara')
    },
    {
      name: 'Youssef B.',
      city: 'Rabat',
      rating: 5,
      text: t('testimonials.reviews.youssef')
    },
    {
      name: 'Khadija M.',
      city: 'Marrakech',
      rating: 5,
      text: t('testimonials.reviews.khadija')
    },
    {
      name: 'Omar H.',
      city: 'Tanger',
      rating: 4,
      text: t('testimonials.reviews.omar')
    },
    {
      name: 'Nadia E.',
      city: 'Agadir',
      rating: 5,
      text: t('testimonials.reviews.nadia')
    }
  ];

  const faqs = [
    {
      q: t('faq.items.documents.q'),
      a: t('faq.items.documents.a')
    },
    {
      q: t('faq.items.cancellation.q'),
      a: t('faq.items.cancellation.a')
    },
    {
      q: t('faq.items.insurance.q'),
      a: t('faq.items.insurance.a')
    },
    {
      q: t('faq.items.childSeat.q'),
      a: t('faq.items.childSeat.a')
    }
  ];

const steps = [
    {
      step: '01',
      title: t('steps.step1.title'),
      desc: t('steps.step1.desc'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21 21-4.34-4.34"/><circle cx="10" cy="10" r="7"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="13 2 13 9 20 9"/>
        </svg>
      )
    },
    {
      step: '02',
      title: t('steps.step2.title'),
      desc: t('steps.step2.desc'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/>
        </svg>
      )
    },
    {
      step: '03',
      title: t('steps.step3.title'),
      desc: t('steps.step3.desc'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/><circle cx="18" cy="17" r="3"/><path d="m20.5 18.5 1 1"/>
        </svg>
      )
    },
    {
      step: '04',
      title: t('steps.step4.title'),
      desc: t('steps.step4.desc'),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M2 12h6"/><path d="M12 2v6"/><path d="m15 5 3-3 3 3"/>
        </svg>
      )
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const isSearchFormValid =
    Boolean(searchData.location) && Boolean(searchData.startDate) && Boolean(searchData.endDate);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isSearchFormValid) return;
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.startDate) params.append('startDate', searchData.startDate);
    if (searchData.endDate) params.append('endDate', searchData.endDate);
    navigate(`/cars?${params.toString()}`);
  };

  const { cars: allCars, loading, error } = useCars();
  
const brands = [
  { name: 'Dacia', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr17LnhouFzB2601fjq-N7IWthf_kw5S5NZQ&s' },
  { name: 'Renault', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1MHMl0NQdkgxIm6cxxNaqKaA0RffSx36EGg&s' },
  { name: 'Hyundai', logo: 'https://dealerimages.dealereprocess.com/image/upload/2026576.jpg' },
  { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/500px-Volkswagen_logo_2019.svg.png' },
  { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Toyota_logo_%28Red%29.svg/1280px-Toyota_logo_%28Red%29.svg.png' },
  { name: 'Fiat', logo: 'https://cdn.worldvectorlogo.com/logos/fiat-3.svg' },
  { name: 'Peugeot', logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/9/9d/Peugeot_2021_Logo.svg/langfr-250px-Peugeot_2021_Logo.svg.png' },
  { name: 'Citroen', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl1KwpQIq-e4v9lUNmpBFHAzmzi8-7Zi3YJg&s' }
];



  // Get the first 6 unreserved cars as "featured" from the server
  const featuredCars = allCars.filter(car => !car.reserved).slice(0, 6);

 
  

  return (
    <div key={i18n.language} className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Hero — Morocco background image, overlay for readability */}
      <section
        className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800"
        style={{
          backgroundImage: 'url(https://www.goride.ma/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoride-ma.c6b6281e.jpg&w=3840&q=75)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        {/* Optional light grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-10 lg:gap-14 items-center">
            {/* Copy block */}
            <div className="md:col-span-7 min-w-0 text-center md:text-left order-1">
              <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-3 sm:mb-4">
                {t('hero.subtitle')}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5 text-white break-words leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-2 bg-white text-red-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm sm:text-base"
                >
                  {t('hero.search')}
                  <IconArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center border-2 border-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors text-sm sm:text-base"
                >
                  {t('nav.contact')}
                </Link>
              </div>
              {/* Trust line */}
              <ul className="mt-8 sm:mt-10 flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300" role="list">
                <li className="flex items-center gap-2">
                  <IconShield className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{t('hero.trust.insurance')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconClock className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{t('hero.trust.assistance')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconMapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{t('hero.trust.agencies')}</span>
                </li>
              </ul>
            </div>
            {/* Decorative visual */}
            <div className="md:col-span-5 flex justify-center md:justify-end items-center pt-8 md:pt-0 order-2">
              <div className="w-full max-w-[280px] sm:max-w-md md:max-w-full">
                <HeroCarSilhouette />
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Search bar — detailed fields, date placeholder hidden */}
      <section className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
        <div className="container mx-auto max-w-5xl min-w-0">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 md:p-6">
            <form onSubmit={handleSearch} className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Location */}
                <div className="flex flex-col">
                  <label htmlFor="search-location" className="text-sm font-medium text-slate-700 mb-2">
                    {t('form.pickupLocation')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden>
                      <IconMapPin className="w-5 h-5" />
                    </span>
                    <select
                      id="search-location"
                      value={searchData.location}
                      onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                      className={`search-field-input ${selectWithIconClassName}`}
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

                {/* Start date — native placeholder hidden */}
                <div className="flex flex-col">
                  <label htmlFor="search-start" className="text-sm font-medium text-slate-700 mb-2">
                    {t('form.startDate')}
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
                      className={`search-date-input ${inputWithIconClassName}`}
                    />
                    {!searchData.startDate && (
                      <span className="date-custom-placeholder pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-[15px]">
                        {t('actions.chooseDate')}
                      </span>
                    )}
                  </div>
                </div>

                {/* End date — native placeholder hidden */}
                <div className="flex flex-col">
                  <label htmlFor="search-end" className="text-sm font-medium text-slate-700 mb-2">
                    {t('form.endDate')}
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
                      className={`search-date-input ${inputWithIconClassName}`}
                    />
                    {!searchData.endDate && (
                      <span className="date-custom-placeholder pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-[15px]">
                        {t('actions.chooseDate')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Search button */}
                <div className="flex flex-col justify-end mt-2 md:mt-0">
                  <label className="text-sm font-medium text-slate-700 mb-2 hidden md:block md:invisible">{t('actions.search')}</label>
                  <button
                    type="submit"
                    disabled={!isSearchFormValid}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all h-11 ${!isSearchFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <IconSearch className="w-5 h-5 shrink-0" />
                    {t('actions.search')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Brand Logos Marquee */}
      <div className="bg-white py-12 sm:py-16 border-b border-slate-100 overflow-hidden">
        <div className="brands-marquee-track">
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <div key={`${brand.name}-${idx}`} className="flex items-center justify-center mx-8 sm:mx-12 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-12 sm:h-14 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Featured vehicles — banner with auto-scroll to the left */}
      <section className="py-10 sm:py-14 md:py-16 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl min-w-0">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {t('vehicles.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                {t('vehicles.description')}
              </p>
            </div>
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 shrink-0"
            >
              {t('vehicles.viewAll')}
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </header>
        </div>
        <div className="relative overflow-hidden">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-4 animate-pulse">
                  <IconCar className="w-8 h-8" />
                </div>
                <p className="text-slate-600 font-medium">{t('loading.title')}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex justify-center py-12">
              <div className="text-center bg-white rounded-2xl border border-red-200 p-8 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-4">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('loading.error')}</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('actions.retry')}
                </button>
              </div>
            </div>
          )}

          {/* Cars Display */}
          {!loading && !error && featuredCars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCars.map((car, index) => (
              <article
                key={`${car.id}-${index}`}
                className="w-full"
              >
                <div 
                  onClick={() => navigate(`/cars/${car.id}`)} 
                  className="block group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden rounded-t-2xl relative">
                      <img
                        src={car.image.startsWith('http') ? car.image : `http://localhost:5000${car.image}`}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!car.available && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">{t('vehicles.unavailable')}</span>
                        </div>
                      )}
                      {car.reserved && car.available && (
                        <div className="absolute inset-0 bg-[#F01023]/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-[#F01023] text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">{t('vehicles.reserved')}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-red-600 transition-colors">{car.name}</h3>
                          <p className="text-sm text-slate-500">{car.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-red-600">{formatPrice(car.price)}</p>
                          <p className="text-xs text-slate-500">{t('currency.perDay')}</p>
                        </div>
                      </div>
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600 mb-3">
                        <li className="flex items-center gap-1">
                          <IconUsers className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{car.seats} {t('vehicles.specs.seatsShort')}</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <IconCog className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{t(`vehicles.specs.${car.transmission.toLowerCase()}`)}</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <IconFuel className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{t(`vehicles.specs.${car.fuel.toLowerCase()}`)}</span>
                        </li>
                      </ul>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[#101424] font-semibold text-sm underline underline-offset-4 hover:opacity-80 transition-opacity">
                          {t('actions.details')}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (car.available && !car.reserved) {
                              navigate(`/booking?car=${car.id}`);
                            }
                          }}
                          className={`inline-flex items-center gap-1 font-bold text-sm underline underline-offset-4 transition-opacity ${
                            car.available && !car.reserved
                              ? 'text-red-600 hover:opacity-80'
                              : 'text-slate-400 cursor-not-allowed no-underline'
                          }`}
                        >
                          {car.available && !car.reserved ? t('common:actions.book') : t('cars:car.reserved')}
                          <IconArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>

       
        <div className="mt-6">
          {!loading && !error && featuredCars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCars.map((car, index) => (
              <article
                key={`right-2-${car.id}-${index}`}
                className="w-full"              >
                <div 
                  onClick={() => navigate(`/cars/${car.id}`)} 
                  className="block group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden rounded-t-2xl relative">
                      <img src={car.image.startsWith('http') ? car.image : `http://localhost:5000${car.image}`} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {!car.available && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">{t('vehicles.unavailable')}</span>
                        </div>
                      )}
                      {car.reserved && car.available && (
                        <div className="absolute inset-0 bg-[#F01023]/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-[#F01023] text-white px-3 py-1 rounded font-bold text-sm shadow-lg rotate-[-5deg]">{t('vehicles.reserved')}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-red-600 transition-colors">{car.name}</h3>
                          <p className="text-sm text-slate-500">{car.category}</p>
                        </div>
                        <p className="text-lg font-bold text-red-600 shrink-0">{formatPrice(car.price)}</p>
                      </div>
                      <ul className="flex flex-wrap gap-x-3 text-sm text-slate-600 mb-3">
                        <li className="flex items-center gap-1"><IconUsers className="w-4 h-4 text-slate-500 shrink-0" /><span>{car.seats} {t('vehicles.specs.seatsShort')}</span></li>
                        <li className="flex items-center gap-1"><IconCog className="w-4 h-4 text-slate-500 shrink-0" /><span>{t(`vehicles.specs.${car.transmission.toLowerCase()}`)}</span></li>
                        <li className="flex items-center gap-1"><IconFuel className="w-4 h-4 text-slate-500 shrink-0" /><span>{t(`vehicles.specs.${car.fuel.toLowerCase()}`)}</span></li>
                      </ul>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[#101424] font-semibold text-sm underline underline-offset-4 hover:opacity-80 transition-opacity">
                          {t('actions.details')}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (car.available && !car.reserved) {
                              navigate(`/booking?car=${car.id}`);
                            }
                          }}
                          className={`inline-flex items-center gap-1 font-bold text-sm underline underline-offset-4 transition-opacity ${
                            car.available && !car.reserved
                              ? 'text-red-600 hover:opacity-80'
                              : 'text-slate-400 cursor-not-allowed no-underline'
                          }`}
                        >
                          {car.available && !car.reserved ? t('common:actions.book') : t('cars:car.reserved')}
                          <IconArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Family Comfort Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative order-2 md:order-1 mt-8 md:mt-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/30 via-transparent to-transparent" />
                <img
                  src="../public/imgs/famly.jpg"
                  alt={t('family.imageAlt')}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/45 to-transparent" />

                <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-900 border border-white/60">
                    <IconShield className="w-4 h-4 text-red-600" />
                    {t('family.security')}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-900 border border-white/60">
                    <IconCar className="w-4 h-4 text-red-600" />
                    {t('family.largeTrunk')}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                    <IconUsers className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 leading-none">7</p>
                    <p className="text-xs text-slate-500 font-semibold">{t('family.seatsMax')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold uppercase tracking-wider mb-3">
                {t('family.badge')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {t('family.title')}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                {t('family.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <IconShield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{t('family.security')}</p>
                      <p className="text-[10px] sm:text-xs text-slate-600">{t('family.securityDesc')}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <IconClock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{t('family.assistance')}</p>
                      <p className="text-[10px] sm:text-xs text-slate-600">{t('family.assistanceDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center gap-2 sm:gap-3 text-slate-700">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                    <IconUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                  <span className="text-xs sm:text-sm">{t('features.childSeat')}</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-slate-700">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                    <IconCar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                  <span className="text-xs sm:text-sm">{t('features.suvDesc')}</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  to="/cars"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  {t('actions.seeFamilyVehicles')}
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  {t('actions.needAdvice')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-red-600 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              {t('faq.title')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {t('faq.subtitle')}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
              {t('faq.description')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-white border-red-200 shadow-lg shadow-red-100/50' 
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className="text-sm font-bold">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <span className={`text-sm sm:text-base font-semibold transition-colors ${
                        isOpen ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {item.q}
                      </span>
                    </div>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen 
                        ? 'bg-red-600 text-white rotate-180' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-16 sm:pl-18">
                      <div className="flex gap-3">
                        <div className="w-px bg-red-200 shrink-0 mt-1" />
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{t('faq.moreQuestions')}</p>
                  <p className="text-xs text-slate-500">{t('faq.helpText')}</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm whitespace-nowrap"
              >
                {t('faq.contactUs')}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client Count + Testimonials Marquee */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('testimonials.trustTitle')}</p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="text-4xl font-black text-slate-900 leading-none">{clientCount}</p>
                  <p className="text-sm font-semibold text-slate-600 pb-1">{t('testimonials.satisfied')}</p>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t('testimonials.description')}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IconStar key={n} className="w-4 h-4" filled />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{t('testimonials.rating')}</span>
                </div>

                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  {t('testimonials.openMaps')}
                </a>
              </div>
            </div>

            <div className="lg:col-span-8 min-w-0">
              <div className="relative overflow-hidden">
                <div className="flex w-max cars-scroll-track" style={{ width: 'max-content' }}>
                  {[...testimonials, ...testimonials].map((t, idx) => (
                    <article
                      key={`${t.name}-${idx}`}
                      className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 mx-2 sm:mx-3"
                    >
                      <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg hover:border-slate-300 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{t.name}</p>
                            <p className="text-xs text-slate-500">{t.city}</p>
                          </div>
                          <div className="flex items-center text-amber-500 shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IconStar
                                key={i}
                                className="w-4 h-4"
                                filled={i < t.rating}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          “{t.text}”
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — solid background */}
      <section className="bg-red-600 text-white py-10 sm:py-14 md:py-16 rounded-t-2xl sm:rounded-t-3xl">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl text-center min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 px-1">
            {t('cta.title')}
          </h2>
          <p className="text-base sm:text-lg text-red-100 mb-4 sm:mb-6">
            {t('cta.subtitle')}
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-red-50 transition-colors text-sm sm:text-base"
          >
            {t('cta.button')}
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
