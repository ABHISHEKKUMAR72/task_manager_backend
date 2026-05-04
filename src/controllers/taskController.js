import { Task, Project, ProjectMember } from '../models/index.js';

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;

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
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

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

    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({
        projectId, userId: req.user.id
      }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({
      projectId,
    });

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

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    
    await task.save();

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

    if (req.user.role === 'admin') {
      // Find projects owned by admin
      const projects = await Project.find({ ownerId: userId });
      const projectIds = projects.map(p => p._id);
      
      // Get all tasks for these projects
      tasks = await Task.find({ projectId: { $in: projectIds } });
    } else {
      // Get all tasks assigned to user
      tasks = await Task.find({ assignedTo: userId });
    }

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
