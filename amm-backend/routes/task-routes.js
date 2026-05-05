// Task Routes
import express from 'express';
import { authToken, authRole } from '../middleware/auth-middleware.js';
import {
    createTask,
    getTask,
    getTasksByAircraft,
    getPendingB1Tasks,
    getPendingB2Tasks,
    getPendingCRSReview,
    getCompletedB1Tasks,
    getCompletedB2Tasks,
    approvB1,
    approveB2,
    approvCRS,
    rejectB1,
    rejectB2,
    rejectCRS,
    taskApprovalStatus,
    updateTask,
    deleteTask,
    getApprovalStats
} from '../controllers/task-controller.js';

const taskRouter = express.Router();

taskRouter.get('/api/tasks/stats/approval-dashboard', authToken, getApprovalStats);

taskRouter.post('/api/tasks/create', authToken, createTask);
taskRouter.get('/api/tasks/:taskId', authToken, getTask);
taskRouter.put('/api/tasks/:taskId', authToken, updateTask);
taskRouter.delete('/api/tasks/:taskId', authToken, deleteTask);

taskRouter.get('/api/tasks/aircraft/:aircraftId', authToken, getTasksByAircraft);

taskRouter.get('/api/tasks/approval/pending-b1', authToken, getPendingB1Tasks);
taskRouter.get('/api/tasks/approval/pending-b2', authToken, getPendingB2Tasks);
taskRouter.get('/api/tasks/approval/pending-crs', authToken, getPendingCRSReview);

taskRouter.get('/api/tasks/approval/completed-b1', authToken, getCompletedB1Tasks);
taskRouter.get('/api/tasks/approval/completed-b2', authToken, getCompletedB2Tasks);

taskRouter.post('/api/tasks/:taskId/approve-b1', authToken, approvB1);
taskRouter.post('/api/tasks/:taskId/approve-b2', authToken, approveB2);
taskRouter.post('/api/tasks/:taskId/approve-crs', authToken, approvCRS);

taskRouter.post('/api/tasks/:taskId/reject-b1', authToken, rejectB1);
taskRouter.post('/api/tasks/:taskId/reject-b2', authToken, rejectB2);
taskRouter.post('/api/tasks/:taskId/reject-crs', authToken, rejectCRS);

taskRouter.get('/api/tasks/:taskId/approval-status', authToken, taskApprovalStatus);

export default taskRouter;
