const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);
router.post('/', carController.createCar);

module.exports = router;
