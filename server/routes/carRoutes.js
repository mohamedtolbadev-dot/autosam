const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');
const { auth: adminAuth, isAdmin } = require('../middleware/adminAuth');

// Public routes
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);

// Protected admin routes
router.post('/', adminAuth, isAdmin, carController.createCar);
router.put('/:id', adminAuth, isAdmin, carController.updateCar);
router.delete('/:id', adminAuth, isAdmin, carController.deleteCar);

module.exports = router;
