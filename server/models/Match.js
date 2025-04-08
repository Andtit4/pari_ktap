import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  teamA: {
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  },
  teamB: {
    name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  },
  odds: {
    teamA: {
      type: Number,
      default: 2.0
    },
    draw: {
      type: Number,
      default: 3.0
    },
    teamB: {
      type: Number,
      default: 2.0
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished', 'cancelled'],
    default: 'scheduled'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 300 // 5 minutes in seconds
  },
  totalBets: {
    teamA: {
      type: Number,
      default: 0
    },
    teamB: {
      type: Number,
      default: 0
    },
    draw: {
      type: Number,
      default: 0
    }
  },
  winner: {
    type: String,
    enum: ['teamA', 'teamB', 'draw', null],
    default: null
  },
  isPlanned: {
    type: Boolean,
    default: false
  },
  plannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les requêtes fréquentes
matchSchema.index({ status: 1, startTime: 1 });
matchSchema.index({ isPlanned: 1, startTime: 1 });

const Match = mongoose.model('Match', matchSchema);

export default Match; 