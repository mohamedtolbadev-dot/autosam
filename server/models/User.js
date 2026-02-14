const db = require('../config/db');

const User = {
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    create: async (userData) => {
        const { username, email, password_hash, role = 'user', first_name, last_name, phone } = userData;
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, password_hash, role, first_name, last_name, phone]
        );
        return result.insertId;
    },
    update: async (id, userData) => {
        const { first_name, last_name, phone } = userData;
        const [result] = await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
            [first_name, last_name, phone, id]
        );
        return result.affectedRows;
    }
};

module.exports = User;
