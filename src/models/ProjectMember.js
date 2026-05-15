import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'member'
  },
  permissions: {
    canCreateTask: { type: Boolean, default: true },
    canDeleteTask: { type: Boolean, default: false },
    canAssignTask: { type: Boolean, default: false },
    canRemoveMembers: { type: Boolean, default: false },
    canEditProject: { type: Boolean, default: false },
    canDeleteProject: { type: Boolean, default: false }
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  },
  lastActivityAt: Date,
  tasksAssigned: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Compound index for faster queries
projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });
projectMemberSchema.index({ userId: 1, status: 1 });

export default mongoose.model('ProjectMember', projectMemberSchema);
