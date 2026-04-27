// Import Required Modules
import mongoose from 'mongoose';

// Maintenance Package Task List Schema
const mptlSchema = new mongoose.Schema({
    mplId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-MPL',
        required: true
    },
    aircraftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-Aircraft',
        required: true
    },
    mroOrganization: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-User',
        required: true
    },
    taskListNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    workOrderNumber: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    scheduledStartDate: {
        type: Date,
        required: true
    },
    scheduledEndDate: {
        type: Date,
        required: true
    },
    actualStartDate: Date,
    actualEndDate: Date,
    tasks: [{
        taskNumber: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        ataChapter: String,
        mpdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AMM-MPD'
        },
        taskType: {
            type: String,
            enum: ['Inspection', 'Repair', 'Replacement', 'Modification', 'Test', 'Lubrication', 'Servicing'],
            required: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AMM-User'
        },
        assignedRole: {
            type: String,
            enum: ['B1_TECH', 'B2_TECH', 'C_TECH'],
        },
        assignedDate: Date,
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
            default: 'Not Started'
        },
        startedAt: Date,
        completedAt: Date,
        manhours: {
            estimated: Number,
            actual: Number
        },
        findings: String,
        correctiveAction: String,
        partsUsed: [{
            partNumber: String,
            description: String,
            quantity: Number,
            serialNumber: String
        }],
        toolsRequired: [String],
        workLogs: [{
            technicianId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AMM-User'
            },
            technicianName: String,
            logDate: {
                type: Date,
                default: Date.now
            },
            notes: String,
            hoursWorked: Number
        }],
        technicianSignOff: {
            technicianId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AMM-User'
            },
            technicianName: String,
            licenseNumber: String,
            signedDate: Date,
            signature: String
        },
        inspectorSignOff: {
            inspectorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AMM-User'
            },
            inspectorName: String,
            licenseNumber: String,
            signedDate: Date,
            signature: String
        }
    }],
    overallStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Awaiting CRS', 'Completed', 'On Hold'],
        default: 'Not Started'
    },
    totalTasks: {
        type: Number,
        default: 0
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    progressPercentage: {
        type: Number,
        default: 0
    },
    crsIssued: {
        type: Boolean,
        default: false
    },
    crsNumber: String,
    crsIssuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-User'
    },
    crsIssuedDate: Date,
    crsNotes: String,
    mroNotes: String,
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

// Indexes
mptlSchema.index({ mplId: 1 });
mptlSchema.index({ aircraftId: 1 });
mptlSchema.index({ overallStatus: 1 });
mptlSchema.index({ 'tasks.assignedTo': 1 });
mptlSchema.index({ mroOrganization: 1 });

// Save to Update Progress Function
mptlSchema.pre('save', async function(next) {
    if (this.tasks && this.tasks.length > 0) {
        this.totalTasks = this.tasks.length;
        this.completedTasks = this.tasks.filter(task => task.status === 'Completed').length;
        this.progressPercentage = Math.round((this.completedTasks / this.totalTasks) * 100);
        
        if (this.completedTasks === 0) {
            this.overallStatus = 'Not Started';
        } else if (this.completedTasks === this.totalTasks && !this.crsIssued) {
            this.overallStatus = 'Awaiting CRS';
        } else if (this.completedTasks === this.totalTasks && this.crsIssued) {
            this.overallStatus = 'Completed';
        } else {
            this.overallStatus = 'In Progress';
        }
    }
    if (typeof next === 'function') {
        next();
    }
});

// Export Schema
export default mptlSchema;
