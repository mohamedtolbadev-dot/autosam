const Booking = require('../models/Booking');

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
