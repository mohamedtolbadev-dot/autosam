const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentification requise' });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decodedToken.userId, username: decodedToken.username, email: decodedToken.email, role: decodedToken.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Session invalide ou expirée' });
    }
};
