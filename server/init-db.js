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
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME || 'autosimo_db'}`);
    console.log(`Base de données ${DB_NAME || 'autosimo_db'} créée/vérifiée`);

    // Utiliser la base de données
    await connection.query(`USE ${DB_NAME || 'autosimo_db'}`);

    // Supprimer et recréer la table cars avec le nouveau schéma
    // Supprimer d'abord bookings à cause de la clé étrangère
    await connection.query('DROP TABLE IF EXISTS bookings');
    await connection.query('DROP TABLE IF EXISTS car_images');
    await connection.query('DROP TABLE IF EXISTS cars');
    
    // Créer la table cars avec le schéma corrigé
    await connection.query(`
      CREATE TABLE cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
    console.log('Table cars recréée avec le nouveau schéma');

    // Supprimer et recréer la table bookings pour assurer la bonne structure
    await connection.query('DROP TABLE IF EXISTS bookings');
    
    // Créer la table bookings
    await connection.query(`
      CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        user_id INT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        license_number VARCHAR(50),
        pickup_location VARCHAR(100) NOT NULL,
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
    console.log('Table bookings recréée avec succès');

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

    // Créer la table car_images pour les images secondaires
    await connection.query(`
      CREATE TABLE IF NOT EXISTS car_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
      )
    `);
    console.log('Table car_images créée/vérifiée');

    // Vérifier si des données existent
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM cars');
    
    if (rows[0].count === 0) {
      console.log('Insertion des données initiales...');
      
      const initialCars = [
        {
          name: 'Dacia Sandero',
          category: 'Économique',
          price_per_day: 250,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Essence',
          available: true,
          image_url: 'https://www.dacia.m-automotiv.ma/storage/modeles/July2024/cqIoY1of8TmMNxpyfq2E.webp',
          year_model: 2023,
          doors: 5,
          description: 'La Dacia Sandero est le choix parfait pour découvrir le Maroc de manière économique et confortable.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS', 'Airbags frontaux'])
        },
        {
          name: 'Dacia Logan',
          category: 'Économique',
          price_per_day: 280,
          seats: 5,
          transmission: 'Manuelle',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://www.dacia.m-automotiv.ma/storage/modeles/July2024/JiRNGocgD2jqDjNSvDk3.webp',
          year_model: 2023,
          doors: 5,
          description: 'La Dacia Logan offre un excellent rapport qualité-prix avec un coffre spacieux.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Verrouillage centralisé', 'ABS'])
        },
        {
          name: 'Renault Clio',
          category: 'Compacte',
          price_per_day: 300,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://s3-eu-west-1.amazonaws.com/staticeu.izmocars.com/toolkit/commonassets/2025/25renault/25renaultcliotechnohb5rbfr/25renaultcliotechnohb5rbfr_animations/colorpix/fr/400x300/renault_25cliotechnohb5rbfr_orangevalencia_angular-front.webp',
          year_model: 2024,
          doors: 5,
          description: 'La Renault Clio allie confort et dynamisme.',
          features: JSON.stringify(['Climatisation', 'Direction assistée', 'Bluetooth', 'Écran tactile'])
        },
        {
          name: 'Hyundai Tucson',
          category: 'SUV',
          price_per_day: 550,
          seats: 5,
          transmission: 'Automatique',
          fuel: 'Diesel',
          available: true,
          image_url: 'https://cdn.brandini.it/offer-prod/upload-66d85719dcd9c3.29994881.jpg',
          year_model: 2023,
          doors: 5,
          description: 'Le Hyundai Tucson SUV offre espace et confort pour toute la famille.',
          features: JSON.stringify(['Climatisation automatique', 'Bluetooth', 'Toit panoramique'])
        }
      ];

      for (const car of initialCars) {
        await connection.query(
          `INSERT INTO cars (name, category, price_per_day, seats, transmission, fuel, available, image_url, year_model, doors, description, features) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [car.name, car.category, car.price_per_day, car.seats, car.transmission, car.fuel, car.available, car.image_url, car.year_model, car.doors, car.description, car.features]
        );
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
        ['admin', 'admin@autosimo.ma', adminPasswordHash, 'admin']
      );
      
      console.log('Administrateur créé avec succès:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('  Email: admin@autosimo.ma');
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
