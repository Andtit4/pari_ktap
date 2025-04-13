import express from 'express';
import { auth } from './auth.js';
import User from '../models/User.js';
import PendingDeposit from '../models/PendingDeposit.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est admin
router.use(auth, admin);

// Obtenir tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les dépôts en attente
router.get('/pending-deposits', async (req, res) => {
  try {
    const deposits = await PendingDeposit.find({ status: 'pending' })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un utilisateur
router.put('/users/:userId', async (req, res) => {
  try {
    const { username, email, phone, ktapBalance } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (ktapBalance !== undefined) user.ktapBalance = ktapBalance;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Approuver un dépôt
router.post('/deposits/:depositId/approve', async (req, res) => {
  try {
    const deposit = await PendingDeposit.findById(req.params.depositId)
      .populate('user');
    
    if (!deposit) {
      return res.status(404).json({ message: 'Dépôt non trouvé' });
    }
    
    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Ce dépôt a déjà été traité' });
    }
    
    // Mettre à jour le statut du dépôt
    deposit.status = 'approved';
    await deposit.save();
    
    // Créditer le compte de l'utilisateur
    const user = deposit.user;
    user.ktapBalance += deposit.amount;
    await user.save();
    
    res.json({ message: 'Dépôt approuvé avec succès', deposit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Rejeter un dépôt
router.post('/deposits/:depositId/reject', async (req, res) => {
  try {
    const deposit = await PendingDeposit.findById(req.params.depositId);
    
    if (!deposit) {
      return res.status(404).json({ message: 'Dépôt non trouvé' });
    }
    
    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Ce dépôt a déjà été traité' });
    }
    
    deposit.status = 'rejected';
    await deposit.save();
    
    res.json({ message: 'Dépôt rejeté avec succès', deposit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router; 