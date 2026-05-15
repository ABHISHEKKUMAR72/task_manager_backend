import { Notification } from '../models/index.js';

/**
 * Notification Service
 * Handles creating and managing notifications throughout the app
 */

export const notificationService = {
  // Task Assignment Notification
  async notifyTaskAssigned(taskId, taskTitle, assignedToUserId, assignedByUserId, projectName) {
    try {
      const notification = await Notification.create({
        recipientId: assignedToUserId,
        senderId: assignedByUserId,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `You have been assigned a new task: "${taskTitle}" in project "${projectName}"`,
        relatedEntity: {
          type: 'task',
          id: taskId
        },
        actionUrl: `/tasks/${taskId}`,
        priority: 'high'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying task assignment:', error);
      return null;
    }
  },

  // Task Status Changed Notification
  async notifyTaskStatusChanged(taskId, taskTitle, newStatus, changedByUserId, projectId, assignedToUserId) {
    try {
      const notification = await Notification.create({
        recipientId: assignedToUserId,
        senderId: changedByUserId,
        type: 'task_updated',
        title: 'Task Status Updated',
        message: `Task "${taskTitle}" status has been changed to "${newStatus}"`,
        relatedEntity: {
          type: 'task',
          id: taskId
        },
        actionUrl: `/tasks/${taskId}`,
        priority: 'normal'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying task status change:', error);
      return null;
    }
  },

  // Task Completed Notification
  async notifyTaskCompleted(taskId, taskTitle, completedByUserId, projectMembers, projectName) {
    try {
      // Notify all project members
      const notifications = projectMembers
        .filter(memberId => memberId.toString() !== completedByUserId.toString())
        .map(memberId => ({
          recipientId: memberId,
          senderId: completedByUserId,
          type: 'task_completed',
          title: 'Task Completed',
          message: `Task "${taskTitle}" in project "${projectName}" has been marked as completed`,
          relatedEntity: {
            type: 'task',
            id: taskId
          },
          actionUrl: `/tasks/${taskId}`,
          priority: 'normal'
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
      return notifications;
    } catch (error) {
      console.error('Error notifying task completion:', error);
      return [];
    }
  },

  // Member Added to Project Notification
  async notifyMemberAdded(memberId, memberName, projectId, projectName, addedByUserId) {
    try {
      const notification = await Notification.create({
        recipientId: memberId,
        senderId: addedByUserId,
        type: 'member_added',
        title: 'Added to Project',
        message: `You have been added to project "${projectName}"`,
        relatedEntity: {
          type: 'project',
          id: projectId
        },
        actionUrl: `/projects/${projectId}`,
        priority: 'high'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying member addition:', error);
      return null;
    }
  },

  // Member Removed from Project Notification
  async notifyMemberRemoved(memberId, projectId, projectName, removedByUserId) {
    try {
      const notification = await Notification.create({
        recipientId: memberId,
        senderId: removedByUserId,
        type: 'member_removed',
        title: 'Removed from Project',
        message: `You have been removed from project "${projectName}"`,
        relatedEntity: {
          type: 'project',
          id: projectId
        },
        priority: 'normal'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying member removal:', error);
      return null;
    }
  },

  // Project Created Notification
  async notifyProjectCreated(projectId, projectName, createdByUserId, projectMembers) {
    try {
      // Notify all members except creator
      const notifications = projectMembers
        .filter(memberId => memberId.toString() !== createdByUserId.toString())
        .map(memberId => ({
          recipientId: memberId,
          senderId: createdByUserId,
          type: 'project_created',
          title: 'New Project Created',
          message: `A new project "${projectName}" has been created`,
          relatedEntity: {
            type: 'project',
            id: projectId
          },
          actionUrl: `/projects/${projectId}`,
          priority: 'normal'
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
      return notifications;
    } catch (error) {
      console.error('Error notifying project creation:', error);
      return [];
    }
  },

  // Project Updated Notification
  async notifyProjectUpdated(projectId, projectName, updatedByUserId, projectMembers, changes) {
    try {
      const notifications = projectMembers
        .filter(memberId => memberId.toString() !== updatedByUserId.toString())
        .map(memberId => ({
          recipientId: memberId,
          senderId: updatedByUserId,
          type: 'project_updated',
          title: 'Project Updated',
          message: `Project "${projectName}" has been updated`,
          relatedEntity: {
            type: 'project',
            id: projectId
          },
          actionUrl: `/projects/${projectId}`,
          priority: 'normal'
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
      return notifications;
    } catch (error) {
      console.error('Error notifying project update:', error);
      return [];
    }
  },

  // Deadline Approaching Notification
  async notifyDeadlineApproaching(taskId, taskTitle, assignedToUserId, daysLeft, projectName) {
    try {
      const notification = await Notification.create({
        recipientId: assignedToUserId,
        senderId: null,
        type: 'deadline_approaching',
        title: 'Deadline Approaching',
        message: `Task "${taskTitle}" in project "${projectName}" is due in ${daysLeft} days`,
        relatedEntity: {
          type: 'task',
          id: taskId
        },
        actionUrl: `/tasks/${taskId}`,
        priority: 'high'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying deadline approaching:', error);
      return null;
    }
  },

  // Task Overdue Notification
  async notifyTaskOverdue(taskId, taskTitle, assignedToUserId, daysOverdue, projectName) {
    try {
      const notification = await Notification.create({
        recipientId: assignedToUserId,
        senderId: null,
        type: 'task_overdue',
        title: 'Task Overdue',
        message: `Task "${taskTitle}" in project "${projectName}" is ${daysOverdue} days overdue`,
        relatedEntity: {
          type: 'task',
          id: taskId
        },
        actionUrl: `/tasks/${taskId}`,
        priority: 'high'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying task overdue:', error);
      return null;
    }
  },

  // Role Changed Notification
  async notifyRoleChanged(memberId, memberName, projectId, projectName, newRole, changedByUserId) {
    try {
      const notification = await Notification.create({
        recipientId: memberId,
        senderId: changedByUserId,
        type: 'member_added', // Using member_added as a generic role change
        title: 'Role Updated',
        message: `Your role in project "${projectName}" has been changed to "${newRole}"`,
        relatedEntity: {
          type: 'project',
          id: projectId
        },
        actionUrl: `/projects/${projectId}`,
        priority: 'normal'
      });
      return notification;
    } catch (error) {
      console.error('Error notifying role change:', error);
      return null;
    }
  },

  // Bulk notification to users
  async notifyMultipleUsers(userIds, notificationData) {
    try {
      const notifications = userIds.map(userId => ({
        ...notificationData,
        recipientId: userId
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
      return notifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      return [];
    }
  }
};

export default notificationService;
