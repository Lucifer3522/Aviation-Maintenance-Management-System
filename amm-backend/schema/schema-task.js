// Import Required Modules
import mongoose from 'mongoose';

// Task Schema with Role-Based Approval
const taskSchema = new mongoose.Schema({
    // Task Identity
    taskNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    
    // References
    aircraftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-Aircraft',
        required: true
    },
    mplId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-MPL',
        required: false
    },
    mpdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-MPD',
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-User',
        required: true
    },
    
    // Task Status Flow: Pending → Ready for CRS → Completed
    status: {
        type: String,
        enum: ['Pending', 'Ready for CRS', 'Completed', 'Rejected', 'On Hold'],
        default: 'Pending',
        required: true
    },
    
    // Priority
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    
    // Which role(s) need to approve: B1_ONLY, B2_ONLY, or BOTH
    requiredApprovalBy: {
        type: String,
        enum: ['B1_ONLY', 'B2_ONLY', 'BOTH'],
        default: 'B1_ONLY'
    },
    
    // B1 Approval (e.g., Mechanical)
    b1Approval: {
        approved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AMM-User'
        },
        approvalDate: Date,
        comments: String,
        rejectionReason: String
    },
    
    // B2 Approval (e.g., Avionics)
    b2Approval: {
        approved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AMM-User'
        },
        approvalDate: Date,
        comments: String,
        rejectionReason: String
    },
    
    // CRS Approval (Final Authority)
    crsApproval: {
        approved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AMM-User'
        },
        approvalDate: Date,
        comments: String,
        rejectionReason: String
    },
    
    // Approval Status Flags
    approvalStatus: {
        b1Submitted: {
            type: Boolean,
            default: false
        },
        b2Submitted: {
            type: Boolean,
            default: false
        },
        bothApproved: {
            type: Boolean,
            default: false
        },
        crsReady: {
            type: Boolean,
            default: false
        }
    },
    
    // Task Details
    workDescription: String,
    estimatedHours: Number,
    actualHours: Number,
    technicians: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-User'
    }],
    
    // Due Date
    dueDate: Date,
    completionDate: Date,
    
    // Timeline
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
taskSchema.index({ aircraftId: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ taskNumber: 1 });

export default taskSchema;
