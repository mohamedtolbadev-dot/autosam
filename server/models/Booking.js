const db = require('../config/db');

const Booking = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT b.*, c.name as car_name, c.category as car_category, c.image_url as car_image
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            ORDER BY b.created_at DESC
        `);
        return rows;
    },
    
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT b.*, c.name as car_name, c.category as car_category, c.image_url as car_image,
                   c.price_per_day, c.seats, c.transmission, c.fuel
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            WHERE b.id = ?
        `, [id]);
        return rows[0];
    },
    
    getByUserId: async (userId) => {
        const [rows] = await db.query(`
            SELECT b.*, c.name as car_name, c.category as car_category, c.image_url as car_image
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [userId]);
        return rows;
    },
    
    getByEmail: async (email) => {
        const [rows] = await db.query(`
            SELECT b.*, c.name as car_name, c.category as car_category, c.image_url as car_image
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            WHERE b.email = ?
            ORDER BY b.created_at DESC
        `, [email]);
        return rows;
    },
    
    create: async (bookingData) => {
        const { 
            car_id, 
            user_id = null, 
            first_name, 
            last_name, 
            email, 
            phone,
            license_number,
            pickup_location,
            pickup_date,
            return_date,
            total_price,
            status = 'pending',
            notes = ''
        } = bookingData;
        
        const [result] = await db.query(
            `INSERT INTO bookings 
             (car_id, user_id, first_name, last_name, email, phone, license_number, pickup_location, pickup_date, return_date, total_price, status, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [car_id, user_id || null, first_name, last_name, email, phone, license_number || null, pickup_location, pickup_date, return_date, total_price, status, notes]
        );
        return result.insertId;
    },
    
    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    },
    
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Booking;
