// Import Required Modules
import mongoose from 'mongoose';

// Service Bulletin Schema
const serviceBulletinSchema = new mongoose.Schema({
    aircraftModelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-AircraftModel',
        required: true
    },
    sbNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    revision: {
        type: String,
        default: '0'
    },
    manufacturer: {
        type: String,
        required: true
    },
    issuedDate: {
        type: Date,
        required: true
    },
    effectiveDate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ataChapter: {
        type: String,
        required: true
    },
    applicableModels: [String],
    applicableEngineTypes: [String],
    serialNumberRange: {
        from: String,
        to: String
    },
    category: {
        type: String,
        enum: ['Mandatory', 'Recommended', 'Optional', 'Alert'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        default: 'Medium'
    },
    complianceType: {
        type: String,
        enum: ['Before Next Flight', 'Within X Hours/Cycles', 'Calendar', 'At Next Maintenance', 'Within Days', 'Within Flight Hours', 'Within Cycles', 'At Convenient Time'],
        required: true
    },
    complianceThreshold: {
        days: Number,
        flightHours: Number,
        cycles: Number
    },
    estimatedManHours: Number,
    requiredParts: [{
        partNumber: String,
        description: String,
        quantity: Number
    }],
    requiredTools: [String],
    specialInstructions: String,
    relatedMPDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-MPD'
    }],
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadDate: Date
    }],
    status: {
        type: String,
        enum: ['Active', 'Superseded', 'Cancelled', 'Archived'],
        default: 'Active'
    },
    supersededBy: {
        type: String,
        trim: true
    },
    reviewedByCAMO: {
        type: Boolean,
        default: false
    },
    reviewDate: Date,
    reviewNotes: String,
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
serviceBulletinSchema.index({ aircraftModelId: 1, status: 1 });
serviceBulletinSchema.index({ manufacturer: 1 });
serviceBulletinSchema.index({ category: 1, priority: 1 });

// Export Schema
export default serviceBulletinSchema;
