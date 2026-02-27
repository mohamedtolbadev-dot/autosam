const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Get token from Authorization header only
const getToken = (req) => {
    if (req.headers.authorization) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

// Middleware pour vérifier le token JWT
const auth = async (req, res, next) => {
    try {
        const token = getToken(req);
        
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware optionnel (ne bloque pas si pas de token)
const optionalAuth = async (req, res, next) => {
    try {
        const token = getToken(req);
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        next();
    }
};

module.exports = { auth, isAdmin, optionalAuth };
