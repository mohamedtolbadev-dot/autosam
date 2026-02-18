const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function initializeDatabase() {
  try {
    // Connexion sans base de données pour créer la base
    const connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASSWORD || ''
    });

    console.log('Connexion MySQL établie...');

    // Créer la base de données
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME || 'autosam_db'}`);
    console.log(`Base de données ${DB_NAME || 'autosimo_db'} créée/vérifiée`);

    // Utiliser la base de données
    await connection.query(`USE ${DB_NAME || 'autosimo_db'}`);

    // Supprimer et recréer la table cars avec le nouveau schéma
    // Supprimer d'abord bookings à cause de la clé étrangère
    await connection.query('DROP TABLE IF EXISTS bookings');
    await connection.query('DROP TABLE IF EXISTS car_images');
    await connection.query('DROP TABLE IF EXISTS cars');
    
    // Créer la table cars avec UUID
    await connection.query(`
      CREATE TABLE cars (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category ENUM('Économique', 'Compacte', 'SUV', 'Luxe') NOT NULL,
        price_per_day DECIMAL(10, 2) NOT NULL,
        seats INT NOT NULL,
        transmission ENUM('Manuelle', 'Automatique') NOT NULL,
        fuel ENUM('Essence', 'Diesel', 'Hybride', 'Électrique') NOT NULL,
        available BOOLEAN DEFAULT TRUE,
        image_url VARCHAR(255),
        year_model INT,
        doors INT,
        description TEXT,
        features JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Table cars recréée avec UUID');

    // Supprimer et recréer la table bookings pour assurer la bonne structure
    await connection.query('DROP TABLE IF EXISTS bookings');
    
    // Créer la table bookings avec UUID pour car_id
    await connection.query(`
      CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id CHAR(36) NOT NULL,
        user_id INT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        license_number VARCHAR(50),
        pickup_location VARCHAR(100) NOT NULL,
        dropoff_location VARCHAR(100) NOT NULL,
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        total_price INT NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id)
      )
    `);
    console.log('Table bookings recréée avec UUID pour car_id');

    // Créer la table users pour l'authentification
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(50),
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Table users créée/vérifiée');

    // Ajouter les colonnes manquantes si elles n'existent pas (migration)
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100)`);
      await connection.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100)`);
      await connection.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`);
      console.log('Colonnes first_name, last_name, phone vérifiées/ajoutées');
    } catch (err) {
      console.log('Note: colonnes déjà présentes ou erreur migration:', err.message);
    }

    // Créer la table car_images pour les images secondaires avec UUID
    await connection.query(`
      CREATE TABLE IF NOT EXISTS car_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id CHAR(36) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
      )
    `);
    console.log('Table car_images créée/vérifiée avec UUID');

    // Vérifier si des données existent
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM cars');
    
    if (rows[0].count === 0) {
      console.log('Insertion des données initiales...');
      
      const initialCars = [
        // 1. Dacia Sandero
        {
          name: 'Dacia Sandero',
          category: 'Économique',
          price_per_day: 250,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'La Dacia Sandero est le choix parfait pour découvrir le Maroc de manière économique et confortable.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux']),
          images: [
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 2. Dacia Logan
        {
          name: 'Dacia Logan',
          category: 'Économique',
          price_per_day: 280,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'La Dacia Logan offre un excellent rapport qualité-prix avec un coffre spacieux.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS']),
          images: [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 3. Renault Clio
        {
          name: 'Renault Clio',
          category: 'Compacte',
          price_per_day: 300,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 5,
          description: 'La Renault Clio allie confort et dynamisme pour vos déplacements quotidiens.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Écran tactile', 'Régulateur de vitesse']),
          images: [
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 4. Peugeot 208
        {
          name: 'Peugeot 208',
          category: 'Compacte',
          price_per_day: 350,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 5,
          description: 'Design moderne et conduite agile, parfaite pour les déplacements urbains.',
          features: JSON.stringify(['Écran tactile', 'Radar de recul', 'LED', 'Régulateur de vitesse', 'ABS']),
          images: [
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-13376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 5. Toyota Yaris
        {
          name: 'Toyota Yaris',
          category: 'Économique',
          price_per_day: 320,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Hybride',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 5,
          description: 'Une citadine hybride fiable, idéale pour la ville avec une consommation réduite.',
          features: JSON.stringify(['Climatisation', 'Bluetooth', 'Caméra de recul', 'CarPlay/Android Auto', 'ABS']),
          images: [
            'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 6. Volkswagen Golf
        {
          name: 'Volkswagen Golf',
          category: 'Compacte',
          price_per_day: 420,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'Compacte premium polyvalente avec un excellent confort sur route.',
          features: JSON.stringify(['CarPlay/Android Auto', 'Radar de recul', 'Régulateur de vitesse', 'Bluetooth', 'Lane Assist']),
          images: [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 7. Hyundai Tucson
        {
          name: 'Hyundai Tucson',
          category: 'SUV',
          price_per_day: 550,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'Le Hyundai Tucson SUV offre espace et confort pour toute la famille lors de vos voyages.',
          features: JSON.stringify(['Climatisation automatique', 'Bluetooth', 'Toit panoramique', 'Caméra de recul', 'Aide au stationnement']),
          images: [
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 8. Kia Sportage
        {
          name: 'Kia Sportage',
          category: 'SUV',
          price_per_day: 600,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 5,
          description: 'SUV confortable et spacieux, parfait pour les longs trajets en famille.',
          features: JSON.stringify(['Climatisation', 'Bluetooth', 'Caméra de recul', 'Toit panoramique', 'CarPlay/Android Auto']),
          images: [
            'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 9. Nissan Qashqai
        {
          name: 'Nissan Qashqai',
          category: 'SUV',
          price_per_day: 650,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'SUV moderne avec une conduite souple et des équipements de sécurité avancés.',
          features: JSON.stringify(['Aide au stationnement', 'Bluetooth', 'Régulateur adaptatif', 'Lane Assist', 'LED']),
          images: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 10. BMW Série 3
        {
          name: 'BMW Série 3',
          category: 'Luxe',
          price_per_day: 1800,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 4,
          description: 'Une berline premium pour un confort maximal et une expérience de conduite sportive inoubliable.',
          features: JSON.stringify(['Intérieur cuir', 'Radar de recul', 'Bluetooth', 'Régulateur de vitesse', 'Sièges chauffants', 'Head-Up Display']),
          images: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 11. Tesla Model 3
        {
          name: 'Tesla Model 3',
          category: 'Luxe',
          price_per_day: 1600,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Électrique',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 4,
          description: 'Berline électrique haut de gamme avec autonomie et technologie avancées.',
          features: JSON.stringify(['Autopilot', 'Navigation', 'Caméra 360', 'Sièges chauffants', 'Écran 15 pouces']),
          images: [
            'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 12. Mercedes Classe C
        {
          name: 'Mercedes Classe C',
          category: 'Luxe',
          price_per_day: 2000,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 4,
          description: 'Élégance et technologie au sommet, la Classe C redéfinit le luxe automobile.',
          features: JSON.stringify(['Intérieur cuir Nappa', 'MBUX', 'Caméra 360', 'Toit panoramique', 'Sièges massants', 'Ambiance lumineuse']),
          images: [
            'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 13. Audi A4
        {
          name: 'Audi A4',
          category: 'Luxe',
          price_per_day: 1900,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 4,
          description: 'Berline allemande haut de gamme, alliant technologie, confort et performance.',
          features: JSON.stringify(['Virtual Cockpit', 'CarPlay/Android Auto', 'Sièges chauffants', 'Caméra de recul', 'Régulateur adaptatif']),
          images: [
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 14. Range Rover Evoque
        {
          name: 'Range Rover Evoque',
          category: 'SUV',
          price_per_day: 1200,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 5,
          description: 'Le SUV compact de luxe par excellence, avec un design iconique et des capacités tout-terrain.',
          features: JSON.stringify(['Toit panoramique', 'Caméra 360', 'Terrain Response', 'Sièges cuir', 'Head-Up Display', 'Bluetooth']),
          images: [
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 15. Toyota RAV4
        {
          name: 'Toyota RAV4',
          category: 'SUV',
          price_per_day: 700,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Hybride',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
          year_model: 2024,
          doors: 5,
          description: 'SUV hybride fiable et économique, idéal pour les routes marocaines variées.',
          features: JSON.stringify(['Climatisation automatique', 'CarPlay/Android Auto', 'Caméra de recul', 'Traction 4x4', 'Régulateur adaptatif']),
          images: [
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 16. Seat Ibiza
        {
          name: 'Seat Ibiza',
          category: 'Économique',
          price_per_day: 270,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'Citadine espagnole dynamique et économique, idéale pour les petits budgets.',
          features: JSON.stringify(['Climatisation', 'Bluetooth', 'Écran tactile', 'ABS', 'Verrouillage centralisé']),
          images: [
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 17. Skoda Octavia
        {
          name: 'Skoda Octavia',
          category: 'Compacte',
          price_per_day: 390,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'Berline spacieuse et fiable, avec un excellent rapport espace-prix.',
          features: JSON.stringify(['CarPlay/Android Auto', 'Radar de recul', 'Régulateur de vitesse', 'Bluetooth', 'Caméra de recul']),
          images: [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 18. Ford Mustang
        {
          name: 'Ford Mustang',
          category: 'Luxe',
          price_per_day: 1500,
          seats: 4,
          transmission: 'Automatique',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 2,
          description: 'L\'icône américaine, pour une expérience de conduite sportive et inoubliable.',
          features: JSON.stringify(['Intérieur cuir', 'Bluetooth', 'Caméra de recul', 'Mode Sport', 'Sièges Baquets', 'Échappement sport']),
          images: [
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 19. Opel Corsa
        {
          name: 'Opel Corsa',
          category: 'Économique',
          price_per_day: 260,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Essence',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 5,
          description: 'Petite citadine pratique et économique, parfaite pour les courtes distances.',
          features: JSON.stringify(['Climatisation', 'Bluetooth', 'ABS', 'Verrouillage centralisé', 'Direction assistée']),
          images: [
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        // 20. Jeep Wrangler
        {
          name: 'Jeep Wrangler',
          category: 'SUV',
          price_per_day: 1100,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
          year_model: 2023,
          doors: 4,
          description: 'La légende du tout-terrain, parfaite pour explorer les pistes et déserts marocains.',
          features: JSON.stringify(['4x4 intégral', 'Toit amovible', 'Bluetooth', 'Caméra de recul', 'Barres de toit', 'Blindage sous caisse']),
          images: [
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1603386329225-868f9b1d1f6b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
          ]
        }
      ];

      for (const car of initialCars) {
        // Insert car and get the generated UUID
        const [result] = await connection.query(
          `INSERT INTO cars (id, name, category, price_per_day, seats, transmission, fuel, available, image_url, year_model, doors, description, features) 
           VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [car.name, car.category, car.price_per_day, car.seats, car.transmission, car.fuel, car.available, car.image_url, car.year_model, car.doors, car.description, car.features]
        );
        
        // Get the car_id we just inserted
        const [carRows] = await connection.query(
          'SELECT id FROM cars WHERE name = ? ORDER BY created_at DESC LIMIT 1',
          [car.name]
        );
        
        const carId = carRows[0].id;
        
        // Insert additional images into car_images table
        if (car.images && car.images.length > 1) {
          for (let i = 0; i < car.images.length; i++) {
            const isPrimary = i === 0; // First image is primary
            await connection.query(
              `INSERT INTO car_images (car_id, image_url, is_primary, display_order) 
               VALUES (?, ?, ?, ?)`,
              [carId, car.images[i], isPrimary, i]
            );
          }
        }
      }
      
      console.log(`${initialCars.length} voitures insérées`);
    } else {
      console.log(`La base contient déjà ${rows[0].count} voitures`);
    }

    // Vérifier si l'admin existe déjà
    const [adminRows] = await connection.query('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
    
    if (adminRows[0].count === 0) {
      console.log('Création du compte administrateur initial...');
      
      // Créer un admin par défaut (username: admin, password: admin123)
      const bcrypt = require('bcryptjs');
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      
      await connection.query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES (?, ?, ?, ?)`,
        ['admin', 'admin@autosam.ma', adminPasswordHash, 'admin']
      );
      
      console.log('Administrateur créé avec succès:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('  Email: admin@autosam.ma');
    } else {
      console.log('Un administrateur existe déjà');
    }

    await connection.end();
    console.log('Initialisation terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initializeDatabase();
