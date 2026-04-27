// Import API Service
import { apiService } from "./service-api";

// Task Service
export const taskService = {

    // Create Task
    createTask: async (data) => {
        return await apiService('/api/tasks/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Get Task by ID
    getTask: async (taskId) => {
        return await apiService(`/api/tasks/${taskId}`, {
            method: 'GET'
        });
    },

    // Get Tasks by Aircraft
    getTasksByAircraft: async (aircraftId, status = null) => {
        let endpoint = `/api/tasks/aircraft/${aircraftId}`;
        if (status) {
            endpoint += `?status=${status}`;
        }
        return await apiService(endpoint, {
            method: 'GET'
        });
    },

    // Get Pending B1 Tasks
    getPendingB1Tasks: async () => {
        return await apiService('/api/tasks/approval/pending-b1', {
            method: 'GET'
        });
    },

    // Get Pending B2 Tasks
    getPendingB2Tasks: async () => {
        return await apiService('/api/tasks/approval/pending-b2', {
            method: 'GET'
        });
    },

    // Get Pending CRS Review Tasks
    getPendingCRSReview: async () => {
        return await apiService('/api/tasks/approval/pending-crs', {
            method: 'GET'
        });
    },

    // Get B1 Completed Tasks (approved by B1, completed by CRS)
    getCompletedB1Tasks: async () => {
        return await apiService('/api/tasks/approval/completed-b1', {
            method: 'GET'
        });
    },

    // Get B2 Completed Tasks (approved by B2, completed by CRS)
    getCompletedB2Tasks: async () => {
        return await apiService('/api/tasks/approval/completed-b2', {
            method: 'GET'
        });
    },

    // B1 Approve Task
    approveB1: async (taskId, comments = '') => {
        return await apiService(`/api/tasks/${taskId}/approve-b1`, {
            method: 'POST',
            body: JSON.stringify({ comments })
        });
    },

    // B2 Approve Task
    approveB2: async (taskId, comments = '') => {
        return await apiService(`/api/tasks/${taskId}/approve-b2`, {
            method: 'POST',
            body: JSON.stringify({ comments })
        });
    },

    // CRS Approve Task
    approveCRS: async (taskId, comments = '') => {
        return await apiService(`/api/tasks/${taskId}/approve-crs`, {
            method: 'POST',
            body: JSON.stringify({ comments })
        });
    },

    // B1 Reject Task
    rejectB1: async (taskId, rejectionReason) => {
        return await apiService(`/api/tasks/${taskId}/reject-b1`, {
            method: 'POST',
            body: JSON.stringify({ rejectionReason })
        });
    },

    // B2 Reject Task
    rejectB2: async (taskId, rejectionReason) => {
        return await apiService(`/api/tasks/${taskId}/reject-b2`, {
            method: 'POST',
            body: JSON.stringify({ rejectionReason })
        });
    },

    // CRS Reject Task
    rejectCRS: async (taskId, rejectionReason) => {
        return await apiService(`/api/tasks/${taskId}/reject-crs`, {
            method: 'POST',
            body: JSON.stringify({ rejectionReason })
        });
    },

    // Get Task Approval Status
    getApprovalStatus: async (taskId) => {
        return await apiService(`/api/tasks/${taskId}/approval-status`, {
            method: 'GET'
        });
    },

    // Update Task
    updateTask: async (taskId, data) => {
        return await apiService(`/api/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Delete Task
    deleteTask: async (taskId) => {
        return await apiService(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
    },

    // Get Approval Dashboard Stats
    getApprovalStats: async () => {
        return await apiService('/api/tasks/stats/approval-dashboard', {
            method: 'GET'
        });
    }
};

// Export Service
export default taskService;
