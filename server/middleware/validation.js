const { body, param, validationResult } = require('express-validator');

// Helper to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Booking validation
const validateBooking = [
  body('first_name').trim().notEmpty().withMessage('Le prénom est requis').isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('last_name').trim().notEmpty().withMessage('Le nom est requis').isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email').trim().notEmpty().withMessage('L\'email est requis').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Le téléphone est requis').matches(/^\+?[\d\s-]{8,20}$/).withMessage('Numéro de téléphone invalide'),
  body('pickup_date').trim().notEmpty().withMessage('La date de prise en charge est requise').isISO8601().withMessage('Date invalide'),
  body('return_date').trim().notEmpty().withMessage('La date de retour est requise').isISO8601().withMessage('Date invalide'),
  body('car_id').notEmpty().withMessage('L\'ID de voiture est requis').isInt({ min: 1 }).withMessage('ID de voiture invalide'),
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('password').trim().notEmpty().withMessage('Le mot de passe est requis').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  handleValidationErrors
];

// Registration validation
const validateRegister = [
  body('first_name').trim().notEmpty().withMessage('Le prénom est requis').isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères').matches(/^[a-zA-ZÀ-ÿ\s-]+$/).withMessage('Le prénom contient des caractères invalides'),
  body('last_name').trim().notEmpty().withMessage('Le nom est requis').isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères').matches(/^[a-zA-ZÀ-ÿ\s-]+$/).withMessage('Le nom contient des caractères invalides'),
  body('email').trim().notEmpty().withMessage('L\'email est requis').isEmail().withMessage('Email invalide').normalizeEmail().isLength({ max: 100 }).withMessage('L\'email est trop long'),
  body('password').trim().notEmpty().withMessage('Le mot de passe est requis').isLength({ min: 6, max: 100 }).withMessage('Le mot de passe doit contenir entre 6 et 100 caractères'),
  body('phone').optional().trim().matches(/^\+?[\d\s-]{8,20}$/).withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

// Car validation
const validateCar = [
  body('name').trim().notEmpty().withMessage('Le nom est requis').isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('category').trim().notEmpty().withMessage('La catégorie est requise'),
  body('price').notEmpty().withMessage('Le prix est requis').isFloat({ min: 0, max: 999999 }).withMessage('Prix invalide'),
  body('seats').optional().isInt({ min: 1, max: 50 }).withMessage('Nombre de places invalide'),
  body('transmission').optional().isIn(['manual', 'automatic']).withMessage('Transmission invalide'),
  body('fuel').optional().isIn(['diesel', 'essence', 'hybrid', 'electric']).withMessage('Type de carburant invalide'),
  handleValidationErrors
];

// Contact form validation
const validateContact = [
  body('name').trim().notEmpty().withMessage('Le nom est requis').isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email').trim().notEmpty().withMessage('L\'email est requis').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Le message est requis').isLength({ min: 10, max: 5000 }).withMessage('Le message doit contenir entre 10 et 5000 caractères'),
  body('phone').optional().trim().matches(/^\+?[\d\s-]{8,20}$/).withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

module.exports = {
  validateBooking,
  validateLogin,
  validateRegister,
  validateCar,
  validateContact,
  handleValidationErrors
};
