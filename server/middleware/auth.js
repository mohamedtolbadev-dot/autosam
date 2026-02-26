const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        console.log('❌ Auth failed: No Authorization header');
        return res.status(401).json({ message: 'Authentification requise - Token manquant' });
    }
    
    // Check if header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
        console.log('❌ Auth failed: Authorization header does not start with Bearer');
        return res.status(401).json({ message: 'Format de token invalide - Doit commencer par Bearer' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        console.log('❌ Auth failed: Token is empty after Bearer');
        return res.status(401).json({ message: 'Token manquant après Bearer' });
    }
    
    try {
        const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
        console.log('🔑 JWT Secret available:', jwtSecret ? 'Yes (first 10 chars: ' + jwtSecret.substring(0, 10) + '...)' : 'No - using fallback');
        
        const decodedToken = jwt.verify(token, jwtSecret);
        console.log('✅ Token verified for user:', decodedToken.userId);
        req.user = { userId: decodedToken.userId, username: decodedToken.username, email: decodedToken.email, role: decodedToken.role };
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré - Veuillez vous reconnecter' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide - Format incorrect' });
        }
        return res.status(401).json({ message: 'Session invalide ou expirée' });
    }
};
