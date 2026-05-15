# 🎯 Team Task Manager - Backend API

[![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()

A powerful and scalable REST API for team task management with complete authentication, project management, task assignment, role-based access control, notifications, and activity logging. Built with Express.js and MongoDB.

> **Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** May 16, 2026

## 🚀 Quick Links

- 📖 [Documentation](#-api-documentation)
- ⚙️ [Setup Guide](#-quick-start)
- 🔐 [Security](#-security-features)
- 🗂️ [Project Structure](#-project-structure)
- 🧪 [Testing](#-testing)
- 🚀 [Deployment](#-deployment)

## ✨ Key Features

- **🔐 Authentication & Security**
  - JWT-based authentication with secure token handling
  - Password hashing using bcryptjs (10+ rounds)
  - Protected routes with middleware validation
  - Role selection at signup (admin/member)
  - User profile management

- **👥 Role-Based Access Control**
  - Global roles: Admin (full system access) / Member (limited access)
  - Project-level roles: Admin (owner) / Member / Editor / Viewer
  - Granular permissions per project
  - Protected routes with role validation
  - Comprehensive authorization checks

- **📊 Project Management**
  - Create, read, update, and delete projects
  - Team collaboration with project members
  - Add/remove members by email
  - Member role assignment and permissions
  - Automatic owner membership
  - Project status tracking

- **✅ Task Management**
  - Full CRUD operations for tasks
  - Task assignment ONLY to project members
  - Task status tracking (Todo/In Progress/Completed)
  - Priority levels (Low/Medium/High)
  - Deadline and due date management
  - Task filtering and sorting
  - Validation to prevent invalid assignments
  - Task descriptions and detailed notes

- **👥 Team Collaboration**
  - Add and remove project members
  - Member status tracking (Active/Pending/Inactive)
  - Task assignment counters per member
  - Member performance tracking
  - Activity feeds
  - Task statistics per member

- **📬 Notification System**
  - Real-time in-app notifications
  - Multiple notification types:
    - Task assigned notifications
    - Task status change notifications
    - Member added/removed notifications
    - Deadline approaching notifications
    - Task overdue alerts
  - Notification priority levels (Low/Normal/High)
  - Read/unread status tracking
  - Full notification history

- **📊 Activity Logging & Audit Trail**
  - Comprehensive audit logging of all actions
  - User, action, entity, and timestamp tracking
  - Before/after state changes recorded
  - Admin-only access to activity logs
  - Filtering by action type and status
  - Compliance-ready audit trail
  - IP address and user agent logging

- **📈 Dashboard & Analytics**
  - Task statistics and overview
  - Overdue task tracking
  - Project insights and metrics
  - User activity summary
  - Task completion rates
  - Team performance metrics

## 🏗️ Technology Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Security:** bcryptjs 2.4.3
- **Validation:** express-validator 7.0.0
- **CORS:** cors 2.8.5
- **Environment:** dotenv 16.3.1
- **Dev Tools:** nodemon 3.0.1

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available at [mongodb.com](https://www.mongodb.com/cloud/atlas))
- A code editor (VS Code recommended)
- Git for version control

## 🚀 Quick Start

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ABHISHEKKUMAR72/task_manager_backend.git
cd task_manager_backend
```

### 2. Install Dependencies

```bash
npm install
```

Or with yarn:
```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/task_manager?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Additional Security
BCRYPT_ROUNDS=10
```

**⚠️ Security Tip:** Change `JWT_SECRET` to a strong, random string in production!

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

Expected output:
```
Server running on port 5000
Connected to MongoDB successfully
```

### 5. Verify Installation

Test the health check endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-14T10:00:00Z"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer your_jwt_token_here
```

### 🔐 Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer your_token
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2026-05-10T08:30:00Z"
  }
}
```

### 📊 Role-Based Features

#### Admin Capabilities
```
✅ Create and manage projects
✅ Add/remove project members
✅ Assign tasks to any project member
✅ View all project tasks
✅ Update member roles and permissions
✅ Delete projects
✅ Access activity logs
✅ View comprehensive analytics
✅ Manage team settings
```

#### Member Capabilities
```
✅ View assigned tasks
✅ Update own task status
✅ View project information
✅ See team members
✅ Receive notifications
✅ View own activity
```

**Request Example - Signup with Role:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "securepassword123",
  "role": "admin"
}
```

**Supported Roles:**
- `admin`: Full system access
- `member`: Limited access (assigned tasks only)

### 📂 Project Endpoints

#### Create Project
```http
POST /projects
Authorization: Bearer your_token
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "dueDate": "2026-06-30"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "admin": "64f5a1b2c3d4e5f6g7h8i9j0",
    "members": ["64f5a1b2c3d4e5f6g7h8i9j0"],
    "createdAt": "2026-05-14T10:00:00Z"
  }
}
```

#### Get All Projects
```http
GET /projects
Authorization: Bearer your_token
```

**Response (200):**
```json
{
  "success": true,
  "projects": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "admin": {...},
      "members": [...],
      "createdAt": "2026-05-14T10:00:00Z"
    }
  ]
}
```

#### Get Project Details
```http
GET /projects/:projectId
Authorization: Bearer your_token
```

#### Update Project
```http
PUT /projects/:projectId
Authorization: Bearer your_token
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /projects/:projectId
Authorization: Bearer your_token
```

### 👥 Project Members Endpoints

#### Add Member to Project
```http
POST /projects/:projectId/members
Authorization: Bearer your_token
Content-Type: application/json

{
  "memberId": "64f5a1b2c3d4e5f6g7h8i9j0"
}
```

#### Remove Member from Project
```http
DELETE /projects/:projectId/members/:memberId
Authorization: Bearer your_token
```

### ✅ Task Endpoints

#### Create Task (with Assignment Validation)
```http
POST /projects/:projectId/tasks
Authorization: Bearer your_token
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create mockups and designs for the homepage",
  "status": "todo",
  "priority": "high",
  "assignedTo": "64f5a1b2c3d4e5f6g7h8i9j0",
  "dueDate": "2026-05-20"
}
```

**Validation Rules:**
- ✅ `title` is required (non-empty string)
- ✅ `assignedTo` must be a valid project member ObjectId
- ✅ `assignedTo` user must exist in database
- ✅ `assignedTo` user must be member of the project
- ✅ Status must be one of: "todo", "in_progress", "completed"
- ✅ Priority must be one of: "low", "medium", "high"

**Error Examples:**
```json
// Invalid: User not found
{
  "success": false,
  "message": "Assigned user not found"
}

// Invalid: User not a project member
{
  "success": false,
  "message": "Assigned user must be a project member"
}

// Invalid: Empty title
{
  "success": false,
  "message": "Task title is required"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "title": "Design homepage",
    "description": "Create mockups and designs for the homepage",
    "status": "todo",
    "priority": "high",
    "projectId": "64f5a1b2c3d4e5f6g7h8i9j0",
    "assignedTo": "64f5a1b2c3d4e5f6g7h8i9j0",
    "createdBy": "64f5a1b2c3d4e5f6g7h8i9j0",
    "dueDate": "2026-05-20",
    "createdAt": "2026-05-14T10:00:00Z"
  }
}
```

**Notifications Sent:**
- When task is assigned to member, notification sent to assignee
- When existing task reassigned, notification sent to new assignee
- When status changes, notification sent to assigned member

#### Get Project Tasks
```http
GET /projects/:projectId/tasks
Authorization: Bearer your_token
```

**Response Varies by Role:**
- **Admin/Owner:** All project tasks
- **Member:** Only assigned tasks

#### Update Task (with Assignment Changes)
```http
PUT /projects/tasks/:taskId
Authorization: Bearer your_token
Content-Type: application/json

{
  "title": "Updated task title",
  "assignedTo": "64f5a1b2c3d4e5f6g7h8i9j0",
  "status": "in-progress",
  "priority": "medium"
}
```

**Validations on Update:**
- ✅ New `assignedTo` validated against project members
- ✅ Status change triggers notification to assigned member
- ✅ Assignment change triggers notification to new assignee
- ✅ User must have permission to update task

#### Delete Task
```http
DELETE /projects/tasks/:taskId
Authorization: Bearer your_token
```

#### Get Dashboard Stats
```http
GET /projects/stats/overview
Authorization: Bearer your_token
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalProjects": 5,
    "totalTasks": 23,
    "completedTasks": 15,
    "pendingTasks": 8,
    "overdueTasks": 2,
    "projectsBreakdown": [...],
    "tasksByStatus": {
      "todo": 5,
      "in_progress": 8,
      "completed": 10
    },
    "tasksByPriority": {
      "low": 3,
      "medium": 12,
      "high": 8
    }
  }
}
```

### 📬 Notification Endpoints

#### Get All Notifications
```http
GET /notifications
Authorization: Bearer your_token
```

**Response (200):**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "type": "task_assigned",
      "title": "Task Assigned",
      "message": "You have been assigned: Design homepage in Website Redesign",
      "isRead": false,
      "priority": "high",
      "createdAt": "2026-05-14T10:00:00Z"
    }
  ]
}
```

#### Mark Notification as Read
```http
PUT /notifications/:notificationId/read
Authorization: Bearer your_token
```

### 📊 Activity Logs Endpoints

#### Get Activity Logs (Admin Only)
```http
GET /activity-logs
Authorization: Bearer your_token
```

**Query Parameters:**
- `action` - Filter by action type
- `entityType` - Filter by entity type
- `status` - Filter by status (success/failure/pending)
- `limit` - Number of records
- `page` - Page number

**Response (200):**
```json
{
  "success": true,
  "logs": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "userId": "64f5a1b2c3d4e5f6g7h8i9j0",
      "action": "create_task",
      "entityType": "task",
      "entityId": "64f5a1b2c3d4e5f6g7h8i9j0",
      "description": "Created task: Design homepage",
      "changes": {
        "title": "Design homepage",
        "status": "todo"
      },
      "status": "success",
      "timestamp": "2026-05-14T10:00:00Z"
    }
  ]
}
```

**Logged Actions:**
- `create_task`, `update_task`, `delete_task`
- `create_project`, `update_project`, `delete_project`
- `add_member`, `remove_member`, `update_member`
- `login`, `signup`, `logout`
- `task_status_change`, `task_assignment_change`

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Entry point
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── projectController.js # Project CRUD operations
│   │   └── taskController.js    # Task CRUD operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── index.js             # Model exports
│   │   ├── User.js              # User schema
│   │   ├── Project.js           # Project schema
│   │   ├── ProjectMember.js     # Project membership schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── projectRoutes.js     # Project routes
│   │   └── taskRoutes.js        # Task routes
│   └── utils/
│       ├── hash.js              # Password hashing utilities
│       └── jwt.js               # JWT token utilities
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔧 Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Build project
npm run build
```

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Industry-standard bcryptjs encryption
- **CORS Protection:** Configured cross-origin resource sharing
- **Input Validation:** Express-validator for data validation
- **Environment Variables:** Sensitive data protection with dotenv
- **Role-Based Access Control:** Admin and member role enforcement

## 🐛 Error Handling

The API returns standard HTTP status codes:

- **200 OK:** Successful request
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

Example error response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 📚 Database Schema

### User Schema
```javascript
{
  _id: ObjectId (Primary Key),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, indexed),
  password: String (required, hashed with bcryptjs),
  role: String (enum: "admin", "member", default: "member"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

**Indexes:** `email` (unique)

### Project Schema
```javascript
{
  _id: ObjectId (Primary Key),
  name: String (required),
  description: String (optional),
  ownerId: ObjectId (Reference to User, required),
  status: String (enum: "active", "completed", "archived", default: "active"),
  dueDate: Date (optional),
  startDate: Date (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

**Indexes:** `ownerId`

**Relationships:**
- One-to-Many with ProjectMember
- One-to-Many with Task
- One-to-One with User (owner)

### ProjectMember Schema
```javascript
{
  _id: ObjectId (Primary Key),
  projectId: ObjectId (Reference to Project, required, indexed),
  userId: ObjectId (Reference to User, required, indexed),
  role: String (enum: "admin", "member", "editor", "viewer", default: "member"),
  permissions: {
    canCreateTask: Boolean (default: true),
    canAssignTask: Boolean (default: true),
    canEditTask: Boolean (default: true),
    canDeleteTask: Boolean (default: false),
    canManageMembers: Boolean (default: false)
  },
  status: String (enum: "active", "pending", "inactive", default: "active"),
  tasksAssigned: Number (default: 0),
  tasksCompleted: Number (default: 0),
  joinedAt: Date (auto-generated),
  invitedBy: ObjectId (Reference to User who added them),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

**Indexes:** `projectId`, `userId`, `projectId + userId` (compound, unique)

**Relationships:**
- Many-to-One with Project
- Many-to-One with User
- Many-to-One with User (invitedBy)

### Task Schema
```javascript
{
  _id: ObjectId (Primary Key),
  title: String (required, non-empty),
  description: String (optional),
  projectId: ObjectId (Reference to Project, required, indexed),
  createdBy: ObjectId (Reference to User, required),
  assignedTo: ObjectId (Reference to User, optional, validated against ProjectMember),
  status: String (enum: "todo", "in_progress", "completed", default: "todo"),
  priority: String (enum: "low", "medium", "high", default: "medium"),
  dueDate: Date (optional),
  completedAt: Date (optional, set when status = "completed"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

**Indexes:** `projectId`, `assignedTo`, `createdBy`, `status`

**Validation Rules:**
- `assignedTo` must exist in User collection
- `assignedTo` must be member of the project (checked against ProjectMember)
- `assignedTo` cannot be null/undefined for assignment
- `title` cannot be empty string

**Relationships:**
- Many-to-One with Project
- Many-to-One with User (assignedTo)
- Many-to-One with User (createdBy)

### Notification Schema
```javascript
{
  _id: ObjectId (Primary Key),
  recipientId: ObjectId (Reference to User, indexed),
  senderId: ObjectId (Reference to User, optional),
  type: String (enum: "task_assigned", "task_updated", "member_added", 
                "member_removed", "project_created", "status_changed",
                "deadline_approaching", "task_overdue"),
  title: String (required),
  message: String (required),
  isRead: Boolean (default: false),
  priority: String (enum: "low", "normal", "high", default: "normal"),
  relatedEntity: {
    type: String (enum: "task", "project", "member"),
    id: ObjectId
  },
  actionUrl: String (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

**Indexes:** `recipientId`, `isRead`, `createdAt`

**Relationships:**
- Many-to-One with User (recipientId)
- Many-to-One with User (senderId)

### ActivityLog Schema
```javascript
{
  _id: ObjectId (Primary Key),
  userId: ObjectId (Reference to User, indexed),
  action: String (enum: "create_task", "update_task", "delete_task",
                  "create_project", "update_project", "delete_project",
                  "add_member", "remove_member", "login", "signup",
                  "task_status_change", "task_assignment_change"),
  entityType: String (enum: "task", "project", "user", "member"),
  entityId: ObjectId (Reference to entity),
  description: String,
  changes: Object {
    before: Object (old values),
    after: Object (new values)
  },
  ipAddress: String (optional),
  userAgent: String (optional),
  status: String (enum: "success", "failure", "pending", default: "success"),
  errorMessage: String (optional, if status = "failure"),
  timestamp: Date (auto-generated)
}
```

**Indexes:** `userId`, `action`, `entityType`, `timestamp`

**Relationships:**
- Many-to-One with User

## 📊 Database Relationships Diagram

```
User
  ├── Project (ownerId)
  ├── ProjectMember (userId)
  ├── Task (createdBy, assignedTo)
  ├── Notification (recipientId, senderId)
  └── ActivityLog (userId)

Project
  ├── User (ownerId - indexed)
  ├── ProjectMember (projectId - indexed)
  └── Task (projectId - indexed)

ProjectMember
  ├── Project (projectId - indexed)
  ├── User (userId - indexed)
  └── User (invitedBy - optional)

Task
  ├── Project (projectId - indexed)
  ├── User (createdBy)
  └── User (assignedTo - optional, must be ProjectMember)

Notification
  ├── User (recipientId)
  └── User (senderId)

ActivityLog
  └── User (userId)
```

## 🔍 Common Database Queries

**Get all projects for a user:**
```javascript
// User owns projects
db.projects.find({ ownerId: userId })

// User is member of projects
db.projectmembers.find({ userId: userId }).then(projects with projectId)
```

**Get all tasks for a project:**
```javascript
db.tasks.find({ projectId: projectId })
```

**Get tasks assigned to a user:**
```javascript
db.tasks.find({ assignedTo: userId })
```

**Get all members of a project:**
```javascript
db.projectmembers.find({ projectId: projectId }).populate('userId')
```

**Check if user is project member:**
```javascript
db.projectmembers.findOne({ projectId, userId })
```

**Get user notifications:**
```javascript
db.notifications.find({ recipientId: userId }).sort({ createdAt: -1 })
```

**Get activity logs for user:**
```javascript
db.activitylogs.find({ userId: userId }).sort({ timestamp: -1 })
```

## 🚀 Deployment

### Deployment to Render

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Set environment variables in Render dashboard
4. Deploy the application

See [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=your_production_frontend_url
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Use ES6+ features
- Follow Express.js conventions
- Maintain consistent naming conventions
- Add comments for complex logic
- Use try-catch for error handling

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Manual API Testing with cURL

**Test Authentication:**
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "member"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Test Projects (with token):**
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API collection (if available)
2. Set `Authorization` type to `Bearer Token`
3. Add your JWT token in the token field
4. Test each endpoint

## 🔍 Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Check your MONGO_URI in `.env`
- Ensure MongoDB Atlas cluster is running
- Verify network access in MongoDB Atlas (IP whitelist)

**"JWT malformed" error**
- Ensure JWT_SECRET is set in `.env`
- Check token format in Authorization header
- Token should be in format: `Bearer <token>`

**"CORS error" on frontend requests**
- Verify FRONTEND_URL in `.env` matches your frontend URL
- Check that CORS is enabled in `server.js`
- Clear browser cache and try again

**Port already in use**
- Change PORT in `.env` to an available port
- Or kill process on that port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5000 | xargs kill -9
  ```

**"Module not found" errors**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`
- Run `npm install` fresh

## 📊 Advanced Features

### Role-Based Access Control

**Admin Users:**
- Create, update, delete projects
- Add/remove project members
- View all project tasks
- Access activity logs
- Manage team permissions

**Member Users:**
- Join projects
- View assigned tasks only
- Update own task status
- See project information
- Receive notifications

### Notification System

**Event Types:**
- `task_assigned`: When task is assigned to user
- `task_updated`: When assigned task is updated
- `member_added`: When added to project
- `member_removed`: When removed from project
- `project_created`: When project is created
- `status_changed`: When task status changes
- `deadline_approaching`: 24 hours before deadline
- `task_overdue`: When task deadline passes

### Activity Logging

All user actions are logged for audit purposes:
- User authentication (login/signup)
- Project operations (create/update/delete)
- Task operations (create/update/delete/assign)
- Member operations (add/remove)
- Status changes
- Timestamps and user information

Access via:
```bash
GET /api/activity-logs
Authorization: Bearer YOUR_TOKEN
```

## 📈 Performance Tips

1. **Database Optimization:**
   - Use indexes on frequently queried fields
   - Monitor query performance with MongoDB Atlas
   - Consider pagination for large datasets

2. **API Optimization:**
   - Implement caching where appropriate
   - Use response pagination
   - Compress responses with gzip

3. **Monitoring:**
   - Use MongoDB Atlas monitoring
   - Check Node.js memory usage
   - Monitor API response times
   - Set up error tracking (e.g., Sentry)

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` file
   - Use strong `JWT_SECRET` (minimum 32 characters)
   - Rotate secrets regularly in production

2. **Password Security:**
   - Enforce minimum length (8+ characters)
   - Require mixed case and numbers
   - Hash passwords with bcryptjs (min 10 rounds)
   - Never log or expose passwords

3. **API Security:**
   - Validate all inputs
   - Implement rate limiting
   - Use HTTPS in production
   - Set proper CORS headers
   - Implement request size limits

4. **Database Security:**
   - Enable MongoDB authentication
   - Use IP whitelist in MongoDB Atlas
   - Regular backups
   - Monitor access logs

## 📞 Support & Documentation

### Useful Resources
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)

### API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/projects` | Create project | Yes |
| GET | `/projects` | Get all projects | Yes |
| GET | `/projects/:id` | Get project details | Yes |
| PUT | `/projects/:id` | Update project | Yes |
| DELETE | `/projects/:id` | Delete project | Yes |
| POST | `/projects/:id/members` | Add member | Yes |
| DELETE | `/projects/:id/members/:memberId` | Remove member | Yes |
| POST | `/projects/:id/tasks` | Create task | Yes |
| GET | `/projects/:id/tasks` | Get project tasks | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| GET | `/notifications` | Get notifications | Yes |
| GET | `/activity-logs` | Get activity logs | Yes |

## 🎯 Development Workflow

1. **Setup:** Clone repo → Install deps → Configure .env
2. **Development:** `npm run dev` → Make changes → Test locally
3. **Testing:** Run tests → Verify API endpoints → Check database
4. **Commit:** Stage changes → Commit with message → Push to GitHub
5. **Deploy:** Render auto-deploys → Verify on production → Monitor logs

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Complete authentication system with JWT
- ✅ Role-based access control (admin/member)
- ✅ Full project management (CRUD)
- ✅ Complete task management (CRUD)
- ✅ Task assignment with validation
- ✅ Member management with notifications
- ✅ Comprehensive notification system
- ✅ Activity logging system
- ✅ Dashboard with statistics
- ✅ Production-ready API

## 💡 Future Enhancements

- WebSocket support for real-time updates
- Email notifications
- Advanced filtering and search
- Task templates
- Team analytics dashboard
- File attachments for tasks
- Comments and discussions
- Custom roles and permissions

## 👨‍💻 Author

**Abhishek Kumar**
- GitHub: [@ABHISHEKKUMAR72](https://github.com/ABHISHEKKUMAR72)
- Email: your.email@example.com

## 🤝 Contributing Guidelines

1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/feature-name`
5. Submit a Pull Request

Please ensure:
- Code follows project style
- All tests pass
- Documentation is updated
- Commit messages are clear

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

MIT License © 2026 Abhishek Kumar - All rights reserved

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [JSON Web Tokens](https://jwt.io/) - Authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- All contributors and supporters of this project

---

**Last Updated:** May 16, 2026  
**Status:** Production Ready ✅  
**Version:** 1.0.0  

**For more information, check out the related guides:**
- Frontend: [frontend/README.md](../frontend/README.md)
- Deployment: [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)
- Readiness: [BACKEND_READINESS_REPORT.md](BACKEND_READINESS_REPORT.md)

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] Add email notifications
- [ ] Implement task comments and discussions
- [ ] Add file attachment support
- [ ] Implement activity logs
- [ ] Add advanced filtering and search
- [ ] Performance optimization
- [ ] API rate limiting
- [ ] Webhook support

---

**Happy coding! 🚀**
```

## 🛡️ Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Stateless session management
- **Authorization** - Role-based access control
- **CORS** - Configured for frontend communication
- **Environment Variables** - Sensitive data not in code
- **MongoDB Validation** - Schema-level constraints
- **Access Control** - Project ownership and member checks

## 🚀 Deployment to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Render Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 3: Configure
- **Name**: `task-manager-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables
```
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secret_key
FRONTEND_URL=your_frontend_url
```

### Step 5: Deploy
Click "Create Web Service" and wait for deployment (5-10 minutes)

**See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions.**

## 📊 Database Schema

### User
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'member'], default: 'member'),
  timestamps: true
}
```

### Project
```javascript
{
  name: String (required),
  description: String,
  ownerId: ObjectId (ref: User, required),
  status: String (enum: ['active', 'completed', 'archived'], default: 'active'),
  startDate: Date,
  dueDate: Date,
  timestamps: true
}
```

### Task
```javascript
{
  title: String (required),
  description: String,
  projectId: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User),
  status: String (enum: ['todo', 'in_progress', 'completed'], default: 'todo'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate: Date,
  createdBy: ObjectId (ref: User, required),
  timestamps: true
}
```

### ProjectMember
```javascript
{
  projectId: ObjectId (ref: Project, required),
  userId: ObjectId (ref: User, required),
  role: String (enum: ['admin', 'member'], default: 'member'),
  timestamps: true
}
```

## 🔍 Testing

### Recommended Tools
- **Postman** - API testing GUI
- **Thunder Client** - VS Code extension
- **curl** - Command line

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Full Test Workflow
1. Signup with new user
2. Login to get token
3. Create a project
4. Add team member
5. Create task and assign
6. Update task status
7. Check dashboard stats

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development, production |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing key | any-random-string |
| FRONTEND_URL | Frontend origin (CORS) | http://localhost:3000 |

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- **express-validator** - Input validation

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure MongoDB user has proper permissions

### JWT Token Invalid
- Token may be expired (7 days)
- Verify JWT_SECRET matches
- Include "Bearer" prefix in Authorization header

### CORS Error
- Update FRONTEND_URL in environment
- Ensure credentials: true is set in requests

### Port Already in Use
- Change PORT environment variable
- Kill process using port: `lsof -i :5000`

## 📄 License

MIT

## 👥 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

For issues and questions:
- Open GitHub issues
- Check documentation files
- Review API examples

---

**Status:** ✅ Production-Ready for Render Deployment

**Version:** 1.0.0
**Last Updated:** May 4, 2026
