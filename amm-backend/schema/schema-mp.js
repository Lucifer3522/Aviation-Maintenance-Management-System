// Import Required Modules
import mongoose from 'mongoose';

// Maintenance Package Schema
const maintenancePackageSchema = new mongoose.Schema({
    aircraftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-Aircraft',
        required: true
    },
    checkType: {
        type: String,
        required: true,
        enum: ['A-Check', 'B-Check', 'C-Check', 'D-Check', 'Daily', 'Weekly', 'Special']
    },
    name: {
        type: String,
        required: true
    },
    mpdItems: [{
        mpdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AMM-MPD'
        },
        task: String,
        code: String,
        maintenance: String,
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Deferred', 'N/A'],
            default: 'Pending'
        },
        scheduledDate: Date,
        completedDate: Date,
        completedBy: String,
        lastDone: Date,
        nextDue: Date,
        actualManHours: Number,
        notes: String
    }],
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    scheduledStartDate: Date,
    scheduledEndDate: Date,
    actualStartDate: Date,
    actualCompletionDate: Date,
    station: String,
    assignedTechnicians: [String],
    totalEstimatedHours: Number,
    totalActualHours: Number,
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    notes: String,
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

// Maintenance Package Index
maintenancePackageSchema.index({ aircraftId: 1, checkType: 1 });
maintenancePackageSchema.index({ status: 1 });
maintenancePackageSchema.index({ scheduledStartDate: 1 });

// Maintenance Package Progress Function
maintenancePackageSchema.pre('save', async function(next) {
    if (this.mpdItems && this.mpdItems.length > 0) {
        const completedItems = this.mpdItems.filter(item => item.status === 'Completed').length;
        this.completionPercentage = Math.round((completedItems / this.mpdItems.length) * 100);
        
        if (this.completionPercentage === 100) {
            this.status = 'Completed';
        } else if (this.completionPercentage > 0) {
            this.status = 'In Progress';
        }
    }
    if (typeof next === 'function') {
        next();
    }
});

// Export Schema
export default maintenancePackageSchema;