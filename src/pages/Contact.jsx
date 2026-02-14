import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { contactApi } from '../api';

const Contact = () => {
  const { t } = useTranslation('contact');
  const inputBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition';
  const selectBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition cursor-pointer appearance-none';
  const textareaBaseClassName =
    'w-full rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:outline-none transition resize-none';
  const primaryButtonClassName =
    'w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition flex items-center justify-center gap-2';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800">
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-3">{t('hero.breadcrumb')}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('hero.title')}</h1>
            <p className="text-base sm:text-lg text-slate-200">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{t('form.title')}</h2>
            
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-2">{t('form.success.title')}</h3>
                <p className="text-emerald-700 text-sm">{t('form.success.message')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-700 text-sm font-medium">{submitError}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.fields.name.label')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className={inputBaseClassName}
                    placeholder={t('form.fields.name.placeholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.fields.email.label')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      className={inputBaseClassName}
                      placeholder={t('form.fields.email.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.fields.phone.label')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={submitting}
                      className={inputBaseClassName}
                      placeholder={t('form.fields.phone.placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.fields.subject.label')}</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className={selectBaseClassName}
                  >
                    <option value="">{t('form.fields.subject.placeholder')}</option>
                    <option value="reservation">{t('form.fields.subject.options.reservation')}</option>
                    <option value="information">{t('form.fields.subject.options.information')}</option>
                    <option value="modification">{t('form.fields.subject.options.modification')}</option>
                    <option value="reclamation">{t('form.fields.subject.options.reclamation')}</option>
                    <option value="autre">{t('form.fields.subject.options.autre')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('form.fields.message.label')}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    disabled={submitting}
                    className={textareaBaseClassName}
                    placeholder={t('form.fields.message.placeholder')}
                  />
                </div>

                <button type="submit" disabled={submitting} className={`${primaryButtonClassName} ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('form.submit')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{t('contactInfo.title')}</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-red-100">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t('contactInfo.phone.title')}</h3>
                    <p className="text-slate-600">{t('contactInfo.phone.number')}</p>
                    <p className="text-sm text-slate-500">{t('contactInfo.phone.subtitle')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-red-100">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t('contactInfo.email.title')}</h3>
                    <p className="text-slate-600">{t('contactInfo.email.address')}</p>
                    <p className="text-sm text-slate-500">{t('contactInfo.email.subtitle')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-red-100">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{t('contactInfo.hours.title')}</h3>
                    <p className="text-slate-600">{t('contactInfo.hours.weekdays')}</p>
                    <p className="text-slate-600">{t('contactInfo.hours.weekend')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3">{t('urgent.title')}</h3>
              <p className="text-slate-200 mb-4 text-sm sm:text-base">
                {t('urgent.description')}
              </p>
              <a 
                href="tel:+212522123456"
                className="inline-flex items-center justify-center bg-white text-red-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition"
              >
                {t('urgent.callButton')}
              </a>
            </div>
          </div>
        </div>


        {/* Map Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="h-96 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
              <div className="text-center">
                <MapPin className="w-14 h-14 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">{t('map.title')}</p>
                <p className="text-sm text-slate-500">{t('map.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;