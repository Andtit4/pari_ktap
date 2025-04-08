import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware d'authentification
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Veuillez vous authentifier.' });
  }
};

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà.' 
      });
    }
    
    const user = new User({
      username,
      email,
      password,
      phoneNumber
    });
    
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtenir le profil utilisateur
router.get('/profile', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le solde KTAP
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide.' });
    }
    
    req.user.ktapBalance += amount;
    await req.user.save();
    
    res.json({ user: req.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrait de KTAP
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide.' });
    }
    
    if (req.user.ktapBalance < amount) {
      return res.status(400).json({ error: 'Solde insuffisant.' });
    }
    
    req.user.ktapBalance -= amount;
    await req.user.save();
    
    res.json({ user: req.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 