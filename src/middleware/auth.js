import { verifyToken } from '../utils/jwt.js';
import { ProjectMember } from '../models/index.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Authorize based on global user role
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

// Authorize based on project-level role
export const authorizeProjectRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;
      
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }

      const projectMember = await ProjectMember.findOne({
        projectId,
        userId: req.user.id
      });

      if (!projectMember) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this project'
        });
      }

      if (!requiredRoles.includes(projectMember.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions for this project'
        });
      }

      req.projectMember = projectMember;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

// Check if user is project admin
export const isProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const projectMember = await ProjectMember.findOne({
      projectId,
      userId: req.user.id,
      role: 'admin'
    });

    if (!projectMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project admins can perform this action'
      });
    }

    req.projectMember = projectMember;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

// Check specific permission
export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const projectMember = await ProjectMember.findOne({
        projectId,
        userId: req.user.id
      });

      if (!projectMember) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this project'
        });
      }

      // Admin has all permissions
      if (projectMember.role === 'admin') {
        req.projectMember = projectMember;
        return next();
      }

      // Check specific permission
      if (!projectMember.permissions[permission]) {
        return res.status(403).json({
          success: false,
          message: `You don't have permission to ${permission}`
        });
      }

      req.projectMember = projectMember;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};
