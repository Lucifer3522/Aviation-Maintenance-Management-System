// Import Required Modules
import mongoose from 'mongoose';

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AMM-User',
        required: true
    },
    actionType: {
        type: String,
        enum: [
            'AIRCRAFT_CREATED',
            'AIRCRAFT_UPDATED',
            'AIRCRAFT_DELETED',
            'AIRCRAFT_MODEL_CREATED',
            'AIRCRAFT_MODEL_UPDATED',
            'AIRCRAFT_MODEL_DELETED',
            'MPD_CREATED',
            'MPD_UPDATED',
            'MPD_DELETED',
            'MPL_CREATED',
            'MPL_UPDATED',
            'MPL_DELETED',
            'MPTL_CREATED',
            'MPTL_UPDATED',
            'MPTL_DELETED',
            'MP_CREATED',
            'MP_UPDATED',
            'MP_DELETED',
            'SERVICE_BULLETIN_CREATED',
            'SERVICE_BULLETIN_UPDATED',
            'SERVICE_BULLETIN_DELETED',
            'USER_CREATED',
            'USER_UPDATED',
            'USER_DELETED',
            'ROLE_CREATED',
            'ROLE_UPDATED',
            'ROLE_DELETED'
        ],
        required: true
    },
    targetId: {
        type: String,
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false
});

// TTL Index - Automatically delete documents after 90 days (7776000 seconds)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// Export Schema
export default auditLogSchema;
