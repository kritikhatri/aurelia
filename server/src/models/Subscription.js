import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boxTier: { type: String, enum: ['Essential', 'Signature', 'Prestige'], default: 'Signature' },
  frequency: { type: String, enum: ['monthly', 'quarterly'], default: 'monthly' },
  selectedPreferences: [{ type: String }], // e.g. "Skincare focus", "Lipstick shades"
  nextRenewalDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' }
}, {
  timestamps: true
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
