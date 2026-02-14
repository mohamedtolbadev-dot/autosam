import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('footer');
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: t('quickLinks.items.home') },
    { to: '/cars', label: t('quickLinks.items.vehicles') },
    { to: '/about', label: t('quickLinks.items.about') },
    { to: '/contact', label: t('quickLinks.items.contact') },
    { to: '/booking', label: t('quickLinks.items.booking') }
  ];

  const services = [
    t('services.items.shortTerm'),
    t('services.items.longTerm'),
    t('services.items.withDriver'),
    t('services.items.airport'),
    t('services.items.insurance')
  ];

  const cities = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fès',
    'Tanger',
    'Agadir'
  ];

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/imgs/autosam1.jpg" 
                alt="Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {t('brand.description')}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-colors"
                aria-label={t('social.facebook')}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-colors"
                aria-label={t('social.instagram')}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-colors"
                aria-label={t('social.twitter')}
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">{t('quickLinks.title')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="text-slate-600 hover:text-red-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">{t('services.title')}</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-slate-600 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">{t('contact.title')}</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-slate-600 text-sm">
                  {t('contact.address')}<br />{t('contact.city')}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <a href="tel:+212522123456" className="text-slate-600 hover:text-red-600 transition-colors text-sm">
                  +212 522 123 456
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <a href="mailto:contact@locationvoiture.ma" className="text-slate-600 hover:text-red-600 transition-colors text-sm">
                  contact@locationvoiture.ma
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-slate-600 text-sm">
                  {t('contact.hours')}<br />{t('contact.weekend')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              {t('bottomBar.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors">
                {t('bottomBar.terms')}
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors">
                {t('bottomBar.privacy')}
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors">
                {t('bottomBar.legal')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
