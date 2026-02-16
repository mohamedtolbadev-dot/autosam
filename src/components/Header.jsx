import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCustomer } from '../context/CustomerContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

// --- Icônes optimisées ---
const IconCar = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1V16c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const IconMenu = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const IconClose = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const Header = () => {
  const { t } = useTranslation();
  const { 
    customer, 
    isAuthenticated, 
    logout,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal
  } = useCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) },
    { to: '/cars', label: t('nav.cars'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ) },
    { to: '/about', label: t('nav.about'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) },
    { to: '/contact', label: t('nav.contact'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ) }
  ];

  // Effet de scroll pour changer l'apparence au défilement
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-semibold transition-all duration-300 group ${
      isActive ? 'text-red-600' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-1' 
          : 'bg-transparent py-2'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <img 
              src="/imgs/autosam1.jpg" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - Full (lg+) */}
          <nav className="hidden lg:flex items-center gap-4 ml-auto">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass} end={to === '/'}>
                {({ isActive }) => (
                  <>
                    {label}
                    {/* Barre d'indication animée sous le lien */}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-red-600 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2" />

            <CurrencySelector scrolled={scrolled} />

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <LanguageSelector scrolled={scrolled} />

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {/* Customer Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden xl:inline">{customer?.first_name || t('booking:header.myAccount')}</span>
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {t('booking:header.myBookings')}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('booking:header.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                >
                  {t('booking:header.login')}
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-100 hover:shadow-red-200"
                >
                  {t('booking:header.register')}
                </button>
              </div>
            )}
          </nav>

          {/* Tablet Navigation - Simplified (md to lg) */}
          <nav className="hidden md:flex lg:hidden items-center gap-3">
            <CurrencySelector scrolled={scrolled} />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-slate-700 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {t('booking:header.myBookings')}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('booking:header.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </nav>

          {/* Mobile Actions & Toggle */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="md:hidden flex items-center gap-1 sm:gap-2">
              <CurrencySelector scrolled={scrolled} />
            <div className="h-4 w-px bg-slate-200" />
              <LanguageSelector scrolled={scrolled} />
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu avec animation simple */}
      {mobileOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 md:hidden animate-in slide-in-from-top-4 fade-in duration-300 max-h-[calc(100vh-100px)] overflow-y-auto z-50">
          <nav className="flex flex-col p-4 gap-1">
            <div className="px-4 py-2 mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('booking:header.menu')}</p>
            </div>
            {navLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                    isActive 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <span className="opacity-70">{icon}</span>
                {label}
              </NavLink>
            ))}
            
            <div className="h-px bg-slate-100 my-4 mx-4" />
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="bg-slate-50 rounded-2xl p-4 mb-2">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">{t('booking:header.welcome')}</p>
                    <p className="text-sm font-bold text-slate-800">{customer?.first_name}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-white transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-bold text-sm">{t('booking:header.myBookings')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-bold text-sm">{t('booking:header.logout')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  {t('booking:header.login')}
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowRegisterModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                >
                  {t('booking:header.register')}
                </button>
              </div>
            )}
            
            <div className="h-px bg-slate-100 my-4 mx-4 md:hidden" />
          </nav>
        </div>
      )}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
};

export default Header;