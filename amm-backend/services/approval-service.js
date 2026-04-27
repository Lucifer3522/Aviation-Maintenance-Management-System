// Approval Service for Task Workflow
import Task from '../models/task-model.js';
import Aircraft from '../models/aircraft-model.js';
import logger from '../utils/logger.js';

/**
 * Check if both B1 and B2 have approved the task
 */
export async function checkBothApproved(taskId) {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        const b1Approved = task.b1Approval.approved;
        const b2Approved = task.b2Approval.approved;
        
        return b1Approved && b2Approved;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'Check Both Approved Error', error);
        throw error;
    }
}

/**
 * Update approval status and move task to next stage based on required approvals
 */
export async function updateTaskApprovalStatus(taskId) {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        // Check if task is rejected by any required approver
        if (task.b1Approval.rejectionReason || task.b2Approval.rejectionReason) {
            task.status = 'Rejected';
            task.updatedAt = new Date();
            await task.save();
            return task;
        }
        
        // Determine if task is ready for CRS based on required approval type
        let readyForCRS = false;
        
        switch (task.requiredApprovalBy) {
            case 'B1_ONLY':
                // Only B1 approval needed
                readyForCRS = task.b1Approval.approved;
                break;
                
            case 'B2_ONLY':
                // Only B2 approval needed
                readyForCRS = task.b2Approval.approved;
                break;
                
            case 'BOTH':
                // Both B1 and B2 approvals needed
                readyForCRS = task.b1Approval.approved && task.b2Approval.approved;
                break;
                
            default:
                readyForCRS = false;
        }
        
        // Update approval status flags
        task.approvalStatus.b1Submitted = task.b1Approval.approved;
        task.approvalStatus.b2Submitted = task.b2Approval.approved;
        task.approvalStatus.bothApproved = task.b1Approval.approved && task.b2Approval.approved;
        task.approvalStatus.crsReady = readyForCRS;
        
        // Update task status based on approvals
        if (readyForCRS && task.status === 'Pending') {
            task.status = 'Ready for CRS';
        }
        
        task.updatedAt = new Date();
        await task.save();
        
        return task;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'Update Task Approval Status Error', error);
        throw error;
    }
}

/**
 * B1 Approval - Mechanical
 */
export async function approveTaskB1(taskId, userId, comments = '') {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        if (task.status !== 'Pending' && task.status !== 'On Hold') {
            throw new Error('Task cannot be approved at this stage');
        }
        
        // Record B1 approval
        task.b1Approval.approved = true;
        task.b1Approval.approvedBy = userId;
        task.b1Approval.approvalDate = new Date();
        task.b1Approval.comments = comments;
        task.b1Approval.rejectionReason = null; // Clear any previous rejection
        
        // Save B1 approval
        await task.save();
        
        // Update approval status and move to next stage if ready
        const updatedTask = await updateTaskApprovalStatus(task._id);
        
        logger.dropInfo('APPROVAL_SERVICE', `B1 approved task ${taskId}`, 'Success');
        return updatedTask;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'B1 Approve Error', error);
        throw error;
    }
}

/**
 * B2 Approval - Avionics
 */
export async function approveTaskB2(taskId, userId, comments = '') {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        if (task.status !== 'Pending' && task.status !== 'On Hold') {
            throw new Error('Task cannot be approved at this stage');
        }
        
        // Record B2 approval
        task.b2Approval.approved = true;
        task.b2Approval.approvedBy = userId;
        task.b2Approval.approvalDate = new Date();
        task.b2Approval.comments = comments;
        task.b2Approval.rejectionReason = null; // Clear any previous rejection
        
        // Save B2 approval
        await task.save();
        
        // Update approval status and move to next stage if ready
        const updatedTask = await updateTaskApprovalStatus(task._id);
        
        logger.dropInfo('APPROVAL_SERVICE', `B2 approved task ${taskId}`, 'Success');
        return updatedTask;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'B2 Approve Error', error);
        throw error;
    }
}

/**
 * Reject task by B1
 */
export async function rejectTaskB1(taskId, userId, rejectionReason) {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        task.b1Approval.approved = false;
        task.b1Approval.approvedBy = userId;
        task.b1Approval.rejectionReason = rejectionReason;
        task.b1Approval.approvalDate = new Date();
        task.status = 'Rejected';
        task.updatedAt = new Date();
        
        await task.save();
        logger.dropInfo('APPROVAL_SERVICE', `B1 rejected task ${taskId}`, 'Success');
        return task;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'B1 Reject Error', error);
        throw error;
    }
}

/**
 * Reject task by B2
 */
export async function rejectTaskB2(taskId, userId, rejectionReason) {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        task.b2Approval.approved = false;
        task.b2Approval.approvedBy = userId;
        task.b2Approval.rejectionReason = rejectionReason;
        task.b2Approval.approvalDate = new Date();
        task.status = 'Rejected';
        task.updatedAt = new Date();
        
        await task.save();
        logger.dropInfo('APPROVAL_SERVICE', `B2 rejected task ${taskId}`, 'Success');
        return task;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'B2 Reject Error', error);
        throw error;
    }
}

