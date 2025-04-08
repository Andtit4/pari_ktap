import mongoose from 'mongoose';

const pendingDepositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['paypal', 'bank', 'credit_card', 'crypto']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
pendingDepositSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PendingDeposit = mongoose.model('PendingDeposit', pendingDepositSchema);

export default PendingDeposit; 