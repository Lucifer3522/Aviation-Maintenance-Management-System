// Import Required Modules
import mongoose from 'mongoose';

// Maintenance Program List Schema
const mplSchema = new mongoose.Schema({
    aircraftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-Aircraft',
        required: true
    },
    mpdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-MPD',
        required: false
    },
    camoOrganization: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-User',
        required: true
    },
    mpNumber: {
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
        schedulingType: {
        type: String,
        enum: ['FH', 'FC', 'Calendar', 'FH_FC', 'FH_Calendar', 'FC_Calendar', 'All'],
        required: true
    },
    flightHours: {
        interval: Number,
        threshold: Number,
        lastCompliance: Number
    },
    flightCycles: {
        interval: Number,
        threshold: Number,
        lastCompliance: Number
    },
    calendar: {
        interval: Number,
        intervalUnit: {
            type: String,
            enum: ['Days', 'Months', 'Years'],
            default: 'Days'
        },
        lastComplianceDate: Date
    },
    nextDueDate: Date,
    nextDueFH: Number,
    nextDueFC: Number,    
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended', 'Completed'],
        default: 'Active'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    camoNotes: String,
    approvalReference: String,
    relatedServiceBulletins: [{
        sbNumber: String,
        revision: String,
        complianceStatus: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started'
        }
    }],
    sentToMRO: {
        type: Boolean,
        default: false
    },
    sentToMRODate: Date,
    mroOrganization: String,
    
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
mplSchema.index({ aircraftId: 1, status: 1 });
mplSchema.index({ nextDueDate: 1 });
mplSchema.index({ camoOrganization: 1 });

// Export Schema
export default mplSchema;
