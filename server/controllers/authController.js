const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Customer Registration
exports.register = async (req, res) => {
    const { first_name, last_name, email, phone, password } = req.body;
    
    try {
        // Validation
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        
        // Check if email exists
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        // Create username from email (part before @)
        const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);
        
        // Create user
        const userId = await User.create({
            username,
            email,
            password_hash,
            role: 'customer',
            first_name,
            last_name,
            phone
        });
        
        const user = await User.getById(userId);
        const token = generateToken(user);
        
        res.status(201).json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
};

// Updated Login - supports both username and email
exports.login = async (req, res) => {
    const { email, username, password } = req.body;
    const loginField = email || username;

    try {
        if (!loginField || !password) {
            return res.status(400).json({ message: 'Email/Nom d\'utilisateur et mot de passe requis' });
        }
        
        // Try to find by username first, then by email
        let user = await User.findByUsername(loginField);
        if (!user) {
            user = await User.findByEmail(loginField);
        }
        
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

// Créer un administrateur (pour setup initial)
exports.createAdmin = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
        }
        
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Cet email existe déjà' });
        }
        
        // Hasher le mot de passe
        const password_hash = await bcrypt.hash(password, 10);
        
        // Créer l'admin
        const userId = await User.create({
            username,
            email,
            password_hash,
            role: 'admin'
        });
        
        res.status(201).json({
            message: 'Administrateur créé avec succès',
            user: {
                id: userId,
                username,
                email,
                role: 'admin'
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.getById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, phone } = req.body;
        
        await User.update(req.user.userId, { first_name, last_name, phone });
        
        const user = await User.getById(req.user.userId);
        
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};

// Verify Token (legacy method for backward compatibility)
exports.verifyToken = async (req, res) => {
    try {
        const user = await User.getById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
