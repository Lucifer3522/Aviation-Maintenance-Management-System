// Task Controller - Handles task operations and approvals
import Task from '../models/task-model.js';
import logger from '../utils/logger.js';
import {
    approveTaskB1,
    approveTaskB2,
    approveTaskCRS,
    rejectTaskB1,
    rejectTaskB2,
    rejectTaskCRS,
    getTaskApprovalStatus,
    checkBothApproved
} from '../services/approval-service.js';

/**
 * Create a new maintenance task
 * POST /api/tasks/create
 */
export async function createTask(req, res) {
    try {
        const {
            taskNumber,
            title,
            description,
            aircraftId,
            mplId,
            mpdId,
            priority,
            requiredApprovalBy,
            workDescription,
            estimatedHours,
            dueDate,
            technicians
        } = req.body;
        
        // Check if task number already exists
        const existingTask = await Task.findOne({ taskNumber });
        if (existingTask) {
            return res.status(400).json({ message: 'Task number already exists' });
        }
        
        // Create new task
        const task = await Task.create({
            taskNumber,
            title,
            description,
            aircraftId,
            mplId,
            mpdId,
            priority: priority || 'Medium',
            requiredApprovalBy: requiredApprovalBy || 'B1_ONLY',
            workDescription,
            estimatedHours,
            dueDate,
            technicians: technicians || [],
            createdBy: req.user._id,
            status: 'Pending'
        });
        
        logger.dropInfo('TASK_CONTROLLER', `Task ${taskNumber} created`, 'Success');
        
        res.status(201).json({
            message: 'Task created successfully',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Create Task Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get task by ID
 * GET /api/tasks/:taskId
 */
export async function getTask(req, res) {
    try {
        const { taskId } = req.params;
        
        const task = await Task.findById(taskId)
            .populate('createdBy', 'name email role')
            .populate('b1Approval.approvedBy', 'name email role')
            .populate('b2Approval.approvedBy', 'name email role')
            .populate('crsApproval.approvedBy', 'name email role')
            .populate('aircraftId', 'aircraftNumber')
            .populate('technicians', 'name email role');
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json(task);
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Task Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get all tasks for an aircraft
 * GET /api/tasks/aircraft/:aircraftId
 */
export async function getTasksByAircraft(req, res) {
    try {
        const { aircraftId } = req.params;
        const { status } = req.query;
        
        let query = { aircraftId };
        if (status) {
            query.status = status;
        }
        
        const tasks = await Task.find(query)
            .populate('createdBy', 'name email role')
            .populate('b1Approval.approvedBy', 'name email role')
            .populate('b2Approval.approvedBy', 'name email role')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Tasks by Aircraft Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get tasks waiting for B1 approval
 * GET /api/tasks/approval/pending-b1
 */
export async function getPendingB1Tasks(req, res) {
    try {
        const tasks = await Task.find({
            status: 'Pending',
            'b1Approval.approved': false,
            requiredApprovalBy: { $in: ['B1_ONLY', 'BOTH'] }
        })
            .populate('aircraftId', 'aircraftNumber')
            .populate('createdBy', 'name email')
            .populate('b1Approval.approvedBy', 'name email')
            .populate('b2Approval.approvedBy', 'name email')
            .populate('crsApproval.approvedBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Pending B1 Tasks Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get tasks waiting for B2 approval
 * GET /api/tasks/approval/pending-b2
 */
export async function getPendingB2Tasks(req, res) {
    try {
        const tasks = await Task.find({
            status: 'Pending',
            'b2Approval.approved': false,
            requiredApprovalBy: { $in: ['B2_ONLY', 'BOTH'] }
        })
            .populate('aircraftId', 'aircraftNumber')
            .populate('createdBy', 'name email')
            .populate('b1Approval.approvedBy', 'name email')
            .populate('b2Approval.approvedBy', 'name email')
            .populate('crsApproval.approvedBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Pending B2 Tasks Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get tasks ready for CRS review
 * GET /api/tasks/approval/pending-crs
 */
export async function getPendingCRSReview(req, res) {
    try {
        const tasks = await Task.find({
            status: 'Ready for CRS',
            'crsApproval.approved': false
        })
            .populate('aircraftId', 'aircraftNumber')
            .populate('b1Approval.approvedBy', 'name email role')
            .populate('b2Approval.approvedBy', 'name email role')
            .sort({ createdAt: -1 });
        
        // Filter by required approval type to ensure task is actually ready
        const validTasks = tasks.filter(task => {
            switch (task.requiredApprovalBy) {
                case 'B1_ONLY':
                    return task.b1Approval.approved;
                case 'B2_ONLY':
                    return task.b2Approval.approved;
                case 'BOTH':
                    return task.b1Approval.approved && task.b2Approval.approved;
                default:
                    return false;
            }
        });
        
        res.status(200).json({
            count: validTasks.length,
            tasks: validTasks
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Pending CRS Review Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get B1 tasks completed by CRS (tasks B1 has approved that CRS has now completed)
 * GET /api/tasks/approval/completed-b1
 */
export async function getCompletedB1Tasks(req, res) {
    try {
        const tasks = await Task.find({
            'b1Approval.approved': true,
            'crsApproval.approved': true,
            requiredApprovalBy: { $in: ['B1_ONLY', 'BOTH'] }
        })
            .populate('aircraftId', 'aircraftNumber')
            .populate('createdBy', 'name email')
            .populate('b1Approval.approvedBy', 'name email')
            .populate('b2Approval.approvedBy', 'name email')
            .populate('crsApproval.approvedBy', 'name email')
            .sort({ 'crsApproval.approvalDate': -1 });
        
        res.status(200).json({
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Completed B1 Tasks Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get B2 tasks completed by CRS (tasks B2 has approved that CRS has now completed)
 * GET /api/tasks/approval/completed-b2
 */
export async function getCompletedB2Tasks(req, res) {
    try {
        const tasks = await Task.find({
            'b2Approval.approved': true,
            'crsApproval.approved': true,
            requiredApprovalBy: { $in: ['B2_ONLY', 'BOTH'] }
        })
            .populate('aircraftId', 'aircraftNumber')
            .populate('createdBy', 'name email')
            .populate('b1Approval.approvedBy', 'name email')
            .populate('b2Approval.approvedBy', 'name email')
            .populate('crsApproval.approvedBy', 'name email')
            .sort({ 'crsApproval.approvalDate': -1 });
        
        res.status(200).json({
            count: tasks.length,
            tasks: tasks
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Completed B2 Tasks Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * B1 Approve Task
 * POST /api/tasks/:taskId/approve-b1
 */
export async function approvB1(req, res) {
    try {
        const { taskId } = req.params;
        const { comments } = req.body;
        
        // Check if user has B1 role
        if (!req.user.role.includes('B1')) {
            return res.status(403).json({ message: 'Only B1 technicians can approve' });
        }
        
        const task = await approveTaskB1(taskId, req.user._id, comments);
        
        res.status(200).json({
            message: 'Task approved by B1 successfully',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'B1 Approve Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * B2 Approve Task
 * POST /api/tasks/:taskId/approve-b2
 */
export async function approveB2(req, res) {
    try {
        const { taskId } = req.params;
        const { comments } = req.body;
        
        // Check if user has B2 role
        if (!req.user.role.includes('B2')) {
            return res.status(403).json({ message: 'Only B2 technicians can approve' });
        }
        
        const task = await approveTaskB2(taskId, req.user._id, comments);
        
        res.status(200).json({
            message: 'Task approved by B2 successfully',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'B2 Approve Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * CRS Approve Task
 * POST /api/tasks/:taskId/approve-crs
 */
export async function approvCRS(req, res) {
    try {
        const { taskId } = req.params;
        const { comments } = req.body;
        
        // Check if user has CRS role
        if (req.user.role !== 'CRS') {
            return res.status(403).json({ message: 'Only CRS can approve' });
        }
        
        const task = await approveTaskCRS(taskId, req.user._id, comments);
        
        res.status(200).json({
            message: 'Task approved by CRS successfully',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'CRS Approve Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * B1 Reject Task
 * POST /api/tasks/:taskId/reject-b1
 */
export async function rejectB1(req, res) {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }
        
        // Check if user has B1 role
        if (!req.user.role.includes('B1')) {
            return res.status(403).json({ message: 'Only B1 technicians can reject' });
        }
        
        const task = await rejectTaskB1(taskId, req.user._id, rejectionReason);
        
        res.status(200).json({
            message: 'Task rejected by B1',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'B1 Reject Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * B2 Reject Task
 * POST /api/tasks/:taskId/reject-b2
 */
export async function rejectB2(req, res) {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }
        
        // Check if user has B2 role
        if (!req.user.role.includes('B2')) {
            return res.status(403).json({ message: 'Only B2 technicians can reject' });
        }
        
        const task = await rejectTaskB2(taskId, req.user._id, rejectionReason);
        
        res.status(200).json({
            message: 'Task rejected by B2',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'B2 Reject Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * CRS Reject Task
 * POST /api/tasks/:taskId/reject-crs
 */
export async function rejectCRS(req, res) {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }
        
        // Check if user has CRS role
        if (req.user.role !== 'CRS') {
            return res.status(403).json({ message: 'Only CRS can reject' });
        }
        
        const task = await rejectTaskCRS(taskId, req.user._id, rejectionReason);
        
        res.status(200).json({
            message: 'Task rejected by CRS',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'CRS Reject Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get task approval status
 * GET /api/tasks/:taskId/approval-status
 */
export async function taskApprovalStatus(req, res) {
    try {
        const { taskId } = req.params;
        
        const approvalStatus = await getTaskApprovalStatus(taskId);
        
        res.status(200).json(approvalStatus);
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Task Approval Status Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Update task details
 * PUT /api/tasks/:taskId
 */
export async function updateTask(req, res) {
    try {
        const { taskId } = req.params;
        const updateData = req.body;
        
        // Don't allow direct status updates through this endpoint
        delete updateData.status;
        delete updateData.b1Approval;
        delete updateData.b2Approval;
        delete updateData.crsApproval;
        
        const task = await Task.findByIdAndUpdate(
            taskId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({
            message: 'Task updated successfully',
            task: task
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Update Task Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Delete task (only if still Pending)
 * DELETE /api/tasks/:taskId
 */
export async function deleteTask(req, res) {
    try {
        const { taskId } = req.params;
        
        const task = await Task.findById(taskId);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        if (task.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending tasks can be deleted' });
        }
        
        await Task.findByIdAndDelete(taskId);
        
        logger.dropInfo('TASK_CONTROLLER', `Task ${taskId} deleted`, 'Success');
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Delete Task Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Get approval statistics for dashboard
 * GET /api/tasks/stats/approval-dashboard
 */
export async function getApprovalStats(req, res) {
    try {
        // Count B1 pending tasks (B1_ONLY or BOTH)
        const pendingB1 = await Task.countDocuments({
            status: 'Pending',
            'b1Approval.approved': false,
            requiredApprovalBy: { $in: ['B1_ONLY', 'BOTH'] }
        });
        
        // Count B2 pending tasks (B2_ONLY or BOTH)
        const pendingB2 = await Task.countDocuments({
            status: 'Pending',
            'b2Approval.approved': false,
            requiredApprovalBy: { $in: ['B2_ONLY', 'BOTH'] }
        });
        
        // Count CRS pending tasks (any that are Ready for CRS and not approved by CRS)
        const pendingCRS = await Task.countDocuments({
            status: 'Ready for CRS',
            'crsApproval.approved': false
        });
        
        const completed = await Task.countDocuments({ status: 'Completed' });
        const rejected = await Task.countDocuments({ status: 'Rejected' });
        
        res.status(200).json({
            pendingB1Approvals: pendingB1,
            pendingB2Approvals: pendingB2,
            pendingCRSReviews: pendingCRS,
            completedTasks: completed,
            rejectedTasks: rejected
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Approval Stats Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
