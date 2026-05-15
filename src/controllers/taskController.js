import { Task, Project, ProjectMember, User } from '../models/index.js';
import { notificationService } from '../services/notificationService.js';

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;

    // Validate input
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    // Check if project exists and user has access
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    // Validate assignedTo user if provided
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }

      // Check if assignedTo user is a project member
      const isMember = await ProjectMember.findOne({
        projectId,
        userId: assignedTo
      });
      
      if (!isMember && project.ownerId.toString() !== assignedTo && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      projectId,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    // Send notification if task is assigned
    if (assignedTo && assignedTo !== req.user.id) {
      await notificationService.notifyTaskAssigned(
        task._id,
        task.title,
        assignedTo,
        req.user.id,
        project.name
      );
    }

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is project owner
    const isOwner = project.ownerId.toString() === req.user.id;
    
    // Check if user is project member and get their role
    const membership = await ProjectMember.findOne({
      projectId, userId: req.user.id
    });
    
    const isProjectAdmin = membership?.role === 'admin';
    const hasAccess = isOwner || membership || req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Filter tasks based on role
    let tasks;
    if (isOwner || isProjectAdmin || req.user.role === 'admin') {
      // Project admin/owner can see all tasks
      tasks = await Task.find({ projectId });
    } else {
      // Regular members see only tasks assigned to them
      tasks = await Task.find({ 
        projectId,
        assignedTo: req.user.id 
      });
    }

    res.json({
      message: 'Tasks retrieved',
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.projectId);

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId: task.projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Track old values for notifications
    const oldAssignedTo = task.assignedTo;
    const oldStatus = task.status;

    // Validate assignedTo if changing
    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }

      // Check if assignedTo user is a project member
      const isMember = await ProjectMember.findOne({
        projectId: task.projectId,
        userId: assignedTo
      });
      
      if (!isMember && project.ownerId.toString() !== assignedTo && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'Assigned user must be a project member' });
      }
    }

    // Update task fields
    task.title = title?.trim() || task.title;
    task.description = description?.trim() || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    
    await task.save();

    // Send notifications
    // 1. If assignment changed
    if (assignedTo && assignedTo !== oldAssignedTo?.toString() && assignedTo !== req.user.id) {
      await notificationService.notifyTaskAssigned(
        task._id,
        task.title,
        assignedTo,
        req.user.id,
        project.name
      );
    }

    // 2. If status changed and task is assigned to someone
    if (status && status !== oldStatus && task.assignedTo && task.assignedTo.toString() !== req.user.id) {
      await notificationService.notifyTaskStatusChanged(
        task._id,
        task.title,
        status,
        req.user.id,
        task.projectId,
        task.assignedTo
      );
    }

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(task.projectId);

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId: task.projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    let tasks = [];

    // For all users (including admins), show only tasks assigned to them
    // This ensures consistency and clarity in the dashboard
    tasks = await Task.find({ assignedTo: userId });

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(
        t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length,
    };

    res.json({
      message: 'Task statistics retrieved',
      stats,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task stats' });
  }
};
