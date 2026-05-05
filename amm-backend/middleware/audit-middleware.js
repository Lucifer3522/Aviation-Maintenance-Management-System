// Import Required Modules
import AuditLogModel from '../models/audit-log-model.js';
import logger from '../utils/logger.js';

export const auditLog = (actionType, getTargetId, getPayload = null) => {
    return (req, res, next) => {
        const originalJson = res.json;

        res.json = function(data) {
            let targetId;
            if (typeof getTargetId === 'function') {
                targetId = getTargetId(req);
            } else if (typeof getTargetId === 'string') {
                targetId = getValueByPath(req, getTargetId);
            } else {
                targetId = getTargetId;
            }

            let payload = null;
            if (getPayload && typeof getPayload === 'function') {
                payload = getPayload(req, res);
            }

            const userId = req.user?.userId || req.user?.id || req.user?._id;

            logAuditAsync({
                userId,
                actionType,
                targetId,
                payload,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                timestamp: new Date()
            }).catch(error => {
                logger.dropError('AUDIT', `Async log failed: ${error.message}`, '');
            });

            return originalJson.call(this, data);
        };

        next();
    };
};

function getValueByPath(obj, path) {
    try {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    } catch (error) {
        return null;
    }
}

async function logAuditAsync(logData) {
    try {
        if (!logData.userId) {
            logger.dropInfo('AUDIT', 'Log created without userId', 'Warning');
        }

        const auditEntry = new AuditLogModel(logData);
        await auditEntry.save();

        logger.dropInfo('AUDIT', `${logData.actionType} on ${logData.targetId}`, 'Logged');
    } catch (error) {
        logger.dropError('AUDIT', `Error saving audit log: ${error.message}`, '');
    }
}

export default auditLog;
