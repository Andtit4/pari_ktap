import express from 'express';
import Match from '../models/Match.js';
import { auth } from './auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Obtenir tous les matchs
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .sort({ startTime: -1 })
      .limit(20);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les matchs en direct
router.get('/live', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'live' })
      .sort({ startTime: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir un match spécifique
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau match planifié
router.post('/', auth, async (req, res) => {
  try {
    const { teamA, teamB, startTime } = req.body;
    
    const match = new Match({
      teamA: { name: teamA },
      teamB: { name: teamB },
      startTime: new Date(startTime),
      isPlanned: true,
      plannedBy: req.user._id
    });
    
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mettre à jour le score d'un match
router.patch('/:id/score', auth, async (req, res) => {
  try {
    const { teamAScore, teamBScore } = req.body;
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    
    match.teamA.score = teamAScore;
    match.teamB.score = teamBScore;
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mettre à jour le statut d'un match
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, winner } = req.body;
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    
    match.status = status;
    if (winner) {
      match.winner = winner;
      match.endTime = new Date();
    }
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtenir les matchs planifiés par un utilisateur
router.get('/user/planned', auth, async (req, res) => {
  try {
    const matches = await Match.find({
      plannedBy: req.user._id,
      isPlanned: true
    }).sort({ startTime: -1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes d'administration
router.use('/admin', auth, admin);

// Obtenir tous les matchs (admin)
router.get('/admin/matches', async (req, res) => {
  try {
    const matches = await Match.find()
      .sort({ startTime: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau match (admin)
router.post('/admin/matches', async (req, res) => {
  try {
    const { teamA, teamB, startTime, odds } = req.body;
    
    const match = new Match({
      teamA: { name: teamA },
      teamB: { name: teamB },
      startTime: new Date(startTime),
      odds: odds || {
        teamA: 2.0,
        draw: 3.0,
        teamB: 2.0
      },
      isPlanned: true,
      plannedBy: req.user._id
    });
    
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mettre à jour un match (admin)
router.put('/admin/matches/:id', async (req, res) => {
  try {
    const { teamA, teamB, startTime, odds, status } = req.body;
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    
    if (teamA) match.teamA.name = teamA;
    if (teamB) match.teamB.name = teamB;
    if (startTime) match.startTime = new Date(startTime);
    if (odds) match.odds = odds;
    if (status) match.status = status;
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer un match (admin)
router.delete('/admin/matches/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé.' });
    }
    
    await match.remove();
    res.json({ message: 'Match supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 