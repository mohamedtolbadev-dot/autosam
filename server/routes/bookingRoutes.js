const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Routes publiques (avec ou sans auth)
router.post('/', bookingController.createBooking);

// Routes protégées (nécessitent authentification)
router.get('/my-bookings', auth, bookingController.getMyBookings);

// Routes admin
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', auth, bookingController.updateBookingStatus);
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;
