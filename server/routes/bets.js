import express from 'express';
import Bet from '../models/Bet.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import { auth } from './auth.js';

const router = express.Router();

// Placer un pari
router.post('/', auth, async (req, res) => {
  try {
    const { matchId, amount, betType } = req.body;
    
    // Vérifier si le match existe et est en cours
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    
    if (match.status !== 'live') {
      return res.status(400).json({ error: 'Le match n\'est pas en cours.' });
    }
    
    // Vérifier si l'utilisateur a assez de KTAP
    const user = req.user;
    if (user.ktapBalance < amount) {
      return res.status(400).json({ error: 'Solde KTAP insuffisant.' });
    }
    
    // Créer le pari
    const bet = new Bet({
      user: user._id,
      match: matchId,
      amount,
      betType,
      potentialWinnings: amount * 2 // Double de la mise
    });
    
    // Mettre à jour le solde de l'utilisateur
    user.ktapBalance -= amount;
    
    // Mettre à jour les totaux des paris du match
    match.totalBets[betType] += amount;
    
    // Sauvegarder les modifications
    await Promise.all([
      bet.save(),
      user.save(),
      match.save()
    ]);
    
    res.status(201).json(bet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtenir les paris d'un utilisateur
router.get('/user', auth, async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user._id })
      .populate('match')
      .sort({ placedAt: -1 });
    
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les paris d'un match
router.get('/match/:matchId', async (req, res) => {
  try {
    const bets = await Bet.find({ match: req.params.matchId })
      .populate('user', 'username')
      .sort({ placedAt: -1 });
    
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Régler les paris d'un match
router.post('/settle/:matchId', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    
    if (match.status !== 'finished') {
      return res.status(400).json({ error: 'Le match n\'est pas terminé.' });
    }
    
    const bets = await Bet.find({ 
      match: req.params.matchId,
      status: 'pending'
    });
    
    for (const bet of bets) {
      const user = await User.findById(bet.user);
      
      if (bet.betType === match.winner) {
        // Pari gagné
        bet.status = 'won';
        bet.actualWinnings = bet.potentialWinnings;
        user.ktapBalance += bet.actualWinnings;
      } else {
        // Pari perdu
        bet.status = 'lost';
        bet.actualWinnings = 0;
      }
      
      bet.settledAt = new Date();
      
      await Promise.all([
        bet.save(),
        user.save()
      ]);
    }
    
    res.json({ message: 'Paris réglés avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 