import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: [
      'login',
      'logout',
      'create_project',
      'update_project',
      'delete_project',
      'create_task',
      'update_task',
      'delete_task',
      'assign_task',
      'add_member',
      'remove_member',
      'change_role',
      'mark_complete',
      'change_status'
    ],
    required: true,
    index: true
  },
  entityType: {
    type: String,
    enum: ['project', 'task', 'user', 'auth'],
    required: true,
    index: true
  },
  entityId: mongoose.Schema.Types.ObjectId,
  description: {
    type: String,
    required: true
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success'
  }
}, { timestamps: true });

// Index for efficient querying
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
