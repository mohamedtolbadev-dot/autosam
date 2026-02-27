const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Promotion = {
    // Get all active promotions with car data (excluding reserved cars)
    getAll: async (activeOnly = false) => {
        const today = new Date().toISOString().split('T')[0];
        
        let query = `
            SELECT 
                p.*,
                c.name as car_name,
                c.image_url as car_image,
                c.price_per_day as car_price,
                c.category as car_category,
                c.seats as car_seats,
                c.transmission as car_transmission,
                c.fuel as car_fuel
            FROM promotions p
            LEFT JOIN cars c ON p.car_id = c.id
            LEFT JOIN (
                SELECT car_id 
                FROM bookings 
                WHERE status IN ('pending', 'confirmed') 
                AND pickup_date <= ? 
                AND return_date >= ?
            ) b ON p.car_id = b.car_id
            WHERE b.car_id IS NULL
        `;
        
        const queryParams = [today, today];
        
        if (activeOnly) {
            query += ' AND p.is_active = TRUE AND (p.start_date IS NULL OR p.start_date <= CURDATE()) AND p.end_date >= CURDATE()';
        }
        
        query += ' ORDER BY p.display_order ASC, p.created_at DESC';
        
        const [rows] = await db.query(query, queryParams);
        
        // Format response to include car image as promotion image
        return rows.map(row => ({
            ...row,
            image_url: row.car_image || row.image_url || '/imgs/promo-default.jpg'
        }));
    },

    // Get promotion by ID with car data
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT 
                p.*,
                c.name as car_name,
                c.image_url as car_image,
                c.price_per_day as car_price,
                c.category as car_category,
                c.seats as car_seats,
                c.transmission as car_transmission,
                c.fuel as car_fuel
            FROM promotions p
            LEFT JOIN cars c ON p.car_id = c.id
            WHERE p.id = ?
        `, [id]);
        if (!rows[0]) return null;
        return {
            ...rows[0],
            image_url: rows[0].car_image || rows[0].image_url || '/imgs/promo-default.jpg'
        };
    },

    // Create new promotion
    create: async (promoData) => {
        const {
            title,
            title_fr,
            title_en,
            description_fr,
            description_en,
            discount_percent,
            discount_amount,
            code,
            start_date,
            end_date,
            is_active,
            display_order,
            car_id
        } = promoData;

        const promoId = uuidv4();
        await db.query(
            `INSERT INTO promotions (
                id, title, title_fr, title_en, description_fr, description_en,
                discount_percent, discount_amount, code, start_date, end_date,
                is_active, display_order, car_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                promoId, title, title_fr, title_en, description_fr, description_en,
                discount_percent || 0, discount_amount || 0, code, start_date, end_date,
                is_active !== undefined ? is_active : true, display_order || 0, car_id || null
            ]
        );
        return promoId;
    },

    // Update promotion
    update: async (id, promoData) => {
        const {
            title,
            title_fr,
            title_en,
            description_fr,
            description_en,
            discount_percent,
            discount_amount,
            code,
            start_date,
            end_date,
            is_active,
            display_order,
            car_id
        } = promoData;

        await db.query(
            `UPDATE promotions SET
                title = ?, title_fr = ?, title_en = ?, description_fr = ?, description_en = ?,
                discount_percent = ?, discount_amount = ?, code = ?, start_date = ?, end_date = ?,
                is_active = ?, display_order = ?, car_id = ?
            WHERE id = ?`,
            [
                title, title_fr, title_en, description_fr, description_en,
                discount_percent, discount_amount, code, start_date, end_date,
                is_active, display_order, car_id, id
            ]
        );
        return true;
    },

    // Delete promotion
    delete: async (id) => {
        await db.query('DELETE FROM promotions WHERE id = ?', [id]);
        return true;
    },

    // Toggle active status
    toggleActive: async (id, isActive) => {
        await db.query('UPDATE promotions SET is_active = ? WHERE id = ?', [isActive, id]);
        return true;
    },

    // Validate promo code
    validateByCode: async (code, carId) => {
        const [rows] = await db.query(`
            SELECT 
                p.*,
                c.name as car_name,
                c.image_url as car_image,
                c.price_per_day as car_price,
                c.category as car_category,
                c.seats as car_seats,
                c.transmission as car_transmission,
                c.fuel as car_fuel
            FROM promotions p
            LEFT JOIN cars c ON p.car_id = c.id
            WHERE UPPER(p.code) = UPPER(?)
                AND p.is_active = TRUE
                AND (p.start_date IS NULL OR p.start_date <= CURDATE())
                AND p.end_date >= CURDATE()
                AND (p.car_id IS NULL OR p.car_id = ?)
        `, [code, carId]);
        return rows[0] || null;
    }
};

module.exports = Promotion;
