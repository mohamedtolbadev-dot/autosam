import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Taux de conversion fixes (base: MAD)
// Ces taux peuvent être remplacés par un appel API pour des taux en temps réel
const EXCHANGE_RATES = {
  MAD: { rate: 1, symbol: 'MAD', name: 'Dirham marocain', flag: '🇲🇦' },
  USD: { rate: 0.10, symbol: '$', name: 'Dollar américain', flag: '🇺🇸' },
  EUR: { rate: 0.091, symbol: '€', name: 'Euro', flag: '🇪🇺' },
};

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  // Récupérer la devise sauvegardée ou utiliser MAD par défaut
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCurrency');
      return saved || 'MAD';
    }
    return 'MAD';
  });

  const [rates, setRates] = useState(EXCHANGE_RATES);
  const [loading, setLoading] = useState(false);

  // Sauvegarder la devise dans localStorage
  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency);
  }, [currency]);

  // Fonction pour convertir un montant de MAD vers la devise sélectionnée
  const convertFromMAD = useCallback((amountInMAD) => {
    if (!amountInMAD || isNaN(amountInMAD)) return 0;
    const rate = rates[currency]?.rate || 1;
    return amountInMAD * rate;
  }, [currency, rates]);

  // Fonction pour convertir un montant de la devise sélectionnée vers MAD
  const convertToMAD = useCallback((amountInCurrency) => {
    if (!amountInCurrency || isNaN(amountInCurrency)) return 0;
    const rate = rates[currency]?.rate || 1;
    return amountInCurrency / rate;
  }, [currency, rates]);

  // Formater un montant avec le symbole de la devise
  const formatPrice = useCallback((amountInMAD, options = {}) => {
    const { showCurrency = true, decimals = 0 } = options;
    const converted = convertFromMAD(amountInMAD);
    const symbol = rates[currency]?.symbol || currency;
    
    const formatter = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const formatted = formatter.format(converted);
    
    if (showCurrency) {
      // Position du symbole selon la devise
      if (['USD', 'CAD', 'AUD'].includes(currency)) {
        return `${symbol}${formatted}`;
      }
      return `${formatted} ${symbol}`;
    }
    
    return formatted;
  }, [currency, convertFromMAD, rates]);

  // Changer la devise
  const changeCurrency = useCallback((newCurrency) => {
    if (rates[newCurrency]) {
      setCurrency(newCurrency);
    }
  }, [rates]);

  // Obtenir les informations de la devise actuelle
  const currentCurrency = rates[currency] || rates.MAD;

  // Liste des devises disponibles
  const availableCurrencies = Object.keys(rates).map(code => ({
    code,
    ...rates[code]
  }));

  const value = {
    currency,
    currentCurrency,
    availableCurrencies,
    convertFromMAD,
    convertToMAD,
    formatPrice,
    changeCurrency,
    loading,
    rates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export default CurrencyContext;
