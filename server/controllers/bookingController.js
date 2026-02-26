const Booking = require('../models/Booking');
const Car = require('../models/Car');
const emailService = require('../services/emailService');

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAll();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.getById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Réservation non trouvée' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId; // Depuis le middleware auth
        const userEmail = req.user.email;
        
        // Get bookings by user_id OR by email (for backward compatibility)
        let bookings = await Booking.getByUserId(userId);
        
        // If no bookings found by user_id, try by email
        if (!bookings || bookings.length === 0) {
            bookings = await Booking.getByEmail(userEmail);
        }
        
        res.json(bookings || []);
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            user_id: req.user ? req.user.userId : null
        };
        
        const bookingId = await Booking.create(bookingData);
        
        // Get car details for email
        let carDetails = null;
        try {
            carDetails = await Car.getById(bookingData.car_id);
        } catch (err) {
            console.log('Could not fetch car details for email:', err.message);
        }
        
        // Send notification email to agency
        console.log('📧 Attempting to send agency notification email...');
        emailService.sendNewBookingNotification(
            { ...bookingData, id: bookingId },
            carDetails
        ).then(emailResult => {
            console.log('📧 Agency email result:', emailResult);
            if (emailResult.success) {
                console.log('✅ Notification email sent successfully');
            } else {
                console.error('❌ Failed to send notification email:', emailResult.error);
            }
        }).catch(err => {
            console.error('❌ Email service error:', err);
        });
        
        // Send confirmation email to client
        console.log('📧 Attempting to send client confirmation email...');
        emailService.sendBookingConfirmation({
            ...bookingData,
            id: bookingId,
            car_name: carDetails ? `${carDetails.brand} ${carDetails.model}` : bookingData.car_name
        }).then(emailResult => {
            console.log('📧 Client email result:', emailResult);
            if (emailResult) {
                console.log('✅ Client confirmation email sent successfully');
            } else {
                console.error('❌ Failed to send client confirmation email');
            }
        }).catch(err => {
            console.error('❌ Client email service error:', err);
        });
        
        res.status(201).json({ 
            id: bookingId, 
            ...bookingData,
            message: 'Réservation créée avec succès' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Booking.updateStatus(req.params.id, status);
        if (!updated) return res.status(404).json({ message: 'Réservation non trouvée' });
        res.json({ message: 'Statut mis à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const deleted = await Booking.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Réservation non trouvée' });
        res.json({ message: 'Réservation annulée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
