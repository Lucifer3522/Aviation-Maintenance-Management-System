// Import Required Modules
import mongoose from 'mongoose';

// Aircraft Schema
const aircraftSchema = new mongoose.Schema({
    aircraftModelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-AircraftModel',
        required: true
    },
    registration: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    serialNumber: {
        type: String,
        trim: true
    },
    station: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 5
    },
    status: {
        type: String,
        enum: ['Active', 'Maintenance', 'Grounded', 'Retired', 'Ready for Flight', 'In Approval'],
        default: 'Active'
    },
    flightHours: {
        type: Number,
        default: 0,
        min: 0
    },
    cycles: {
        type: Number,
        default: 0,
        min: 0
    },
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    notes: String,
    
    // Task approval tracking
    maintenanceTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-Task'
    }],
    tasksCompletionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    
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

// Aircraft Index
aircraftSchema.index({ aircraftModelId: 1 });
aircraftSchema.index({ station: 1 });

// Export Schema
export default aircraftSchema;
