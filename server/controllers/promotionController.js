const Promotion = require('../models/Promotion');

// Get all promotions (public - only active)
exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.getAll(true);
        res.json({ success: true, data: promotions });
    } catch (error) {
        console.error('Error getting promotions:', error);
        res.status(500).json({ success: false, message: 'Error fetching promotions' });
    }
};

// Get all promotions (admin - all)
exports.getAllPromotionsAdmin = async (req, res) => {
    try {
        const promotions = await Promotion.getAll(false);
        res.json({ success: true, data: promotions });
    } catch (error) {
        console.error('Error getting all promotions:', error);
        res.status(500).json({ success: false, message: 'Error fetching promotions' });
    }
};

// Get promotion by ID 
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.getById(req.params.id);
        if (!promotion) {
            return res.status(404).json({ success: false, message: 'Promotion not found' });
        }
        res.json({ success: true, data: promotion });
    } catch (error) {
        console.error('Error getting promotion:', error);
        res.status(500).json({ success: false, message: 'Error fetching promotion' });
    }
};

// Create promotion (admin only)
exports.createPromotion = async (req, res) => {
    try {
        console.log('Creating promotion with data:', req.body);
        const promoId = await Promotion.create(req.body);
        console.log('Promotion created successfully with ID:', promoId);
        res.status(201).json({ success: true, data: { id: promoId }, message: 'Promotion created successfully' });
    } catch (error) {
        console.error('Error creating promotion:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Error creating promotion: ' + error.message });
    }
};

// Update promotion (admin only)
exports.updatePromotion = async (req, res) => {
    try {
        await Promotion.update(req.params.id, req.body);
        res.json({ success: true, message: 'Promotion updated successfully' });
    } catch (error) {
        console.error('Error updating promotion:', error);
        res.status(500).json({ success: false, message: 'Error updating promotion' });
    }
};

// Delete promotion (admin only)
exports.deletePromotion = async (req, res) => {
    try {
        await Promotion.delete(req.params.id);
        res.json({ success: true, message: 'Promotion deleted successfully' });
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ success: false, message: 'Error deleting promotion' });
    }
};

// Toggle promotion active status
exports.togglePromotionStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        await Promotion.toggleActive(req.params.id, isActive);
        res.json({ success: true, message: 'Promotion status updated' });
    } catch (error) {
        console.error('Error toggling promotion status:', error);
        res.status(500).json({ success: false, message: 'Error updating promotion status' });
    }
};

// Validate promo code
exports.validatePromotion = async (req, res) => {
    try {
        const { code, carId } = req.body;
        
        if (!code) {
            return res.status(400).json({ success: false, message: 'Code promo requis' });
        }
        
        const promotion = await Promotion.validateByCode(code, carId || null);
        
        if (!promotion) {
            return res.status(404).json({ success: false, message: 'Code promo invalide ou expiré' });
        }
        
        res.json({
            success: true,
            message: 'Code promo valide',
            code: promotion.code,
            title: promotion.title,
            discount_percent: promotion.discount_percent,
            discount_amount: promotion.discount_amount,
            car_id: promotion.car_id
        });
    } catch (error) {
        console.error('Error validating promotion:', error);
        res.status(500).json({ success: false, message: 'Error validating promo code' });
    }
};
