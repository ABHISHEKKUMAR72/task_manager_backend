import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const { isRead, limit = 20, skip = 0 } = req.query;
    const query = { recipientId: req.user.id };

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('senderId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipientId: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        unreadCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'read_notification',
      entityType: 'notification',
      entityId: notificationId,
      description: `Marked notification as read`,
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error: error.message
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Internal function to create notifications
export const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Create notification for multiple users
export const createBulkNotifications = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map(userId => ({
      ...notificationData,
      recipientId: userId
    }));

    const created = await Notification.insertMany(notifications);
    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return [];
  }
};

// Get activity logs for admin
export const getActivityLogs = async (req, res) => {
  try {
    // Only admin can view activity logs
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view activity logs'
      });
    }

    const { userId, action, entityType, limit = 50, skip = 0 } = req.query;
    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;

    const logs = await ActivityLog.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: error.message
    });
  }
};

// Get user activity logs
export const getUserActivityLogs = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const logs = await ActivityLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await ActivityLog.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: error.message
    });
  }
};

// Internal function to log activity
export const logActivity = async (data) => {
  try {
    const log = await ActivityLog.create(data);
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};
