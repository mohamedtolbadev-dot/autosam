const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL } = process.env;

async function initializeDatabase() {
  try {
    // Connexion sans base de données pour créer la base
    const connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      port: parseInt(DB_PORT) || 3306,
      ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : false
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
          image_url: '/imgs/cars/dacia-sandero-1.jpg',
          year_model: 2023,
          doors: 5,
          description: 'La Dacia Sandero est le choix parfait pour découvrir le Maroc de manière économique et confortable.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux']),
          images: [
            '/imgs/cars/dacia-sandero-1.jpg',
            '/imgs/cars/dacia-sandero-2.jpg',
            '/imgs/cars/dacia-sandero-3.jpg'
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
          image_url: '/imgs/cars/dacia-logan-1.jpg',
          year_model: 2023,
          doors: 5,
          description: 'La Dacia Logan offre un excellent rapport qualité-prix avec un coffre spacieux.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS']),
          images: [
            '/imgs/cars/dacia-logan-1.jpg',
            '/imgs/cars/dacia-logan-2.jpg',
            '/imgs/cars/dacia-logan-3.jpg'
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
          image_url: '/imgs/cars/renault-clio-1.jpg',
          year_model: 2024,
          doors: 5,
          description: 'La Renault Clio allie confort et dynamisme pour vos déplacements quotidiens.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Écran tactile', 'Régulateur de vitesse']),
          images: [
            '/imgs/cars/renault-clio-1.jpg',
            '/imgs/cars/renault-clio-2.jpg',
            '/imgs/cars/renault-clio-3.jpg',
            '/imgs/cars/renault-clio-4.jpg'
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
          image_url: '/imgs/cars/peugeot-208-1.jpg',
          year_model: 2024,
          doors: 5,
          description: 'Design moderne et conduite agile, parfaite pour les déplacements urbains.',
          features: JSON.stringify(['Écran tactile', 'Radar de recul', 'LED', 'Régulateur de vitesse', 'ABS']),
          images: [
            '/imgs/cars/peugeot-208-1.jpg',
            '/imgs/cars/peugeot-208-2.jpg',
            '/imgs/cars/peugeot-208-3.jpg',
            '/imgs/cars/peugeot-208-4.jpg'
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
          image_url: '/imgs/cars/toyota-yaris-1.jpg',
          year_model: 2024,
          doors: 5,
          description: 'Une citadine hybride fiable, idéale pour la ville avec une consommation réduite.',
          features: JSON.stringify(['Climatisation', 'Bluetooth', 'Caméra de recul', 'CarPlay/Android Auto', 'ABS']),
          images: [
            '/imgs/cars/toyota-yaris-1.jpg',
            '/imgs/cars/toyota-yaris-2.jpg',
            '/imgs/cars/toyota-yaris-3.jpg'
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
          image_url: '/imgs/cars/vw-golf-1.jpg',
          year_model: 2023,
          doors: 5,
          description: 'Compacte premium polyvalente avec un excellent confort sur route.',
          features: JSON.stringify(['CarPlay/Android Auto', 'Radar de recul', 'Régulateur de vitesse', 'Bluetooth', 'Lane Assist']),
          images: [
            '/imgs/cars/vw-golf-1.jpg',
            '/imgs/cars/vw-golf-2.jpg',
            '/imgs/cars/vw-golf-3.jpg',
            '/imgs/cars/vw-golf-4.jpg'
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
          image_url: '/imgs/cars/hyundai-tucson-1.jpg',
          year_model: 2023,
          doors: 5,
          description: 'Le Hyundai Tucson SUV offre espace et confort pour toute la famille lors de vos voyages.',
          features: JSON.stringify(['Climatisation automatique', 'Bluetooth', 'Toit panoramique', 'Caméra de recul', 'Aide au stationnement']),
          images: [
            '/imgs/cars/hyundai-tucson-1.jpg',
            '/imgs/cars/hyundai-tucson-2.jpg',
            '/imgs/cars/hyundai-tucson-3.jpg',
            '/imgs/cars/hyundai-tucson-4.jpg'
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
          image_url: '/imgs/cars/kia-sportage-1.jpg',
          year_model: 2024,
          doors: 5,
          description: 'SUV confortable et spacieux, parfait pour les longs trajets en famille.',
          features: JSON.stringify(['Climatisation', 'Bluetooth', 'Caméra de recul', 'Toit panoramique', 'CarPlay/Android Auto']),
          images: [
            '/imgs/cars/kia-sportage-1.jpg',
            '/imgs/cars/kia-sportage-2.jpg',
            '/imgs/cars/kia-sportage-3.jpg',
            '/imgs/cars/kia-sportage-4.jpg'
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
          image_url: '/imgs/cars/nissan-qashqai-1.jpg',
          year_model: 2023,
          doors: 5,
          description: 'SUV moderne avec une conduite souple et des équipements de sécurité avancés.',
          features: JSON.stringify(['Aide au stationnement', 'Bluetooth', 'Régulateur adaptatif', 'Lane Assist', 'LED']),
          images: [
            '/imgs/cars/nissan-qashqai-1.jpg',
            '/imgs/cars/nissan-qashqai-2.jpg',
            '/imgs/cars/nissan-qashqai-3.jpg'
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
          image_url: '/imgs/cars/bmw-serie3-1.jpg',
          year_model: 2023,
          doors: 4,
          description: 'Une berline premium pour un confort maximal et une expérience de conduite sportive inoubliable.',
          features: JSON.stringify(['Intérieur cuir', 'Radar de recul', 'Bluetooth', 'Régulateur de vitesse', 'Sièges chauffants', 'Head-Up Display']),
          images: [
            '/imgs/cars/bmw-serie3-1.jpg',
            '/imgs/cars/bmw-serie3-2.jpg',
            '/imgs/cars/bmw-serie3-3.jpg',
            '/imgs/cars/bmw-serie3-4.jpg'
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
    const [adminRows] = await connection.query('SELECT COUNT(*) as count FROM users WHERE role = \'admin\'');
    
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
