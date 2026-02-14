import { Car, Users, MapPin, Award, Shield, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation('about');
  const stats = [
    { icon: <Car className="w-8 h-8" />, value: '500+', label: t('stats.vehicles') },
    { icon: <Users className="w-8 h-8" />, value: '10K+', label: t('stats.satisfiedCustomers') },
    { icon: <MapPin className="w-8 h-8" />, value: '15', label: t('stats.agencies') },
    { icon: <Award className="w-8 h-8" />, value: '15+', label: t('stats.yearsExperience') }
  ];

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: t('values.security.title'),
      description: t('values.security.description')
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: t('values.availability.title'),
      description: t('values.availability.description')
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: t('values.quality.title'),
      description: t('values.quality.description')
    }
  ];

  const timeline = [
    {
      year: t('timeline.item1.year'),
      title: t('timeline.item1.title'),
      description: t('timeline.item1.description')
    },
    {
      year: t('timeline.item2.year'),
      title: t('timeline.item2.title'),
      description: t('timeline.item2.description')
    },
    {
      year: t('timeline.item3.year'),
      title: t('timeline.item3.title'),
      description: t('timeline.item3.description')
    },
    {
      year: t('timeline.item4.year'),
      title: t('timeline.item4.title'),
      description: t('timeline.item4.description')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden rounded-b-2xl sm:rounded-b-3xl bg-slate-800">
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl py-10 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-300 text-xs sm:text-sm font-medium uppercase tracking-wider mb-3">{t('hero.breadcrumb')}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('hero.title')}</h1>
            <p className="text-base sm:text-lg text-slate-200">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-8 sm:-mt-10 relative z-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-2">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 border border-red-100">
                  <div className="scale-75 sm:scale-100">{stat.icon}</div>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{stat.value}</p>
                <p className="text-slate-600 text-[10px] sm:text-xs md:text-sm uppercase tracking-wide font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">{t('story.title')}</h2>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-slate-600 leading-relaxed text-center md:text-left">
              <p className="mb-4">{t('story.paragraph1')}</p>
              <p className="mb-4">{t('story.paragraph2')}</p>
              <p>{t('story.paragraph3')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-12 sm:py-16 bg-slate-100/50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10 sm:mb-12 text-center">{t('values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center hover:shadow-lg hover:border-slate-300 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-2xl mb-5 border border-red-100">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8 sm:mb-12 text-center">{t('timeline.title')}</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-3 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0">
                      {item.year}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-red-200 mt-2 sm:mt-3" />
                    )}
                  </div>
                  <div className="flex-1 pb-4 sm:pb-6">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 bg-slate-900 text-white rounded-t-2xl sm:rounded-t-3xl">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-base sm:text-lg mb-8 text-slate-200">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/cars" 
              className="inline-flex items-center justify-center bg-white text-red-600 px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition"
            >
              {t('cta.vehiclesButton')}
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center border-2 border-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition"
            >
              {t('cta.contactButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;