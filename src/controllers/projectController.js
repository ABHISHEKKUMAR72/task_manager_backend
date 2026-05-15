import { Project, ProjectMember, Task, User } from '../models/index.js';
import { notificationService } from '../services/notificationService.js';

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
    const memberships = await ProjectMember.find({ userId: req.user.id });
    const projectIds = memberships.map(m => m.projectId);

    const projects = await Project.find({
      $or: [
        { ownerId: req.user.id },
        { _id: { $in: projectIds } }
      ]
    });

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

    // Validation
    if (!userId && !email) {
      return res.status(400).json({ message: 'Either userId or email is required' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization - only project owner or admin can add members
    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only project owners can add members' });
    }

    // Find user by email or userId
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (userId) {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cannot add owner as member again
    if (project.ownerId.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Project owner is already a member' });
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
      projectId, 
      userId: user._id
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    const member = await ProjectMember.create({
      projectId,
      userId: user._id,
      role: role || 'member',
    });

    // Send notification to added member
    await notificationService.notifyMemberAdded(
      user._id,
      user.firstName + ' ' + user.lastName,
      projectId,
      project.name,
      req.user.id
    );

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

    // Validation
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization - only project owner or admin can remove members
    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only project owners can remove members' });
    }

    // Cannot remove owner
    if (project.ownerId.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    // Check if member exists
    const member = await ProjectMember.findOne({
      projectId, 
      userId
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found in this project' });
    }

    await ProjectMember.findOneAndDelete({
      projectId, 
      userId
    });

    // Send notification to removed member
    await notificationService.notifyMemberRemoved(
      userId,
      projectId,
      project.name,
      req.user.id
    );

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing member' });
  }
};
