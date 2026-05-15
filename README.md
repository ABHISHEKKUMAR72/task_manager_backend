# 🎯 Team Task Manager - Backend API

[![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A powerful and scalable REST API for team task management with complete authentication, project management, task assignment, and role-based access control. Built with Express.js and MongoDB.

## ✨ Key Features

- **🔐 Authentication & Security**
  - JWT-based authentication with secure token handling
  - Password hashing using bcryptjs
  - Protected routes with middleware validation
  - User profile management

- **📊 Project Management**
  - Create, read, update, and delete projects
  - Team collaboration with project members
  - Role-based access control (Admin/Member)
  - Member management for projects

- **✅ Task Management**
  - Full CRUD operations for tasks
  - Task status tracking (Todo/In Progress/Completed)
  - Task assignment and delegation
  - Deadline and priority management
  - Task filtering and sorting

- **👥 Team Collaboration**
  - Add and remove project members
  - Role-based permissions
  - Task assignment to team members
  - Activity tracking

- **📈 Dashboard & Analytics**
  - Task statistics and overview
  - Overdue task tracking
  - Project insights and metrics
  - User activity summary

- **💾 Data Persistence**
  - MongoDB Atlas cloud database
  - Relationship management between entities
  - Data validation and integrity

## 🏗️ Technology Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB 9.6.1
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
    "name": "John Doe",
    "email": "john@example.com"
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
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-10T08:30:00Z"
  }
}
```

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

#### Create Task
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
    "project": "64f5a1b2c3d4e5f6g7h8i9j0",
    "assignedTo": "64f5a1b2c3d4e5f6g7h8i9j0",
    "dueDate": "2026-05-20",
    "createdAt": "2026-05-14T10:00:00Z"
  }
}
```

#### Get Project Tasks
```http
GET /projects/:projectId/tasks
Authorization: Bearer your_token
```

#### Update Task
```http
PUT /projects/tasks/:taskId
Authorization: Bearer your_token
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "medium"
}
```

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
    "tasksByStatus": {...}
  }
}
```

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
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Schema
```javascript
{
  name: String,
  description: String,
  admin: ObjectId (User),
  members: [ObjectId] (Users),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  status: String (todo/in-progress/completed),
  priority: String (low/medium/high),
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
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

## 👨‍💻 Author

**Abhishek Kumar**
- GitHub: [@ABHISHEKKUMAR72](https://github.com/ABHISHEKKUMAR72)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB for the powerful database
- All contributors and users of this project

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
