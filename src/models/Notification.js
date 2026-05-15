import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_completed',
      'task_updated',
      'member_added',
      'member_removed',
      'project_created',
      'project_updated',
      'deadline_approaching',
      'task_overdue',
      'comment_added'
    ],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['task', 'project', 'user']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  actionUrl: String,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  }
}, { timestamps: true });

// Index for efficient querying
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
