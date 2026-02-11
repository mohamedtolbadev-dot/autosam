/**
 * Données centralisées des véhicules — source unique pour Home, Cars, CarDetails, Booking.
 */

export const cars = [
  {
    id: 1,
    name: 'Dacia Sandero',
    category: 'Économique',
    price: 250,
    seats: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    available: true,
    image: 'https://www.dacia.m-automotiv.ma/storage/modeles/July2024/cqIoY1of8TmMNxpyfq2E.webp',
    year: 2023,
    doors: 5,
    luggage: 3,
    airConditioning: true,
    description: 'La Dacia Sandero est le choix parfait pour découvrir le Maroc de manière économique et confortable. Spacieuse et fiable, elle est idéale pour les trajets en ville comme pour les escapades.',
    features: ['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux', 'Radio USB', 'Vitres électriques'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 2,
    name: 'Dacia Logan',
    category: 'Économique',
    price: 280,
    seats: 5,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    available: true,
    image: 'https://www.dacia.m-automotiv.ma/storage/modeles/July2024/JiRNGocgD2jqDjNSvDk3.webp',
    year: 2023,
    doors: 5,
    luggage: 4,
    airConditioning: true,
    description: 'La Dacia Logan offre un excellent rapport qualité-prix avec un coffre spacieux. Idéale pour les familles et les longs trajets sur les routes marocaines.',
    features: ['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux', 'Radio USB', 'Vitres électriques'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 3,
    name: 'Renault Clio',
    category: 'Compacte',
    price: 300,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Diesel',
    available: true,
    image: 'https://s3-eu-west-1.amazonaws.com/staticeu.izmocars.com/toolkit/commonassets/2025/25renault/25renaultcliotechnohb5rbfr/25renaultcliotechnohb5rbfr_animations/colorpix/fr/400x300/renault_25cliotechnohb5rbfr_orangevalencia_angular-front.webp',
    year: 2024,
    doors: 5,
    luggage: 3,
    airConditioning: true,
    description: 'La Renault Clio allie confort et dynamisme. Boîte automatique et équipements modernes pour un voyage agréable partout au Maroc.',
    features: ['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux', 'Radio USB', 'Vitres électriques', 'Écran tactile'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 4,
    name: 'Peugeot 208',
    category: 'Compacte',
    price: 320,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    available: true,
    image: 'https://autohub.ma/wp-content/uploads/2024/05/peugeot-208-1.webp',
    year: 2024,
    doors: 5,
    luggage: 3,
    airConditioning: true,
    description: 'Compacte et élégante, la Peugeot 208 est parfaite pour la ville et les courtes escapades. Design moderne et conduite agréable.',
    features: ['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux', 'Radio USB', 'Vitres électriques'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 5,
    name: 'Hyundai Tucson',
    category: 'SUV',
    price: 550,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Diesel',
    available: true,
    image: 'https://cdn.brandini.it/offer-prod/upload-66d85719dcd9c3.29994881.jpg',
    year: 2023,
    doors: 5,
    luggage: 5,
    airConditioning: true,
    description: 'Le Hyundai Tucson SUV offre espace et confort pour toute la famille. Idéal pour les routes de montagne et les longs trajets.',
    features: ['Climatisation automatique', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags', 'Radio USB', 'Vitres électriques', 'Toit panoramique'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 6,
    name: 'Toyota Prado',
    category: 'SUV',
    price: 850,
    seats: 7,
    transmission: 'Automatique',
    fuel: 'Diesel',
    available: true,
    image: 'https://www.toyota.bj/media/gamme/modeles/images/9e878c57629e89d81b0480ae838af2e0.png',
    year: 2023,
    doors: 5,
    luggage: 6,
    airConditioning: true,
    description: 'Le Toyota Prado est le SUV robuste et spacieux pour les aventures en tout terrain. Sept places et coffre généreux pour les groupes et les bagages.',
    features: ['Climatisation automatique', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags', 'Radio USB', 'Vitres électriques', '4x4'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 7,
    name: 'Mercedes Classe A',
    category: 'Luxe',
    price: 700,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    available: true,
    image: 'https://kifalstorage.s3.amazonaws.com/new/img/mercedesbenz/classea/principal.png',
    year: 2024,
    doors: 5,
    luggage: 4,
    airConditioning: true,
    description: 'La Mercedes Classe A allie luxe et compactité. Équipements haut de gamme et confort premium pour un voyage en toute élégance.',
    features: ['Climatisation automatique', 'Cuir', 'Bluetooth', 'Écran multimédia', 'ABS', 'Airbags', 'Vitres électriques', 'Régulateur de vitesse'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  },
  {
    id: 8,
    name: 'BMW Série 3',
    category: 'Luxe',
    price: 900,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Diesel',
    available: false,
    image: 'https://autohub.ma/wp-content/uploads/2024/07/bmw-serie-3-maroc.png',
    year: 2024,
    doors: 5,
    luggage: 4,
    airConditioning: true,
    description: 'La BMW Série 3 incarne le luxe et la sportivité. Confort exceptionnel et conduite dynamique pour les clients exigeants.',
    features: ['Climatisation automatique', 'Cuir', 'Bluetooth', 'Écran multimédia', 'ABS', 'Airbags', 'Vitres électriques', 'Régulateur de vitesse', 'Toit ouvrant'],
    included: ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7', 'Deuxième conducteur gratuit']
  }
];

/** IDs des véhicules mis en avant sur la page d'accueil (premiers de la liste). */
export const featuredCarIds = [1, 2, 3];

/** Retourne les véhicules en vedette pour la page d'accueil. */
export function getFeaturedCars() {
  return featuredCarIds.map((id) => cars.find((c) => c.id === id)).filter(Boolean);
}

/** Retourne un véhicule par son id, ou undefined. */
export function getCarById(id) {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (Number.isNaN(numId)) return undefined;
  return cars.find((c) => c.id === numId);
}

/** Calcule les options de tarifs dégressifs à partir du prix au jour. */
export function getRentalOptions(pricePerDay) {
  const tiers = [
    { days: 1, factor: 1 },
    { days: 3, factor: 0.92 },
    { days: 7, factor: 0.84 },
    { days: 14, factor: 0.76 },
    { days: 30, factor: 0.68 }
  ];
  return tiers.map(({ days, factor }) => ({
    days,
    pricePerDay: Math.round(pricePerDay * factor),
    total: Math.round(pricePerDay * factor * days)
  }));
}
