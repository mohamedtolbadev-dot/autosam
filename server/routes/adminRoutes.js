const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/adminAuth');
const { upload } = require('../middleware/cloudinaryUpload');
const multer = require('multer');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const db = require('../config/db');
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
        
        // Revenus totaux et revenus du mois (confirmed et completed uniquement)
        const [totalRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status IN ('confirmed', 'completed')");
        const [monthRevenue] = await db.query(`
            SELECT COALESCE(SUM(total_price), 0) as total 
            FROM bookings 
            WHERE status IN ('confirmed', 'completed') 
            AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
        `);
        
        // Voitures disponibles et réservées
        const today = new Date().toISOString().split('T')[0];
        const [availableCars] = await db.query(`
            SELECT COUNT(*) as count FROM cars 
            WHERE available = 1 AND id NOT IN (
                SELECT DISTINCT car_id FROM bookings 
                WHERE status IN ('pending', 'confirmed') 
                AND pickup_date <= ? AND return_date >= ?
            )
        `, [today, today]);
        const [reservedCars] = await db.query(`
            SELECT COUNT(DISTINCT car_id) as count FROM bookings 
            WHERE status IN ('pending', 'confirmed') 
            AND pickup_date <= ? AND return_date >= ?
        `, [today, today]);
        
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
        
        // Top 5 voitures les plus réservées (excluding cancelled bookings)
        const [topCars] = await db.query(`
            SELECT c.id, c.name, c.category, 
                   COUNT(CASE WHEN b.status != 'cancelled' THEN b.id END) as booking_count, 
                   SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price ELSE 0 END) as total_revenue
            FROM cars c
            LEFT JOIN bookings b ON c.id = b.car_id
            GROUP BY c.id, c.name, c.category
            ORDER BY booking_count DESC
            LIMIT 5
        `);
        
        // Locations les plus populaires - Lieu de prise en charge
        const [topPickupLocations] = await db.query(`
            SELECT pickup_location as location, COUNT(*) as count
            FROM bookings
            GROUP BY pickup_location
            ORDER BY count DESC
            LIMIT 5
        `);
        
        // Locations les plus populaires - Lieu de restitution
        const [topReturnLocations] = await db.query(`
            SELECT dropoff_location as location, COUNT(*) as count
            FROM bookings
            GROUP BY dropoff_location
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
                monthRevenue: monthRevenue[0].total,
                availableCars: availableCars[0].count,
                reservedCars: reservedCars[0].count
            },
            recentBookings: recentBookings.slice(0, 10),
            weeklyBookings,
            monthlyBookings,
            topCars,
            topPickupLocations,
            topReturnLocations
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
            console.log('📧 Status changed, preparing to send email...');
            const bookingData = {
                id: booking.id,
                email: booking.email,
                first_name: booking.first_name,
                last_name: booking.last_name,
                car_name: booking.car_name,
                pickup_date: booking.pickup_date,
                return_date: booking.return_date,
                pickup_location: booking.pickup_location,
                total_price: booking.total_price,
                language: booking.language || 'fr'
            };
            
            console.log('📧 Booking data for email:', { ...bookingData, email: '***' });
            
            // Send appropriate email based on status
            try {
                if (status === 'confirmed') {
                    console.log('📧 Sending confirmation email...');
                    await sendBookingConfirmation(bookingData);
                    console.log('✅ Confirmation email sent');
                } else {
                    console.log('📧 Sending status update email for:', status);
                    await sendStatusUpdate(bookingData, status);
                    console.log('✅ Status update email sent');
                }
            } catch (emailErr) {
                console.error('❌ Email sending error:', emailErr);
            }
        } else {
            console.log('ℹ️ Status not changed, no email sent');
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

// GET /api/admin/cars - Liste complète des voitures avec statistiques
router.get('/cars', auth, isAdmin, async (req, res) => {
    try {
        // Get cars with booking statistics (confirmed and completed only)
        const [cars] = await db.query(`
            SELECT c.*, 
                   COALESCE(COUNT(b.id), 0) as booking_count,
                   COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price ELSE 0 END), 0) as total_revenue
            FROM cars c
            LEFT JOIN bookings b ON c.id = b.car_id
            GROUP BY c.id, c.name, c.category, c.price_per_day, c.seats, 
                     c.transmission, c.fuel, c.available, c.image_url, c.year_model, 
                     c.doors, c.description, c.features
            ORDER BY c.name
        `);
        
        // Get secondary images for each car
        const carsWithDetails = await Promise.all(cars.map(async (car) => {
            const [images] = await db.query(
                'SELECT image_url, is_primary, display_order FROM car_images WHERE car_id = ? ORDER BY display_order',
                [car.id]
            );
            
            // Check if car is currently reserved
            const today = new Date().toISOString().split('T')[0];
            const [reservedCheck] = await db.query(
                `SELECT COUNT(*) as count FROM bookings 
                 WHERE car_id = ? AND status IN ('pending', 'confirmed') 
                 AND pickup_date <= ? AND return_date >= ?`,
                [car.id, today, today]
            );
            
            return {
                id: car.id,
                name: car.name,
                category: car.category,
                price: car.price_per_day,
                price_per_day: car.price_per_day,
                seats: car.seats,
                transmission: car.transmission,
                fuel: car.fuel,
                available: car.available === 1 || car.available === true,
                reserved: reservedCheck[0].count > 0,
                image: car.image_url,
                images: images.map(img => img.image_url),
                year: car.year_model,
                year_model: car.year_model,
                doors: car.doors,
                description: car.description,
                features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features,
                booking_count: car.booking_count || 0,
                total_revenue: car.total_revenue || 0
            };
        }));
        
        res.json(carsWithDetails);
    } catch (error) {
        console.error('Cars error:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/cars - Ajouter une voiture avec images
router.post('/cars', auth, isAdmin, (req, res, next) => {
    console.log('📥 Create car request');
    console.log('📄 Content-Type:', req.headers['content-type']);
    
    upload.array('images', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('❌ Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'Fichier trop volumineux. Taille maximum: 10MB' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            console.error('❌ Multer/Cloudinary error:', err);
            return res.status(500).json({ message: err.message });
        }
        console.log('✅ File upload middleware passed, files:', req.files?.length || 0);
        next();
    });
}, async (req, res) => {
    try {
        console.log('📝 Request body:', req.body);
        console.log('📎 Uploaded files:', req.files);
        
        // Get uploaded files from Cloudinary
        const uploadedFiles = req.files || [];
        const imageUrls = uploadedFiles.map(file => file.path); // Cloudinary returns URL in file.path
        
        // Parse features if it's a string
        let features = req.body.features || '[]';
        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch (e) {
                features = features.split(',').map(f => f.trim()).filter(f => f);
            }
        }
        
        // Ensure numeric values
        const pricePerDay = parseInt(req.body.price_per_day) || 0;
        const seats = parseInt(req.body.seats) || 5;
        const doors = parseInt(req.body.doors) || 5;
        const yearModel = parseInt(req.body.year_model) || 2024;
        
        // Prepare car data
        const carData = {
            ...req.body,
            price_per_day: pricePerDay,
            seats: seats,
            doors: doors,
            year_model: yearModel,
            available: req.body.available === 'true' || req.body.available === true ? 1 : 0,
            image_url: imageUrls.length > 0 ? imageUrls[0] : null, // Main image
            images: imageUrls, // All images including secondary
            features: typeof features === 'string' ? features : JSON.stringify(features)
        };
        
        console.log('🚗 Car data to create:', carData);
        
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
        
        console.log('✅ Car created successfully with ID:', carId);
        res.status(201).json({ id: carId, message: 'Voiture ajoutée avec succès', images: imageUrls });
    } catch (error) {
        console.error('❌ Create car error:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/cars/:id - Mettre à jour une voiture avec images
router.put('/cars/:id', auth, isAdmin, (req, res, next) => {
    // Only process files if they exist in the request
    const contentType = req.headers['content-type'] || '';
    const hasFiles = contentType.includes('multipart/form-data');
    
    console.log('📥 Update car request:', req.params.id);
    console.log('📄 Content-Type:', contentType);
    console.log('📎 Has multipart files:', hasFiles);
    
    if (!hasFiles) {
        // No files to upload, skip multer and proceed
        console.log('⏭️ Skipping file upload middleware');
        return next();
    }
    
    upload.array('images', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('❌ Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'Fichier trop volumineux. Taille maximum: 10MB' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            console.error('❌ Multer/Cloudinary error:', err);
            return res.status(500).json({ message: err.message });
        }
        console.log('✅ File upload middleware passed, files:', req.files?.length || 0);
        next();
    });
}, async (req, res) => {
    try {
        console.log('📝 Request body:', req.body);
        console.log('📎 Uploaded files:', req.files);
        
        // Get uploaded files from Cloudinary
        const uploadedFiles = req.files || [];
        const newImageUrls = uploadedFiles.map(file => file.path); // Cloudinary returns URL in file.path
        
        // Get existing car to check if we need to keep old images
        const [existingCar] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
        if (existingCar.length === 0) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }
        
        // Parse features if it's a string
        let features = req.body.features;
        if (typeof features === 'string') {
            try {
                features = JSON.parse(features);
            } catch (e) {
                features = features.split(',').map(f => f.trim()).filter(f => f);
            }
        }
        
        // Handle images to delete - normalize URLs to match database format
        let imagesToDelete = [];
        if (req.body.images_to_delete) {
            try {
                imagesToDelete = JSON.parse(req.body.images_to_delete);
            } catch (e) {
                console.log('Failed to parse images_to_delete:', e);
            }
        }
        
        // Delete marked images from car_images table
        // Normalize URLs to handle both full URLs and relative paths
        if (imagesToDelete.length > 0) {
            for (let imgUrl of imagesToDelete) {
                // Extract path from full URL if needed
                let normalizedUrl = imgUrl;
                if (imgUrl.includes('vercel.app')) {
                    normalizedUrl = imgUrl.replace(/^https?:\/\/[^/]+/, '');
                }
                
                // Delete using exact match or LIKE for partial matches
                const [deleteResult] = await db.query(
                    'DELETE FROM car_images WHERE car_id = ? AND (image_url = ? OR image_url = ?)',
                    [req.params.id, imgUrl, normalizedUrl]
                );
                console.log('Deleted image:', imgUrl, 'affected rows:', deleteResult.affectedRows);
                
                // Also update the main image if it was deleted
                if (existingCar[0].image_url === imgUrl || existingCar[0].image_url === normalizedUrl) {
                    await db.query('UPDATE cars SET image_url = NULL WHERE id = ?', [req.params.id]);
                }
            }
        }
        
        // Get remaining existing images with normalized URLs
        let existingImages = [];
        if (req.body.existing_images) {
            try {
                existingImages = JSON.parse(req.body.existing_images);
                // Normalize URLs to match database format
                existingImages = existingImages.map(url => {
                    if (url.includes('vercel.app')) {
                        return url.replace(/^https?:\/\/[^/]+/, '');
                    }
                    return url;
                });
            } catch (e) {
                console.log('Failed to parse existing_images:', e);
            }
        }
        
        // Get primary image index from request (default to 0)
        const primaryImageIndex = parseInt(req.body.primary_image_index) || 0;
        console.log('Primary image index:', primaryImageIndex);
        
        // Combine all images: existing (remaining) + new uploads
        let allImages = [];
        
        // Add remaining existing images
        if (existingImages.length > 0) {
            allImages = [...existingImages];
        }
        
        // Add new uploaded images
        if (newImageUrls.length > 0) {
            allImages = [...allImages, ...newImageUrls];
        }
        
        // Determine main image based on user's selection
        let mainImage = null;
        if (allImages.length > 0) {
            // Use the selected primary image index, but ensure it's within bounds
            const safeIndex = Math.min(Math.max(0, primaryImageIndex), allImages.length - 1);
            mainImage = allImages[safeIndex];
            console.log('Selected primary image:', mainImage, 'at index:', safeIndex);
        } else {
            // Fallback to old main image if no images left
            mainImage = existingCar[0].image_url;
        }
        
        // Ensure price_per_day is a valid number
        const pricePerDay = parseInt(req.body.price_per_day) || 0;
        const seats = parseInt(req.body.seats) || 5;
        const doors = parseInt(req.body.doors) || 5;
        const yearModel = parseInt(req.body.year_model) || 2024;
        
        // Update car
        const [result] = await db.query(
            `UPDATE cars SET 
                name = ?, category = ?, price_per_day = ?, seats = ?, 
                transmission = ?, fuel = ?, available = ?, image_url = ?,
                year_model = ?, doors = ?, description = ?, features = ?
            WHERE id = ?`,
            [
                req.body.name, req.body.category, pricePerDay,
                seats, req.body.transmission, req.body.fuel,
                req.body.available === 'true' || req.body.available === true ? 1 : 0, 
                mainImage, yearModel,
                doors, req.body.description, 
                typeof features === 'string' ? features : JSON.stringify(features),
                req.params.id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }
        
        // Reset all images to non-primary first
        await db.query('UPDATE car_images SET is_primary = false WHERE car_id = ?', [req.params.id]);
        
        // Insert/update all images with correct primary status
        if (allImages.length > 0) {
            for (let i = 0; i < allImages.length; i++) {
                const isPrimary = (i === Math.min(Math.max(0, primaryImageIndex), allImages.length - 1));
                const imageUrl = allImages[i];
                
                // Check if image already exists
                const [existingImg] = await db.query(
                    'SELECT id FROM car_images WHERE car_id = ? AND image_url = ?',
                    [req.params.id, imageUrl]
                );
                
                if (existingImg.length > 0) {
                    // Update existing image
                    await db.query(
                        'UPDATE car_images SET is_primary = ?, display_order = ? WHERE id = ?',
                        [isPrimary, i, existingImg[0].id]
                    );
                } else {
                    // Insert new image
                    await db.query(
                        'INSERT INTO car_images (car_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
                        [req.params.id, imageUrl, isPrimary, i]
                    );
                }
            }
        }
        
        // Clean up any orphaned images (not in allImages list)
        if (allImages.length > 0) {
            const placeholders = allImages.map(() => '?').join(',');
            await db.query(
                `DELETE FROM car_images WHERE car_id = ? AND image_url NOT IN (${placeholders})`,
                [req.params.id, ...allImages]
            );
        }
        
        console.log('✅ Car updated successfully');
        res.json({ message: 'Voiture mise à jour avec succès', images: allImages });
    } catch (error) {
        console.error('❌ Update car error:', error);
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
