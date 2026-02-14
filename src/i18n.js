import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frCars from './locales/fr/cars.json';
import frBooking from './locales/fr/booking.json';
import frAbout from './locales/fr/about.json';
import frContact from './locales/fr/contact.json';
import frFooter from './locales/fr/footer.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enCars from './locales/en/cars.json';
import enBooking from './locales/en/booking.json';
import enAbout from './locales/en/about.json';
import enContact from './locales/en/contact.json';
import enFooter from './locales/en/footer.json';

const resources = {
  fr: {
    common: frCommon,
    home: frHome,
    cars: frCars,
    booking: frBooking,
    about: frAbout,
    contact: frContact,
    footer: frFooter,
  },
  en: {
    common: enCommon,
    home: enHome,
    cars: enCars,
    booking: enBooking,
    about: enAbout,
    contact: enContact,
    footer: enFooter,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