/**
 * CRS Final Approval
 */
export async function approveTaskCRS(taskId, userId, comments = '') {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        if (task.status !== 'Ready for CRS') {
            throw new Error('Task is not ready for CRS approval');
        }
        
        // Check that required approvals have been met based on task type
        let requiredApprovalsComplete = false;
        switch (task.requiredApprovalBy) {
            case 'B1_ONLY':
                requiredApprovalsComplete = task.b1Approval.approved;
                break;
            case 'B2_ONLY':
                requiredApprovalsComplete = task.b2Approval.approved;
                break;
            case 'BOTH':
                requiredApprovalsComplete = task.b1Approval.approved && task.b2Approval.approved;
                break;
            default:
                throw new Error('Invalid approval requirement type');
        }
        
        if (!requiredApprovalsComplete) {
            throw new Error('Required approvals have not been completed');
        }
        
        // Record CRS approval
        task.crsApproval.approved = true;
        task.crsApproval.approvedBy = userId;
        task.crsApproval.approvalDate = new Date();
        task.crsApproval.comments = comments;
        task.status = 'Completed';
        task.completionDate = new Date();
        task.updatedAt = new Date();
        
        await task.save();
        
        // Check and update aircraft status if all tasks are completed
        await updateAircraftStatus(task.aircraftId);
        
        logger.dropInfo('APPROVAL_SERVICE', `CRS approved task ${taskId}`, 'Success');
        return task;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'CRS Approve Error', error);
        throw error;
    }
}

/**
 * CRS Rejection
 */
export async function rejectTaskCRS(taskId, userId, rejectionReason) {
    try {
        const task = await Task.findById(taskId);
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        task.crsApproval.approved = false;
        task.crsApproval.approvedBy = userId;
        task.crsApproval.rejectionReason = rejectionReason;
        task.crsApproval.approvalDate = new Date();
        task.status = 'Rejected';
        task.updatedAt = new Date();
        
        await task.save();
        logger.dropInfo('APPROVAL_SERVICE', `CRS rejected task ${taskId}`, 'Success');
        return task;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'CRS Reject Error', error);
        throw error;
    }
}

/**
 * Update Aircraft Status - Set to "Ready for Flight" when all tasks are completed
 */
export async function updateAircraftStatus(aircraftId) {
    try {
        const aircraft = await Aircraft.findById(aircraftId);
        
        if (!aircraft) {
            throw new Error('Aircraft not found');
        }
        
        // Find all tasks for this aircraft
        const allTasks = await Task.find({ aircraftId: aircraftId });
        const completedTasks = await Task.find({ 
            aircraftId: aircraftId, 
            status: 'Completed' 
        });
        
        // If all tasks are completed, update aircraft status
        if (allTasks.length > 0 && allTasks.length === completedTasks.length) {
            aircraft.status = 'Ready for Flight';
            aircraft.updatedAt = new Date();
            await aircraft.save();
            
            logger.dropInfo('APPROVAL_SERVICE', `Aircraft ${aircraftId} is now Ready for Flight`, 'Success');
        }
        
        return aircraft;
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'Update Aircraft Status Error', error);
        throw error;
    }
}

/**
 * Get task approval status with details
 */
export async function getTaskApprovalStatus(taskId) {
    try {
        const task = await Task.findById(taskId)
            .populate('b1Approval.approvedBy', 'name email role')
            .populate('b2Approval.approvedBy', 'name email role')
            .populate('crsApproval.approvedBy', 'name email role')
            .populate('createdBy', 'name email role');
        
        if (!task) {
            throw new Error('Task not found');
        }
        
        return {
            taskId: task._id,
            taskNumber: task.taskNumber,
            status: task.status,
            b1: {
                approved: task.b1Approval.approved,
                approvedBy: task.b1Approval.approvedBy,
                approvalDate: task.b1Approval.approvalDate,
                comments: task.b1Approval.comments,
                rejectionReason: task.b1Approval.rejectionReason
            },
            b2: {
                approved: task.b2Approval.approved,
                approvedBy: task.b2Approval.approvedBy,
                approvalDate: task.b2Approval.approvalDate,
                comments: task.b2Approval.comments,
                rejectionReason: task.b2Approval.rejectionReason
            },
            crs: {
                approved: task.crsApproval.approved,
                approvedBy: task.crsApproval.approvedBy,
                approvalDate: task.crsApproval.approvalDate,
                comments: task.crsApproval.comments,
                rejectionReason: task.crsApproval.rejectionReason
            },
            approvalStatus: task.approvalStatus
        };
    } catch (error) {
        logger.dropError('APPROVAL_SERVICE', 'Get Task Approval Status Error', error);
        throw error;
    }
}
