import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  betType: {
    type: String,
    enum: ['teamA', 'teamB', 'draw'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost'],
    default: 'pending'
  },
  potentialWinnings: {
    type: Number,
    required: true
  },
  actualWinnings: {
    type: Number,
    default: 0
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  settledAt: {
    type: Date
  }
});

// Index pour les requêtes fréquentes
betSchema.index({ user: 1, status: 1 });
betSchema.index({ match: 1, status: 1 });
betSchema.index({ placedAt: 1 });

const Bet = mongoose.model('Bet', betSchema);

export default Bet; 