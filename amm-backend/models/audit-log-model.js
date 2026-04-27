// Import Required Modules
import mongoose from 'mongoose';

// Import Audit Log Schema
import auditLogSchema from '../schema/schema-audit-log.js';

// Create and Export Audit Log Model
const AuditLogModel = mongoose.model('AMM-AuditLog', auditLogSchema);

export default AuditLogModel;
