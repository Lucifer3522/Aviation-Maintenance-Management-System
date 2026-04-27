// Import Required Modules
import mongoose from 'mongoose';

// Role Schema
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '👤'
    },
    color: {
        type: String,
        default: '#6B7280'
    },
    permissions: [{
        type: String,
        enum: [
            'VIEW_DASHBOARD',
            'MANAGE_AIRCRAFT',
            'MANAGE_MPD',
            'CREATE_MPL',
            'EDIT_MPL',
            'SEND_MPL_TO_MRO',
            'CREATE_MPTL',
            'EDIT_MPTL',
            'ASSIGN_TASKS',
            'VIEW_TASKS',
            'UPDATE_TASK_STATUS',
            'ADD_WORK_LOG',
            'ISSUE_CRS',
            'MANAGE_SERVICE_BULLETINS',
            'MANAGE_USERS',
            'MANAGE_ROLES',
            'VIEW_REPORTS'
        ]
    }],
    isSystem: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Export Schema
export default roleSchema;
