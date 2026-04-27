// Import Required Modules
import AuditLogModel from '../models/audit-log-model.js';
import logger from '../utils/logger.js';

/**
 * Audit Logging Middleware
 * 
 * Creates a non-blocking audit log entry for tracked actions.
 * Logs action asynchronously to avoid blocking the main response.
 * 
 * @param {string} actionType - The type of action being performed (e.g., 'AIRCRAFT_DELETED')
 * @param {string|function} getTargetId - The ID of the resource being affected. 
 *                                        Can be a string (for static IDs like 'req.body.id') 
 *                                        or a function(req) that extracts the ID dynamically
 * @param {function} getPayload - Optional function(req, res) to extract the payload/changes data
 * 
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Static target ID
 * router.delete('/:id', auditLog('AIRCRAFT_DELETED', 'params.id'), deleteAircraft);
 * 
 * // Dynamic target ID extraction
 * router.post(
 *   '/',
 *   auditLog(
 *     'AIRCRAFT_CREATED',
 *     (req) => req.body.id || 'new',
 *     (req) => ({ name: req.body.name, model: req.body.model })
 *   ),
 *   createAircraft
 * );
 * 
 * // With before/after tracking
 * router.put(
 *   '/:id',
 *   auditLog(
 *     'AIRCRAFT_UPDATED',
 *     'params.id',
 *     (req) => ({
 *       before: req.body.previousData,
 *       after: req.body.currentData
 *     })
 *   ),
 *   updateAircraft
 * );
 */
export const auditLog = (actionType, getTargetId, getPayload = null) => {
    return (req, res, next) => {
        // Store original json function
        const originalJson = res.json;

        // Override res.json to capture response and log after
        res.json = function(data) {
            // Extract target ID
            let targetId;
            if (typeof getTargetId === 'function') {
                targetId = getTargetId(req);
            } else if (typeof getTargetId === 'string') {
                // Parse dot notation (e.g., 'params.id' or 'body.id')
                targetId = getValueByPath(req, getTargetId);
            } else {
                targetId = getTargetId;
            }

            // Extract payload/changes
            let payload = null;
            if (getPayload && typeof getPayload === 'function') {
                payload = getPayload(req, res);
            }

            // Extract user ID from JWT token (set by authToken middleware)
            const userId = req.user?.userId || req.user?.id || req.user?._id;

            // Log asynchronously without blocking response
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

            // Call original json function
            return originalJson.call(this, data);
        };

        next();
    };
};

/**
 * Helper function to retrieve nested object values using dot notation
 * @param {Object} obj - The object to search
 * @param {string} path - Dot-separated path (e.g., 'params.id', 'body.name')
 * @returns {*} The value at the path, or null if not found
 */
function getValueByPath(obj, path) {
    try {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    } catch (error) {
        return null;
    }
}

/**
 * Asynchronous audit log saver
 * Saves audit log without blocking the main response
 * @param {Object} logData - The audit log data to save
 */
async function logAuditAsync(logData) {
    try {
        // Validate that userId exists
        if (!logData.userId) {
            logger.dropInfo('AUDIT', 'Log created without userId', 'Warning');
        }

        // Create and save audit log
        const auditEntry = new AuditLogModel(logData);
        await auditEntry.save();

        logger.dropInfo('AUDIT', `${logData.actionType} on ${logData.targetId}`, 'Logged');
    } catch (error) {
        logger.dropError('AUDIT', `Error saving audit log: ${error.message}`, '');
        // Don't re-throw; we don't want audit failures to affect the main operation
    }
}

export default auditLog;
