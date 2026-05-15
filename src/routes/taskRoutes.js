import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/:projectId/tasks', authenticate, taskController.createTask);
router.get('/:projectId/tasks', authenticate, taskController.getProjectTasks);
router.get('/task/:taskId', authenticate, taskController.getTaskById);
router.put('/tasks/:taskId', authenticate, taskController.updateTask);
router.delete('/tasks/:taskId', authenticate, taskController.deleteTask);
router.post('/tasks/:taskId/collaborators', authenticate, taskController.addCollaborator);
router.delete('/tasks/:taskId/collaborators', authenticate, taskController.removeCollaborator);
router.post('/tasks/:taskId/comments', authenticate, taskController.addComment);
router.get('/stats/overview', authenticate, taskController.getTaskStats);

export default router;
