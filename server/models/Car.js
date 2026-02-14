const db = require('../config/db');

const Car = {
    // Check if car has active bookings (pending or confirmed)
    isReserved: async (carId) => {
        const today = new Date().toISOString().split('T')[0];
        const [bookings] = await db.query(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE car_id = ? 
             AND status IN ('pending', 'confirmed') 
             AND pickup_date <= ? 
             AND return_date >= ?`,
            [carId, today, today]
        );
        return bookings[0].count > 0;
    },

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM cars');
        // Get all secondary images for each car
        const carsWithImages = await Promise.all(rows.map(async (row) => {
            const [images] = await db.query(
                'SELECT image_url, is_primary, display_order FROM car_images WHERE car_id = ? ORDER BY display_order',
                [row.id]
            );
            // Check if car is reserved
            const isReserved = await Car.isReserved(row.id);
            return {
                id: row.id,
                name: row.name,
                category: row.category,
                price: row.price_per_day || row.price,
                price_per_day: row.price_per_day || row.price,
                seats: row.seats,
                transmission: row.transmission,
                fuel: row.fuel,
                available: row.available !== undefined ? row.available : true,
                reserved: isReserved,
                image: row.image_url || row.image,
                images: images.map(img => img.image_url),
                year: row.year_model || row.year,
                doors: row.doors,
                description: row.description,
                features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
                included: row.included || ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7']
            };
        }));
        return carsWithImages;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
        if (!rows[0]) return null;
        const row = rows[0];
        
        // Get secondary images
        const [images] = await db.query(
            'SELECT image_url, is_primary, display_order FROM car_images WHERE car_id = ? ORDER BY display_order',
            [id]
        );
        
        // Check if car is reserved
        const isReserved = await Car.isReserved(id);
        
        // Mapper les noms de champs pour correspondre au frontend
        return {
            id: row.id,
            name: row.name,
            category: row.category,
            price: row.price_per_day || row.price,
            price_per_day: row.price_per_day || row.price,
            seats: row.seats,
            transmission: row.transmission,
            fuel: row.fuel,
            available: row.available !== undefined ? row.available : true,
            reserved: isReserved,
            image: row.image_url || row.image,
            images: images.map(img => img.image_url),
            year: row.year_model || row.year,
            doors: row.doors,
            description: row.description,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
            included: row.included || ['Assurance tous risques', 'Kilométrage illimité', 'Assistance 24/7']
        };
    },
    create: async (carData) => {
        const { name, category, price, price_per_day, seats, transmission, fuel, image, image_url, year, year_model, doors, description, features } = carData;
        const finalPrice = price_per_day || price;
        const finalImage = image_url || image;
        const finalYear = year_model || year;
        const [result] = await db.query(
            'INSERT INTO cars (name, category, price_per_day, seats, transmission, fuel, image_url, year_model, doors, description, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, category, finalPrice, seats, transmission, fuel, finalImage, finalYear, doors, description, JSON.stringify(features)]
        );
        return result.insertId;
    }
};

module.exports = Car;
