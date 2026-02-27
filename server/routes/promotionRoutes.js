const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const { auth: adminAuth, isAdmin } = require('../middleware/adminAuth');

// Public routes - get active promotions
router.get('/', promotionController.getAllPromotions);
router.post('/validate', promotionController.validatePromotion);

// Admin routes - all CRUD operations
router.get('/admin/all', adminAuth, isAdmin, promotionController.getAllPromotionsAdmin);
router.get('/admin/:id', adminAuth, isAdmin, promotionController.getPromotionById);
router.post('/', adminAuth, isAdmin, promotionController.createPromotion);
router.put('/:id', adminAuth, isAdmin, promotionController.updatePromotion);
router.delete('/:id', adminAuth, isAdmin, promotionController.deletePromotion);
router.patch('/:id/status', adminAuth, isAdmin, promotionController.togglePromotionStatus);

module.exports = router;
