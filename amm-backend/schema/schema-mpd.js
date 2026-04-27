// Import Required Modules
import mongoose from 'mongoose';

// Maintenance Package Document Schema
const mpdSchema = new mongoose.Schema({
    aircraftModelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-AircraftModel',
        required: true
    },
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    engineType: {
        type: String,
        required: false,
        trim: true,
    },
    task: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    maintenance: {
        type: String,
        required: true
    },
    checkType: {
        type: String,
        required: true,
        enum: ['A-Check', 'B-Check', 'C-Check', 'D-Check', 'Daily', 'Weekly', 'Special'],
        default: 'A-Check'
    },
    serviceBulletinRefs: [{
        sbNumber: String,
        revision: String,
        effectiveDate: Date
    }],
    cal_fc: {
        type: Number,
        default: 0
    },
    cal_fh: {
        type: Number,
        default: 0
    },
    period: {
        type: String,
    },
    position: {
        type: [Number],
        default: [0, 0, 0]
    },
    ataChapter: {
        type: String,
    },
    description: String,
    references: [String],
    toolsRequired: [String],
    estimatedManHours: Number,
    criticalityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    isActive: {
        type: Boolean,
        default: true
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

// Maintenance Package Document Index
mpdSchema.index({ aircraftModelId: 1, task: 1 }, { unique: true });
mpdSchema.index({ aircraftModelId: 1, checkType: 1 });
mpdSchema.index({ code: 1 });

// Maintenance Package Document AMM Function
mpdSchema.pre('save', async function(next) {
    if (this.task) {
        this.ataChapter = this.task.split('-')[0];
    }
    if (typeof next === 'function') {
        next();
    }
});

// Export Schema
export default mpdSchema;