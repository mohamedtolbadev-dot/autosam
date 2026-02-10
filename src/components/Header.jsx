import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

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

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/cars', label: 'Véhicules' },
  { to: '/about', label: 'À propos' },
  { to: '/contact', label: 'Contact' }
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-red-100 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
              <span className="relative inline-flex items-center justify-center w-11 h-11 bg-red-600 text-white rounded-xl shadow-lg transition-transform duration-500 group-hover:rotate-[10deg]">
                <IconCar className="w-6 h-6" />
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                Location <span className="text-red-600">Maroc</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Premium Service</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
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
            
            <div className="h-6 w-[1px] bg-slate-200 mx-2" /> {/* Séparateur */}

            <Link
              to="/cars"
              className="inline-flex items-center px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-red-200"
            >
              Réserver maintenant
            </Link>
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
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl md:hidden animate-in slide-in-from-top duration-300">
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
            <Link
              to="/cars"
              className="mt-4 w-full py-4 bg-red-600 text-white text-center font-black rounded-xl shadow-lg shadow-red-200"
            >
              VOIR LE CATALOGUE
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;