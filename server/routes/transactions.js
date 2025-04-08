const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// Créer une demande de dépôt
router.post('/deposits', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide' });
    }

    const deposit = new Deposit({
      user: req.user.id,
      amount
    });

    await deposit.save();
    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir l'historique des dépôts d'un utilisateur
router.get('/deposits', auth, async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une demande de retrait
router.post('/withdrawals', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide' });
    }

    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }

    const withdrawal = new Withdrawal({
      user: req.user.id,
      amount
    });

    await withdrawal.save();
    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir l'historique des retraits d'un utilisateur
router.get('/withdrawals', auth, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes admin pour gérer les transactions
router.get('/admin/deposits', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const deposits = await Deposit.find()
      .populate('user', 'username email')
      .populate('processedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/admin/withdrawals', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const withdrawals = await Withdrawal.find()
      .populate('user', 'username email')
      .populate('processedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Traiter un dépôt
router.put('/admin/deposits/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { status } = req.body;
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: 'Dépôt non trouvé' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Ce dépôt a déjà été traité' });
    }

    deposit.status = status;
    deposit.processedAt = new Date();
    deposit.processedBy = req.user.id;

    if (status === 'approved') {
      const user = await User.findById(deposit.user);
      user.balance += deposit.amount;
      await user.save();
    }

    await deposit.save();
    res.json(deposit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Traiter un retrait
router.put('/admin/withdrawals/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { status, reason } = req.body;
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: 'Retrait non trouvé' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Ce retrait a déjà été traité' });
    }

    withdrawal.status = status;
    withdrawal.reason = reason;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user.id;

    if (status === 'approved') {
      const user = await User.findById(withdrawal.user);
      if (user.balance < withdrawal.amount) {
        return res.status(400).json({ message: 'Solde insuffisant' });
      }
      user.balance -= withdrawal.amount;
      await user.save();
    }

    await withdrawal.save();
    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 