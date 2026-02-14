import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencySelector = ({ scrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, currentCurrency, availableCurrencies, changeCurrency } = useCurrency();
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (code) => {
    changeCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-semibold ${
          scrolled 
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
            : 'bg-white hover:bg-red-50 text-red-600 border-2 border-white shadow-lg'
        }`}
        aria-expanded={isOpen}
        aria-label="Sélectionner une devise"
      >
        <span className="text-lg">{currentCurrency.flag}</span>
        <span className="font-semibold text-sm">{currency}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
          <div className="p-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
              Sélectionner une devise
            </p>
            {availableCurrencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  currency === curr.code
                    ? 'bg-red-50 text-red-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl">{curr.flag}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{curr.code}</p>
                  <p className="text-xs text-slate-500">{curr.name}</p>
                </div>
                {currency === curr.code && (
                  <svg
                    className="w-5 h-5 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Les taux sont indicatifs. Paiement en MAD sur place.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
