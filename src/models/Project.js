import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  startDate: { type: Date },
  dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
