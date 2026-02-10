import { Car, Users, MapPin, Award, Shield, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Car className="w-8 h-8" />, value: '500+', label: 'Véhicules' },
    { icon: <Users className="w-8 h-8" />, value: '10K+', label: 'Clients satisfaits' },
    { icon: <MapPin className="w-8 h-8" />, value: '15', label: 'Agences' },
    { icon: <Award className="w-8 h-8" />, value: '15+', label: 'Ans d\'expérience' }
  ];

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Sécurité',
      description: 'Tous nos véhicules sont régulièrement entretenus et couverts par une assurance complète pour votre tranquillité d\'esprit.'
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: 'Disponibilité',
      description: 'Service client disponible 24h/24 et 7j/7 pour répondre à tous vos besoins, où que vous soyez au Maroc.'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Qualité',
      description: 'Une flotte moderne et diversifiée pour répondre à tous les besoins, de l\'économique au véhicule de luxe.'
    }
  ];

  const timeline = [
    {
      year: '2009',
      title: 'Création de l\'entreprise',
      description: 'Ouverture de notre première agence à Casablanca avec une flotte de 20 véhicules.'
    },
    {
      year: '2012',
      title: 'Expansion nationale',
      description: 'Ouverture d\'agences à Rabat, Marrakech et Fès pour mieux servir nos clients.'
    },
    {
      year: '2017',
      title: 'Modernisation',
      description: 'Lancement de notre plateforme de réservation en ligne et renouvellement complet de notre flotte.'
    },
    {
      year: '2024',
      title: 'Leader du marché',
      description: 'Plus de 500 véhicules et 15 agences à travers tout le royaume, au service de milliers de clients.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">À propos de nous</h1>
            <p className="text-xl text-red-50">
              Votre partenaire de confiance pour la location de voitures au Maroc depuis 2009
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Notre histoire</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Fondée en 2009, notre agence de location de voitures est née de la passion de faciliter 
                les déplacements au Maroc. Ce qui a commencé comme une petite entreprise familiale à 
                Casablanca avec seulement 20 véhicules s'est transformé en l'un des leaders du secteur 
                de la location de voitures au royaume.
              </p>
              <p className="mb-4">
                Notre mission est simple : offrir à nos clients des véhicules fiables, modernes et 
                adaptés à leurs besoins, tout en garantissant un service client exceptionnel. Que vous 
                soyez un touriste découvrant les merveilles du Maroc ou un résident ayant besoin d'un 
                véhicule temporaire, nous avons la solution parfaite pour vous.
              </p>
              <p>
                Aujourd'hui, avec plus de 500 véhicules et 15 agences réparties dans les principales 
                villes du Maroc, nous continuons à innover et à améliorer nos services pour rester 
                votre partenaire de confiance pour tous vos besoins de mobilité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Notre parcours</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.year}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-1 h-full bg-red-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez des milliers de clients satisfaits</h2>
          <p className="text-xl mb-8 text-red-50">
            Découvrez pourquoi nous sommes le premier choix pour la location de voitures au Maroc
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/cars" 
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              Voir nos véhicules
            </a>
            <a 
              href="/contact" 
              className="inline-block border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;