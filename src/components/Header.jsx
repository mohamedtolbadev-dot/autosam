import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCustomer } from '../context/CustomerContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';

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
  const { customer, isAuthenticated, logout } = useCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/cars', label: t('nav.cars') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') }
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
          <nav className="hidden lg:flex items-center gap-4">
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
            
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            <CurrencySelector scrolled={scrolled} />

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            <LanguageSelector scrolled={scrolled} />

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

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
                  <span className="hidden xl:inline">{customer?.first_name || 'Mon compte'}</span>
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
                      Mes réservations
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
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                >
                  Connexion
                </Link>
                <span className="text-slate-300">|</span>
                <Link
                  to="/register"
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </nav>

          {/* Tablet Navigation - Simplified (md to lg) */}
          <nav className="hidden md:flex lg:hidden items-center gap-3">
            <CurrencySelector scrolled={scrolled} />
            <LanguageSelector scrolled={scrolled} />
            
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
                      Mes réservations
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
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu avec animation simple */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl md:hidden animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => 
                  `px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                    isActive ? 'bg-red-50 text-red-600' : 'text-slate-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            
            <div className="border-t border-slate-100 my-2" />
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {customer?.first_name || 'Mon compte'}
                  </p>
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">Mes réservations</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 mt-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
                <div className="border-t border-slate-100 my-2" />
              </>
            ) : (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Compte</p>
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium text-center hover:bg-slate-200 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium text-center hover:bg-red-700 transition-colors"
                    >
                      Inscription
                    </Link>
                  </div>
                </div>
                <div className="border-t border-slate-100 my-2" />
              </>
            )}
            
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Devise</p>
              <CurrencySelector scrolled={true} />
            </div>

            <div className="border-t border-slate-100 my-2" />

            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Langue</p>
              <LanguageSelector scrolled={true} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;