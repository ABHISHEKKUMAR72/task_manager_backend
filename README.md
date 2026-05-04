# 🎯 Team Task Manager - Backend

A full-featured REST API for team task management with authentication, project management, task assignment, and role-based access control.

## ✨ Features

- **Authentication** - JWT-based signup/login with password hashing
- **Project Management** - Create, update, delete projects with team members
- **Task Management** - Full CRUD for tasks with status tracking and assignment
- **Team Collaboration** - Add/remove project members with role management
- **Dashboard** - Task statistics including overdue tracking
- **Role-Based Access Control** - Admin and member roles with proper authorization
- **MongoDB** - Cloud-based NoSQL database

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account (free tier available)
- npm or yarn

### Local Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/ABHISHEKKUMAR72/task_manager_backend.git
   cd task_manager_backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/?appName=YourApp
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

5. **Test Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup        - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/profile       - Get user profile (protected)
```

### Projects
```
POST   /api/projects           - Create project
GET    /api/projects           - Get user's projects
GET    /api/projects/:id       - Get project details
PUT    /api/projects/:id       - Update project
DELETE /api/projects/:id       - Delete project
```

### Project Members
```
POST   /api/projects/:id/members         - Add member
DELETE /api/projects/:id/members/:userId - Remove member
```

### Tasks
```
POST   /api/projects/:id/tasks           - Create task
GET    /api/projects/:id/tasks           - Get project tasks
PUT    /api/projects/tasks/:id           - Update task
DELETE /api/projects/tasks/:id           - Delete task
GET    /api/projects/stats/overview      - Get task dashboard
```

## 📋 Request/Response Examples

### Signup
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Project
**Request:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Redesign company website",
    "startDate": "2024-05-01",
    "dueDate": "2024-06-30"
  }'
```

### Create Task
**Request:**
```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage",
    "description": "Create new homepage design",
    "priority": "high",
    "dueDate": "2024-05-15",
    "assignedTo": "USER_ID"
  }'
```

### Get Dashboard Stats
**Request:**
```bash
curl -X GET http://localhost:5000/api/projects/stats/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Task statistics retrieved",
  "stats": {
    "total": 10,
    "todo": 5,
    "inProgress": 3,
    "completed": 2,
    "overdue": 1
  },
  "tasks": [...]
}
```

## 🏗️ Project Structure

```
src/
├── config/
│   └── database.js          - MongoDB connection
├── controllers/
│   ├── authController.js    - Auth logic
│   ├── projectController.js - Project management
│   └── taskController.js    - Task management
├── middleware/
│   └── auth.js              - JWT & RBAC middleware
├── models/
│   ├── User.js              - User schema
│   ├── Project.js           - Project schema
│   ├── Task.js              - Task schema
│   ├── ProjectMember.js     - ProjectMember schema
│   └── index.js             - Model exports
├── routes/
│   ├── authRoutes.js        - Auth endpoints
│   ├── projectRoutes.js     - Project endpoints
│   └── taskRoutes.js        - Task endpoints
├── utils/
│   ├── hash.js              - Password utilities
│   ├── jwt.js               - JWT utilities
│   └── index.js             - Utility exports
└── index.js                 - Express app setup
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
