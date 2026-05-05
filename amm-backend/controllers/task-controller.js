// Task Controller
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
        
        const existingTask = await Task.findOne({ taskNumber });
        if (existingTask) {
            return res.status(400).json({ message: 'Task number already exists' });
        }
        
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

export async function approvB1(req, res) {
    try {
        const { taskId } = req.params;
        const { comments } = req.body;
        
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

export async function approveB2(req, res) {
    try {
        const { taskId } = req.params;
        const { comments } = req.body;
        
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

export async function approvCRS(req, res) {
    try {
        const { taskId } = req.params;
        const { comments } = req.body;
        
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

export async function rejectB1(req, res) {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }
        
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

export async function rejectB2(req, res) {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }
        
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

export async function rejectCRS(req, res) {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }
        
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

export async function updateTask(req, res) {
    try {
        const { taskId } = req.params;
        const updateData = req.body;
        
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

export async function getApprovalStats(req, res) {
    try {
        const allTasks = await Task.find().select('status requiredApprovalBy b1Approval b2Approval crsApproval taskNumber');
        allTasks.forEach(t => {
            console.log(`Task ${t.taskNumber}: status=${t.status}, required=${t.requiredApprovalBy}, b1=${t.b1Approval?.approved}, b2=${t.b2Approval?.approved}, crs=${t.crsApproval?.approved}`);
        });

        const pendingB1 = await Task.countDocuments({
            status: 'Pending',
            'b1Approval.approved': false,
            requiredApprovalBy: { $in: ['B1_ONLY', 'BOTH'] }
        });
        
        const pendingB2 = await Task.countDocuments({
            status: 'Pending',
            'b2Approval.approved': false,
            requiredApprovalBy: { $in: ['B2_ONLY', 'BOTH'] }
        });
        
        const pendingCRS = await Task.countDocuments({
            status: 'Ready for CRS',
            'crsApproval.approved': false
        });
        
        const completed = await Task.countDocuments({ status: 'Completed' });
        const rejected = await Task.countDocuments({ status: 'Rejected' });
        
        const statusBreakdown = {};
        const tasksByStatus = await Task.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        tasksByStatus.forEach(item => {
            statusBreakdown[item._id] = item.count;
        });

        console.log("Status breakdown:", statusBreakdown);

        res.status(200).json({
            pendingB1Approvals: pendingB1,
            pendingB2Approvals: pendingB2,
            pendingCRSReviews: pendingCRS,
            completedTasks: completed,
            rejectedTasks: rejected,
            totalTasks: allTasks.length,
            statusBreakdown: statusBreakdown
        });
    } catch (error) {
        logger.dropError('TASK_CONTROLLER', 'Get Approval Stats Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
