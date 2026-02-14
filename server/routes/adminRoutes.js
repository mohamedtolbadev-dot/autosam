const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/adminAuth');
const { upload } = require('../middleware/upload');
const multer = require('multer');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const db = require('../config/db');
const path = require('path');
const { sendBookingConfirmation, sendStatusUpdate } = require('../services/emailService');

// GET /api/admin/dashboard - Statistiques complètes du tableau de bord
router.get('/dashboard', auth, isAdmin, async (req, res) => {
    try {
        // Statistiques globales
        const [carsCount] = await db.query('SELECT COUNT(*) as count FROM cars');
        const [bookingsCount] = await db.query('SELECT COUNT(*) as count FROM bookings');
        const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
        
        // Réservations par statut
        const [pendingCount] = await db.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'");
        const [confirmedCount] = await db.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'");
        const [completedCount] = await db.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'");
        const [cancelledCount] = await db.query("SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled'");
        
        // Revenus totaux et revenus du mois
        const [totalRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status IN ('pending', 'confirmed', 'completed')");
        const [monthRevenue] = await db.query(`
            SELECT COALESCE(SUM(total_price), 0) as total 
            FROM bookings 
            WHERE status IN ('pending', 'confirmed', 'completed') 
            AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `);
        
        // Réservations des 7 derniers jours
        const [weeklyBookings] = await db.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM bookings
            WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
        `);
        
        // Réservations par mois (année en cours)
        const [monthlyBookings] = await db.query(`
            SELECT MONTH(created_at) as month, COUNT(*) as count, COALESCE(SUM(total_price), 0) as revenue
            FROM bookings
            WHERE YEAR(created_at) = YEAR(CURRENT_DATE())
            GROUP BY MONTH(created_at)
            ORDER BY month
        `);
        
        // Réservations récentes avec détails
        const recentBookings = await Booking.getAll();
        
        // Top 5 voitures les plus réservées
        const [topCars] = await db.query(`
            SELECT c.id, c.name, c.category, COUNT(b.id) as booking_count, SUM(b.total_price) as total_revenue
            FROM cars c
            LEFT JOIN bookings b ON c.id = b.car_id
            GROUP BY c.id, c.name, c.category
            ORDER BY booking_count DESC
            LIMIT 5
        `);
        
        // Locations les plus populaires
        const [topLocations] = await db.query(`
            SELECT pickup_location, COUNT(*) as count
            FROM bookings
            GROUP BY pickup_location
            ORDER BY count DESC
            LIMIT 5
        `);
        
        res.json({
            stats: {
                totalCars: carsCount[0].count,
                totalBookings: bookingsCount[0].count,
                totalUsers: usersCount[0].count,
                pendingBookings: pendingCount[0].count,
                confirmedBookings: confirmedCount[0].count,
                completedBookings: completedCount[0].count,
                cancelledBookings: cancelledCount[0].count,
                totalRevenue: totalRevenue[0].total,
                monthRevenue: monthRevenue[0].total
            },
            recentBookings: recentBookings.slice(0, 10),
            weeklyBookings,
            monthlyBookings,
            topCars,
            topLocations
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/statistics - Statistiques détaillées
router.get('/statistics', auth, isAdmin, async (req, res) => {
    try {
        const { period = 'year' } = req.query;
        
        let dateFilter = '';
        if (period === 'month') {
            dateFilter = 'AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)';
        } else if (period === 'quarter') {
            dateFilter = 'AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)';
        } else if (period === 'year') {
            dateFilter = 'AND YEAR(created_at) = YEAR(CURRENT_DATE())';
        }
        
        // Évolution des réservations par jour
        const [dailyEvolution] = await db.query(`
            SELECT DATE(created_at) as date, 
                   COUNT(*) as bookings,
                   COALESCE(SUM(total_price), 0) as revenue
            FROM bookings
            WHERE 1=1 ${dateFilter}
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
        `);
        
        // Répartition par catégorie de voiture
        const [categoryDistribution] = await db.query(`
            SELECT c.category, COUNT(b.id) as bookings, SUM(b.total_price) as revenue
            FROM cars c
            LEFT JOIN bookings b ON c.id = b.car_id ${dateFilter.replace('created_at', 'b.created_at')}
            GROUP BY c.category
            ORDER BY bookings DESC
        `);
        
        // Taux de conversion (réservations confirmées / total)
        const [conversionRate] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status IN ('confirmed', 'completed') THEN 1 ELSE 0 END) as confirmed
            FROM bookings
            WHERE 1=1 ${dateFilter}
        `);
        
        const rate = conversionRate[0].total > 0 
            ? (conversionRate[0].confirmed / conversionRate[0].total * 100).toFixed(2)
            : 0;
        
        res.json({
            dailyEvolution,
            categoryDistribution,
            conversionRate: {
                rate: parseFloat(rate),
                total: conversionRate[0].total,
                confirmed: conversionRate[0].confirmed
            }
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/bookings - Toutes les réservations avec filtres
router.get('/bookings', auth, isAdmin, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        
        let query = `
            SELECT b.*, c.name as car_name, c.category as car_category, c.image_url as car_image
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            WHERE 1=1
        `;
        const params = [];
        
        if (status) {
            query += ' AND b.status = ?';
            params.push(status);
        }
        
        if (search) {
            query += ' AND (b.first_name LIKE ? OR b.last_name LIKE ? OR b.email LIKE ? OR c.name LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        query += ' ORDER BY b.created_at DESC';
        
        // Pagination
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const [bookings] = await db.query(query, params);
        
        // Total pour la pagination
        let countQuery = 'SELECT COUNT(*) as total FROM bookings b JOIN cars c ON b.car_id = c.id WHERE 1=1';
        const countParams = [];
        
        if (status) {
            countQuery += ' AND b.status = ?';
            countParams.push(status);
        }
        
        if (search) {
            countQuery += ' AND (b.first_name LIKE ? OR b.last_name LIKE ? OR b.email LIKE ? OR c.name LIKE ?)';
            const searchPattern = `%${search}%`;
            countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        const [totalCount] = await db.query(countQuery, countParams);
        
        res.json({
            bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount[0].total,
                pages: Math.ceil(totalCount[0].total / limit)
            }
        });
    } catch (error) {
        console.error('Bookings error:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/bookings/:id/status - Mettre à jour le statut
router.put('/bookings/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Statut invalide' });
        }
        
        // Get booking details before update
        const [bookingResult] = await db.query(
            `SELECT b.*, c.name as car_name 
             FROM bookings b 
             JOIN cars c ON b.car_id = c.id 
             WHERE b.id = ?`,
            [req.params.id]
        );
        
        if (bookingResult.length === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        const booking = bookingResult[0];
        const previousStatus = booking.status;
        
        const [result] = await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        // Send email notification if status changed
        if (previousStatus !== status) {
            const bookingData = {
                id: booking.id,
                email: booking.email,
                first_name: booking.first_name,
                last_name: booking.last_name,
                car_name: booking.car_name,
                pickup_date: booking.pickup_date,
                return_date: booking.return_date,
                pickup_location: booking.pickup_location,
                total_price: booking.total_price
            };
            
            // Send appropriate email based on status
            if (status === 'confirmed') {
                await sendBookingConfirmation(bookingData);
            } else {
                await sendStatusUpdate(bookingData, status);
            }
        }
        
        res.json({ message: 'Statut mis à jour avec succès', status });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/bookings/:id - Supprimer une réservation
router.delete('/bookings/:id', auth, isAdmin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        
        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/cars - Liste complète des voitures
router.get('/cars', auth, isAdmin, async (req, res) => {
    try {
        const cars = await Car.getAll();
        res.json(cars);
    } catch (error) {
        console.error('Cars error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/cars - Ajouter une voiture avec images
router.post('/cars', auth, isAdmin, (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'Fichier trop volumineux. Taille maximum: 10MB' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred
            return res.status(500).json({ message: err.message });
        }
        // Everything went fine, proceed to next middleware
        next();
    });
}, async (req, res) => {
    try {
        // Get uploaded files
        const uploadedFiles = req.files || [];
        const imageUrls = uploadedFiles.map(file => `/uploads/cars/${file.filename}`);
        
        // Prepare car data
        const carData = {
            ...req.body,
            image_url: imageUrls.length > 0 ? imageUrls[0] : null, // Main image
            images: imageUrls // All images including secondary
        };
        
        const carId = await Car.create(carData);
        
        // Save secondary images to car_images table
        if (imageUrls.length > 1) {
            for (let i = 1; i < imageUrls.length; i++) {
                await db.query(
                    'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
                    [carId, imageUrls[i], false, i]
                );
            }
        }
        
        // Also save primary image if exists
        if (imageUrls.length > 0) {
            await db.query(
                'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
                [carId, imageUrls[0], true, 0]
            );
        }
        
        res.status(201).json({ id: carId, message: 'Voiture ajoutée avec succès', images: imageUrls });
    } catch (error) {
        console.error('Create car error:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/cars/:id - Mettre à jour une voiture avec images
router.put('/cars/:id', auth, isAdmin, (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'Fichier trop volumineux. Taille maximum: 10MB' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        // Get uploaded files
        const uploadedFiles = req.files || [];
        const newImageUrls = uploadedFiles.map(file => `/uploads/cars/${file.filename}`);
        
        // Get existing car to check if we need to keep old images
        const [existingCar] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (existingCar.length === 0) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }
        
        // Determine main image
        let mainImage = existingCar[0].image_url;
        if (newImageUrls.length > 0) {
            mainImage = newImageUrls[0];
        }
        
        // Update car
        const [result] = await db.query(
            `UPDATE cars SET 
                name = ?, category = ?, price_per_day = ?, seats = ?, 
                transmission = ?, fuel = ?, available = ?, image_url = ?,
                year_model = ?, doors = ?, description = ?, features = ?
            WHERE id = ?`,
            [
                req.body.name, req.body.category, req.body.price_per_day,
                req.body.seats, req.body.transmission, req.body.fuel,
                req.body.available, mainImage, req.body.year_model,
                req.body.doors, req.body.description, req.body.features,
                req.params.id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }
        
        // Add new secondary images
        if (newImageUrls.length > 1) {
            for (let i = 1; i < newImageUrls.length; i++) {
                await db.query(
                    'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
                    [req.params.id, newImageUrls[i], false, i]
                );
            }
        }
        
        // If new primary image, update car_images table
        if (newImageUrls.length > 0) {
            await db.query(
                'UPDATE car_images SET is_primary = false WHERE car_id = ?',
                [req.params.id]
            );
            await db.query(
                'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_url = ?, is_primary = true',
                [req.params.id, newImageUrls[0], true, 0, newImageUrls[0]]
            );
        }
        
        res.json({ message: 'Voiture mise à jour avec succès', images: newImageUrls });
    } catch (error) {
        console.error('Update car error:', error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/cars/:id - Supprimer une voiture
router.delete('/cars/:id', auth, isAdmin, async (req, res) => {
    try {
        // Vérifier s'il y a des réservations
        const [bookings] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE car_id = ?', [req.params.id]);
        
        if (bookings[0].count > 0) {
            return res.status(400).json({ 
                message: 'Impossible de supprimer cette voiture car elle a des réservations associées'
            });
        }
        
        const [result] = await db.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }
        
        res.json({ message: 'Voiture supprimée avec succès' });
    } catch (error) {
        console.error('Delete car error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/users - Liste des utilisateurs
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, role, first_name, last_name, phone, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Users error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/contact-messages - Liste des messages de contact
router.get('/contact-messages', auth, isAdmin, async (req, res) => {
    try {
        const [messages] = await db.query(
            'SELECT id, name, email, phone, subject, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC'
        );
        res.json(messages);
    } catch (error) {
        console.error('Contact messages error:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/contact-messages/:id/read - Marquer comme lu
router.put('/contact-messages/:id/read', auth, isAdmin, async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE contact_messages SET is_read = true WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Message non trouvé' });
        }
        
        res.json({ message: 'Message marqué comme lu' });
    } catch (error) {
        console.error('Update message error:', error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/contact-messages/:id - Supprimer un message
router.delete('/contact-messages/:id', auth, isAdmin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Message non trouvé' });
        }
        
        res.json({ message: 'Message supprimé avec succès' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
