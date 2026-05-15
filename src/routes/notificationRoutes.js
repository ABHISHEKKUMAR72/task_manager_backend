import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getActivityLogs,
  getUserActivityLogs
} from '../controllers/notificationController.js';

const router = express.Router();

// Notification routes (protected)
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:notificationId/read', authenticate, markAsRead);
router.put('/notifications/mark-all-read', authenticate, markAllAsRead);
router.delete('/notifications/:notificationId', authenticate, deleteNotification);

// Activity logs routes
router.get('/activity-logs', authenticate, authorize(['admin']), getActivityLogs);
router.get('/my-activity-logs', authenticate, getUserActivityLogs);

export default router;
