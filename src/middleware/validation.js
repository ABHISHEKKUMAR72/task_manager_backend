/**
 * Input Validation Middleware
 * Provides validation functions for various API endpoints
 */

// Validate task input
export const validateTaskInput = (req, res, next) => {
  const { title, description, priority, status, dueDate, assignedTo } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (title && title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (description && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (description && description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  if (status && !['todo', 'in_progress', 'completed'].includes(status)) {
    errors.push('Status must be one of: todo, in_progress, completed');
  }

  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  if (assignedTo && !isValidObjectId(assignedTo)) {
    errors.push('Assigned to must be a valid user ID');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate project input
export const validateProjectInput = (req, res, next) => {
  const { name, description, startDate, dueDate } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Project name is required and must be a non-empty string');
  }

  if (name && name.length > 100) {
    errors.push('Project name must be less than 100 characters');
  }

  if (description && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (description && description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }

  if (startDate) {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      errors.push('Start date must be a valid date');
    }
  }

  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  if (startDate && dueDate) {
    const start = new Date(startDate);
    const due = new Date(dueDate);
    if (start > due) {
      errors.push('Start date must be before due date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate authentication input
export const validateAuthInput = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const errors = [];

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!isValidEmail(email)) {
    errors.push('Email must be a valid email address');
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 100) {
    errors.push('Password must be less than 100 characters');
  }

  // Name validation (for signup)
  if (req.body.firstName || req.body.lastName) {
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      errors.push('First name is required for signup');
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      errors.push('Last name is required for signup');
    }

    if (firstName && firstName.length > 50) {
      errors.push('First name must be less than 50 characters');
    }

    if (lastName && lastName.length > 50) {
      errors.push('Last name must be less than 50 characters');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate project member input
export const validateMemberInput = (req, res, next) => {
  const { memberId, role } = req.body;
  const errors = [];

  if (!memberId || typeof memberId !== 'string') {
    errors.push('Member ID is required');
  } else if (!isValidObjectId(memberId)) {
    errors.push('Member ID must be a valid user ID');
  }

  if (role && !['admin', 'member'].includes(role)) {
    errors.push('Role must be either "admin" or "member"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validate pagination input
export const validatePaginationInput = (req, res, next) => {
  const { limit = 20, skip = 0 } = req.query;
  const errors = [];

  const limitNum = parseInt(limit);
  const skipNum = parseInt(skip);

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push('Limit must be a number between 1 and 100');
  }

  if (isNaN(skipNum) || skipNum < 0) {
    errors.push('Skip must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.query.limit = limitNum;
  req.query.skip = skipNum;
  next();
};

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidObjectId(id) {
  return /^[0-9a-f]{24}$/.test(id);
}

// Sanitize input to prevent XSS
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/[<>]/g, '');
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};
