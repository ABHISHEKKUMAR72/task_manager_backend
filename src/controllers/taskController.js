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
      tasks = await Task.find({ projectId })
        .populate('assignedTo', 'firstName lastName email')
        .populate('collaborators', 'firstName lastName email');
    } else {
      // Regular members see only tasks assigned to them or where they're a collaborator
      tasks = await Task.find({ 
        projectId,
        $or: [
          { assignedTo: req.user.id },
          { collaborators: req.user.id }
        ]
      })
        .populate('assignedTo', 'firstName lastName email')
        .populate('collaborators', 'firstName lastName email');
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
    const oldAssignedTo = task.assignedTo?.toString();
    const oldStatus = task.status;

    // Validate assignedTo if provided in the request
    if (assignedTo !== undefined) {
      if (assignedTo !== null && assignedTo !== '') {
        // Validate new assignment
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }

        // Check if assignedTo user is a project member or project owner
        const isMember = await ProjectMember.findOne({
          projectId: task.projectId,
          userId: assignedTo
        });
        
        if (!isMember && project.ownerId.toString() !== assignedTo && req.user.role !== 'admin') {
          return res.status(400).json({ message: 'Assigned user must be a project member' });
        }

        task.assignedTo = assignedTo;
      } else {
        // Clear assignment if assignedTo is null or empty string
        task.assignedTo = null;
      }
    }

    // Update task fields
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    
    await task.save();

    // Send notifications
    // 1. If assignment changed
    const newAssignedTo = task.assignedTo?.toString();
    if (newAssignedTo && newAssignedTo !== oldAssignedTo && newAssignedTo !== req.user.id) {
      await notificationService.notifyTaskAssigned(
        task._id,
        task.title,
        newAssignedTo,
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

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('assignedTo', 'firstName lastName email')
      .populate('collaborators', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .populate('comments.userId', 'firstName lastName email');

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

    res.json({
      message: 'Task retrieved',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task' });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { collaboratorId } = req.body;

    if (!collaboratorId) {
      return res.status(400).json({ message: 'Collaborator ID is required' });
    }

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

    // Validate collaborator exists
    const collaborator = await User.findById(collaboratorId);
    if (!collaborator) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if user is project member
    const isMember = await ProjectMember.findOne({
      projectId: task.projectId,
      userId: collaboratorId
    });
    
    if (!isMember && project.ownerId.toString() !== collaboratorId && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Collaborator must be a project member' });
    }

    // Check if already a collaborator
    if (task.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    // Add collaborator
    task.collaborators.push(collaboratorId);
    await task.save();

    // Send notification
    if (collaboratorId !== req.user.id) {
      await notificationService.notifyTaskAssigned(
        task._id,
        task.title,
        collaboratorId,
        req.user.id,
        project.name
      );
    }

    res.json({
      message: 'Collaborator added successfully',
      task: await task.populate(['assignedTo', 'collaborators', 'createdBy'], 'firstName lastName email'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding collaborator', error: error.message });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { collaboratorId } = req.body;

    if (!collaboratorId) {
      return res.status(400).json({ message: 'Collaborator ID is required' });
    }

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

    // Remove collaborator
    task.collaborators = task.collaborators.filter(id => id.toString() !== collaboratorId);
    await task.save();

    res.json({
      message: 'Collaborator removed successfully',
      task: await task.populate(['assignedTo', 'collaborators', 'createdBy'], 'firstName lastName email'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing collaborator', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

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

    // Add comment
    task.comments.push({
      userId: req.user.id,
      text: text.trim(),
      createdAt: new Date()
    });

    await task.save();

    const updatedTask = await task.populate('comments.userId', 'firstName lastName email');

    res.json({
      message: 'Comment added successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};
