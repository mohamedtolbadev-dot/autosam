const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/contact - Soumettre un message de contact (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Adresse email invalide' });
        }
        
        // Insert into database
        const [result] = await db.query(
            'INSERT INTO contact_messages (name, email, phone, subject, message, is_read) VALUES (?, ?, ?, ?, ?, false)',
            [name, email, phone || null, subject, message]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Message envoyé avec succès'
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
