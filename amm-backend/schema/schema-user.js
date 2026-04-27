// Import Required Modules
import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: { 
        type: String, 
        required: false
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN', 'CAMO', 'MRO', 'B1_TECH', 'B2_TECH', 'C_TECH', 'CRS'],
        default: 'MRO',
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        sparse: true
    },
    certifications: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Export Schema
export default userSchema;