const Car = require('../models/Car');

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.getAll();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.getById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Véhicule non trouvé' });
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        const carId = await Car.create(req.body);
        res.status(201).json({ id: carId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
