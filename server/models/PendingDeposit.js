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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  proofOfPayment: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
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
 
 