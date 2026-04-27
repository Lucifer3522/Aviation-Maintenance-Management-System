// Import Required Modules
import mongoose from 'mongoose';

// Aircraft Model Schema
const aircraftModelSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
    },
    modelPath: {
        type: String,
    },
    description: String,
    specifications: {
        maxTakeoffWeight: Number,
        maxPassengers: Number,
        maxRange: Number,
        engineType: String,
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

// Aircraft Model Index
aircraftModelSchema.index({ manufacturer: 1, model: 1 }, { unique: true });

// Aircraft Model Name Creator Function
aircraftModelSchema.virtual('displayName').get(function() {
    return `${this.manufacturer} ${this.model}`;
});

// Export Schema
export default aircraftModelSchema;
