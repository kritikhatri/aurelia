import mongoose from 'mongoose';

const referralLogSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  rewardIssued: { type: Boolean, default: false }
}, {
  timestamps: true
});

const ReferralLog = mongoose.model('ReferralLog', referralLogSchema);
export default ReferralLog;
