import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  customProductName: { type: String, default: '' }, // For non-catalog products user adds
  stepNumber: { type: Number, required: true },
  note: { type: String, default: '' } // e.g. "Apply on damp skin"
});

const routineEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routineType: { type: String, enum: ['AM', 'PM'], required: true },
  steps: [stepSchema],
  reminderTime: { type: String, default: '' } // e.g. "08:00 AM"
}, {
  timestamps: true
});

const RoutineEntry = mongoose.model('RoutineEntry', routineEntrySchema);
export default RoutineEntry;
