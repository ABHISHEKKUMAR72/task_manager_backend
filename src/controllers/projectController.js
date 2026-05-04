import { Project, ProjectMember, Task, User } from '../models/index.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, dueDate } = req.body;

    const project = await Project.create({
      name,
      description,
      ownerId: req.user.id,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    // Add owner as project member with admin role
    await ProjectMember.create({
      projectId: project._id,
      userId: req.user.id,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id });

    res.json({
      message: 'Projects retrieved',
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access
    const hasAccess = project.ownerId.toString() === req.user.id ||
      await ProjectMember.findOne({ projectId, userId: req.user.id }) ||
      req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch members with user info
    const memberships = await ProjectMember.find({ projectId }).populate('userId', 'firstName lastName email');
    const members = memberships.map(m => ({
      _id: m.userId?._id,
      firstName: m.userId?.firstName,
      lastName: m.userId?.lastName,
      email: m.userId?.email,
      role: m.role,
    }));

    res.json({
      message: 'Project retrieved',
      project: { ...project.toObject(), members },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, status, dueDate } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.dueDate = dueDate ? new Date(dueDate) : project.dueDate;

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete related tasks
    await Task.deleteMany({ projectId });

    // Delete project members
    await ProjectMember.deleteMany({ projectId });

    // Delete project
    await Project.findByIdAndDelete(projectId);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, email, role } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user exists by email or userId
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (userId) {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found with that email' });
    }

    const targetUserId = user._id;

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
      projectId, userId: targetUserId
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    const member = await ProjectMember.create({
      projectId,
      userId: targetUserId,
      role: role || 'member',
    });

    res.status(201).json({
      message: 'Member added successfully',
      member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Cannot remove owner
    if (project.ownerId.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    await ProjectMember.findOneAndDelete({
      projectId, userId
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing member' });
  }
};
