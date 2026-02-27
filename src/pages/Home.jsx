import { useState, useEffect } from 'react';
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
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
    <path d="M199.2 181.4L173.1 256L466.9 256L440.8 181.4C436.3 168.6 424.2 160 410.6 160L229.4 160C215.8 160 203.7 168.6 199.2 181.4zM103.6 260.8L138.8 160.3C152.3 121.8 188.6 96 229.4 96L410.6 96C451.4 96 487.7 121.8 501.2 160.3L536.4 260.8C559.6 270.4 576 293.3 576 320L576 512C576 529.7 561.7 544 544 544L512 544C494.3 544 480 529.7 480 512L480 480L160 480L160 512C160 529.7 145.7 544 128 544L96 544C78.3 544 64 529.7 64 512L64 320C64 293.3 80.4 270.4 103.6 260.8zM192 368C192 350.3 177.7 336 160 336C142.3 336 128 350.3 128 368C128 385.7 142.3 400 160 400C177.7 400 192 385.7 192 368zM480 400C497.7 400 512 385.7 512 368C512 350.3 497.7 336 480 336C462.3 336 448 350.3 448 368C448 385.7 462.3 400 480 400z" />
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


const Home = () => {
  const navigate = useNavigate();
  const { t, i18n, ready } = useTranslation(['home', 'common']);
  const { formatPrice } = useCurrency();

  // API URL
  const API_URL = 'https://server-chi-two-10.vercel.app/api';

  // Add shimmer & pulse animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.9; }
      }
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        25% { transform: scale(1.01); opacity: 0.6; }
        50% { transform: scale(1.02); opacity: 0.8; }
        75% { transform: scale(1.01); opacity: 0.6; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }
      .animate-shimmer {
        animation: shimmer 1.2s ease-in-out infinite;
      }
      .animate-pulse-glow {
        animation: pulse-glow 1.8s ease-in-out infinite;
      }
      .animate-heartbeat {
        animation: heartbeat 2s ease-in-out infinite;
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const inputBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition min-h-11';
  const inputWithIconClassName =
    'w-full rounded-xl pl-10 pr-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition min-h-11';
  const selectWithIconClassName =
    'w-full rounded-xl pl-10 pr-10 py-3 text-slate-800 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition cursor-pointer appearance-none min-h-11';

  const [searchData, setSearchData] = useState({
    location: 'Casablanca',
    dropoffLocation: 'Casablanca',
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

  // Promotions state with carousel
  const [promotions, setPromotions] = useState([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [promotionsError, setPromotionsError] = useState(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      setPromotionsLoading(true);
      try {
        const response = await fetch(`${API_URL}/promotions`);
        const data = await response.json();
        if (data.success) {
          setPromotions(data.data);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromotionsError(error);
      } finally {
        setPromotionsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Auto-scroll promotions
  useEffect(() => {
    if (promotions.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) =>
        prev === promotions.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [promotions.length]);

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
    const current = field === 'start' ? searchData.startDate : searchData.endDate;
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
    activeDateField === 'end' ? (searchData.startDate || todayInputValue) : todayInputValue;
  const minSelectableDate = parseInputDate(minSelectableInputValue);

  const selectDate = (date) => {
    const value = toInputDate(date);
    if (activeDateField === 'start') {
      setSearchData((prev) => {
        const next = { ...prev, startDate: value };
        if (next.endDate && value && next.endDate < value) {
          next.endDate = '';
        }
        return next;
      });
    }
    if (activeDateField === 'end') {
      setSearchData((prev) => ({ ...prev, endDate: value }));
    }
    closeDateModal();
  };

  const clearActiveDate = () => {
    if (activeDateField === 'start') {
      setSearchData((prev) => ({ ...prev, startDate: '', endDate: '' }));
    }
    if (activeDateField === 'end') {
      setSearchData((prev) => ({ ...prev, endDate: '' }));
    }
    closeDateModal();
  };

  const monthLabel = (date) =>
    date.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });

  const isSearchFormValid =
    Boolean(searchData.location) && Boolean(searchData.startDate) && Boolean(searchData.endDate) &&
    searchData.startDate !== searchData.endDate;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isSearchFormValid) return;

    if (searchData.startDate < todayInputValue) return;
    if (searchData.endDate < (searchData.startDate || todayInputValue)) return;

    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.dropoffLocation) params.append('dropoffLocation', searchData.dropoffLocation);
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
  const getCarKey = (car) => car?.id ?? car?._id;
  const featuredCars = allCars
    .filter((car) => !car.reserved)
    .reduce((acc, car) => {
      const key = getCarKey(car);
      if (!key || acc.seen.has(key)) return acc;
      acc.seen.add(key);
      acc.items.push(car);
      return acc;
    }, { items: [], seen: new Set() }).items
    .slice(0, 8);

 
  

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
          </div>
        </div>
      </section>

     

      {/* Search bar — detailed fields, date placeholder hidden */}
      <section className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
        <div className="container mx-auto max-w-5xl min-w-0">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-5 md:p-6">
            <form onSubmit={handleSearch} className="space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {/* Pickup Location */}
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    </span>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="flex flex-col">
                  <label htmlFor="search-dropoff" className="text-sm font-medium text-slate-700 mb-2">
                    {t('form.dropoffLocation')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden>
                      <IconMapPin className="w-5 h-5" />
                    </span>
                    <select
                      id="search-dropoff"
                      value={searchData.dropoffLocation}
                      onChange={(e) => setSearchData({ ...searchData, dropoffLocation: e.target.value })}
                      className={`search-field-input ${selectWithIconClassName}`}
                    >
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
                      type="text"
                      readOnly
                      value={searchData.startDate}
                      onClick={() => openDateModal('start')}
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
                      type="text"
                      readOnly
                      value={searchData.endDate}
                      onClick={() => openDateModal('end')}
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
                    {activeDateField === 'start' ? t('form.startDate') : t('form.endDate')}
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
                  {t('common:calendar.shortDays', { returnObjects: true }).map((d) => (
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
                      activeDateField === 'start' ? searchData.startDate : searchData.endDate;
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

      {/* ============================================================
    PROMOTIONS SECTION — Clean Design, Image fills space, Red & #1B2638
    ============================================================ */}

<section className="py-12 sm:py-16 bg-gray-50">
  <div className="max-w-5xl mx-auto px-4 sm:px-6">

    {/* ── Section Header ── */}
    <div className="text-center mb-8 sm:mb-10">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-3">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        {t('promotions.badge', 'Offres Spéciales')}
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2638] mb-2 tracking-tight">
        {t('promotions.title', 'Profitez de nos promotions')}
      </h2>
      <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
        {t('promotions.description', 'Des offres exclusives pour vos locations de voitures au Maroc')}
      </p>
    </div>

    {/* ── Loading State — Light Glowing Skeleton ── */}
    {promotionsLoading && (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image skeleton */}
          <div className="relative lg:w-[45%] h-52 sm:h-64 lg:h-auto lg:min-h-[320px] bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
            <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-gray-100 to-gray-50" />
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-200/30 rounded-full blur-2xl animate-pulse" />
          </div>
          
          {/* Content skeleton */}
          <div className="flex-1 p-5 sm:p-6 space-y-4">
            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-100 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
            </div>
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-50 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
              </div>
              <div className="h-4 w-2/3 bg-gray-50 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
              </div>
            </div>
            {/* Car info card skeleton */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 flex items-center gap-3">
              <div className="w-16 h-12 bg-gray-200 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
                <div className="h-3 w-24 bg-gray-100 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
            {/* Code skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-28 bg-red-50 rounded-lg border-2 border-dashed border-red-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              </div>
            </div>
            {/* Footer skeleton */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="h-4 w-40 bg-gray-100 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              </div>
              <div className="h-10 w-32 bg-linear-to-r from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ── Promotions Carousel ── */}
    {!promotionsLoading && promotions.length > 0 && (
      <div className="relative">
        {(() => {
          const promo = promotions[currentPromoIndex];
          return (
            <div className="group bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                {/* ── Left: Full Image Section (no dark background) ── */}
                <div className="relative lg:w-[45%] h-52 sm:h-64 lg:h-auto lg:min-h-[320px]">
                  {/* Full cover image */}
                  <img
                    src={promo.image_url || '/imgs/promo-default.jpg'}
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/imgs/promo-default.jpg'; }}
                  />
                  
                  {/* Discount Badge - positioned on image */}
                  {(promo.discount_percent > 0 || promo.discount_amount > 0) && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-black shadow-lg flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 8v13m0-13V6a2 2 0 012 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        {promo.discount_percent > 0 ? `-${promo.discount_percent}%` : `-${promo.discount_amount} MAD`}
                      </div>
                    </div>
                  )}

                  {/* Dark gradient overlay at bottom for better badge visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* ── Right: Content ── */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
                  
                  {/* Title + Description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1B2638] mb-2 leading-tight">
                      {i18n.language === 'en'
                        ? promo.title_en || promo.title
                        : promo.title_fr || promo.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {i18n.language === 'en'
                        ? promo.description_en || promo.description
                        : promo.description_fr || promo.description}
                    </p>
                  </div>

                  {/* ── Car Info Card ── */}
                  {promo.car_name && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={promo.car_image || '/imgs/promo-default.jpg'}
                          alt={promo.car_name}
                          className="w-16 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          onError={(e) => { e.target.src = '/imgs/promo-default.jpg'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#1B2638] text-sm mb-1">{promo.car_name}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            {promo.car_price && (
                              <span className="text-red-600 font-semibold">
                                {formatPrice(promo.car_price)}/{t('common:currency.perDayShort') || 'j'}
                              </span>
                            )}
                            {promo.car_category && (
                              <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                {promo.car_category}
                              </span>
                            )}
                            {promo.car_seats && (
                              <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                {promo.car_seats} places
                              </span>
                            )}
                            {promo.car_transmission && (
                              <span>{promo.car_transmission}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Promo Code ── */}
                  {promo.code && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        {t('promotions.code', 'Code')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold tracking-wider border-2 border-dashed border-red-400 bg-red-50 text-red-600">
                          {promo.code}
                        </span>
                        <button 
                          onClick={() => navigator.clipboard?.writeText(promo.code)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                          title="Copier"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15V4a2 2 0 012-2h10"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Footer: Validity + CTA ── */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>
                        {t('promotions.validUntil', "Jusqu'au")}{' '}
                        <strong className="text-[#1B2638]">
                          {new Date(promo.end_date).toLocaleDateString(
                            i18n.language === 'en' ? 'en-US' : 'fr-FR'
                          )}
                        </strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/cars/${promo.car_id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        {t('actions.details', 'Détails')}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </Link>
                      <Link
                        to={`/booking?promo=${promo.code || ''}&car=${promo.car_id || ''}`}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#0F172B] to-[#1B2638] hover:from-[#1B2638] hover:to-[#2d3748] transition-all shadow-md hover:shadow-lg"
                      >
                        {t('promotions.bookNow', 'Réserver')}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Navigation Arrows ── */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentPromoIndex((prev) =>
                  prev === 0 ? promotions.length - 1 : prev - 1
                )
              }
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 transition-all z-10"
              aria-label="Previous promotion"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentPromoIndex((prev) =>
                  prev === promotions.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 transition-all z-10"
              aria-label="Next promotion"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </>
        )}

        {/* ── Dots Navigation ── */}
        {promotions.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-5">
            <span className="text-xs text-gray-400 font-medium">
              {currentPromoIndex + 1} / {promotions.length}
            </span>
            <div className="flex gap-1.5">
              {promotions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPromoIndex(idx)}
                  className="rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    width: idx === currentPromoIndex ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: idx === currentPromoIndex ? '#DC2626' : '#D1D5DB',
                  }}
                  aria-label={`Go to promotion ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {/* ── Empty State ── */}
    {!promotionsLoading && promotions.length === 0 && !promotionsError && (
      <div className="text-center py-14">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </div>
        <p className="text-gray-500 font-medium">
          {t('promotions.noOffers', 'Aucune promotion en cours')}
        </p>
      </div>
    )}

  </div>
</section>
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
          {/* Skeleton Loading - Advanced Pulsing Design */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-float"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Image skeleton - heartbeat glow effect */}
                  <div className="aspect-4/3 bg-slate-100 relative overflow-hidden rounded-t-2xl animate-heartbeat">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                    {/* Pulse rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 animate-ping" />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {/* Title & Price row */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-32 bg-slate-200 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                        </div>
                        <div className="h-3 w-20 bg-slate-100 rounded-md" />
                      </div>
                      <div className="h-6 w-20 bg-linear-to-r from-red-100 to-red-200 rounded-lg animate-pulse-glow" />
                    </div>
                    {/* Specs row - 3 items */}
                    <div className="flex gap-3 pt-1">
                      <div className="h-3 w-14 bg-slate-100 rounded-md" />
                      <div className="h-3 w-14 bg-slate-100 rounded-md" />
                      <div className="h-3 w-14 bg-slate-100 rounded-md" />
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-slate-100" />
                    {/* Actions row */}
                    <div className="flex justify-between items-center pt-1">
                      <div className="h-4 w-16 bg-slate-200 rounded-md" />
                      <div className="h-4 w-20 bg-gradient-to-r from-red-50 to-red-100 rounded-md animate-pulse-glow" />
                    </div>
                  </div>
                </div>
              ))}
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
                        src={car.image?.startsWith('http') ? car.image : `https://server-chi-two-10.vercel.app${car.image || ''}`}
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
                          <div className="inline-flex items-baseline gap-1 bg-gradient-to-r from-red-600 to-red-500 px-3 py-1.5 rounded-lg shadow-sm">
                            <span className="text-lg font-black text-white">{formatPrice(car.price)}</span>
                            <span className="text-[10px] font-bold text-white/80">{t('common:currency.perDayShort') || '/j'}</span>
                          </div>
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
                          <span>{t(`vehicles.specs.${car.fuel.toLowerCase()}`, car.fuel)}</span>
                        </li>
                      </ul>
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
                        <Link
                          to={`/cars/${car.id}`}
                          className="flex-1 py-2 text-center text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                        >
                          {t('actions.details')}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (car.available && !car.reserved) {
                              navigate(`/booking?car=${car.id}`);
                            }
                          }}
                          className={`flex-1 py-2 text-center text-sm font-bold rounded-xl flex items-center justify-center gap-1 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                            car.available && !car.reserved
                              ? 'bg-gradient-to-r from-[#0F172B] to-[#1e293b] text-white hover:from-[#1e293b] hover:to-[#334155]'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {car.available && !car.reserved ? t('common:actions.book') : t('cars:car.reserved')}
                          {car.available && !car.reserved && <IconArrowRight className="w-3.5 h-3.5" />}
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
                  src="/imgs/famly.jpg"
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

              <div className="absolute top-4 right-2 sm:top-6 sm:right-4 bg-white rounded-2xl shadow-lg p-3 sm:p-4 border border-slate-200">
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <IconStar key={i} className="w-4 h-4" filled />
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
