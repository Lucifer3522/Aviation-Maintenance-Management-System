// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import AuditLogModel from '../models/audit-log-model.js';

// Import Required Middleware
import { authToken, authSuperAdmin } from '../middleware/auth-middleware.js';

// ----- [ GET ] ----- //

/**
 * Get Audit Logs with Pagination
 * Protected Route: SUPER_ADMIN only
 * Query Parameters:
 *   - page: Page number (default: 1)
 *   - limit: Logs per page (default: 20, max: 100)
 *   - actionType: Filter by action type (optional)
 *   - userId: Filter by user ID (optional)
 *   - startDate: Filter logs from this date (optional, ISO 8601 format)
 *   - endDate: Filter logs until this date (optional, ISO 8601 format)
 */
router.get('/api/admin/logs', authToken, authSuperAdmin, async (req, res) => {
    try {
        // Extract and validate pagination parameters
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        // Filter by actionType if provided
        if (req.query.actionType) {
            filter.actionType = req.query.actionType;
        }

        // Filter by userId if provided
        if (req.query.userId) {
            filter.userId = req.query.userId;
        }

        // Filter by date range if provided
        if (req.query.startDate || req.query.endDate) {
            filter.timestamp = {};
            if (req.query.startDate) {
                filter.timestamp.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.timestamp.$lte = new Date(req.query.endDate);
            }
        }

        // Execute query with pagination
        const logs = await AuditLogModel.find(filter)
            .populate('userId', 'username email role organization')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination metadata
        const total = await AuditLogModel.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        // Send response with pagination metadata
        res.json({
            success: true,
            data: logs,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords: total,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

        logger.dropInfo('API', `Fetched audit logs - Page ${page}, Total: ${total}`, 'Success');

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Audit Logs Fetch Error',
            error: error.message
        });
        logger.dropError('API', 'Audit Logs Fetch Error', error.message);
    }
});

/**
 * Get Audit Log by ID
 * Protected Route: SUPER_ADMIN only
 */
router.get('/api/admin/logs/:id', authToken, authSuperAdmin, async (req, res) => {
    try {
        const log = await AuditLogModel.findById(req.params.id)
            .populate('userId', 'username email role organization');

        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Audit Log not Found'
            });
        }

        res.json({
            success: true,
            data: log
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Audit Log Fetch Error',
            error: error.message
        });
        logger.dropError('API', 'Audit Log Fetch Error', error.message);
    }
});

/**
 * Get Audit Statistics
 * Protected Route: SUPER_ADMIN only
 * Returns summary of audit activities
 */
router.get('/api/admin/logs/stats/summary', authToken, authSuperAdmin, async (req, res) => {
    try {
        // Get action type statistics
        const actionStats = await AuditLogModel.aggregate([
            {
                $group: {
                    _id: '$actionType',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Get user activity statistics
        const userStats = await AuditLogModel.aggregate([
            {
                $group: {
                    _id: '$userId',
                    actionCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'amm-users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: {
                    path: '$userInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    userId: '$_id',
                    username: '$userInfo.username',
                    actionCount: 1
                }
            },
            {
                $sort: { actionCount: -1 }
            }
        ]);

        // Get total logs count
        const totalLogs = await AuditLogModel.countDocuments();

        // Get logs from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const logsLast7Days = await AuditLogModel.countDocuments({
            timestamp: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            data: {
                totalLogs,
                logsLast7Days,
                actionTypeStats: actionStats,
                userActivityStats: userStats
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Audit Stats Error',
            error: error.message
        });
        logger.dropError('API', 'Audit Stats Error', error.message);
    }
});

// ----- [ DELETE ] ----- //

/**
 * Delete Audit Log by ID
 * Protected Route: SUPER_ADMIN only
 * Use with caution - typically logs should not be deleted manually
 */
router.delete('/api/admin/logs/:id', authToken, authSuperAdmin, async (req, res) => {
    try {
        const log = await AuditLogModel.findByIdAndDelete(req.params.id);

        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Audit Log not Found'
            });
        }

        res.json({
            success: true,
            message: 'Audit Log Deleted',
            data: log
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Audit Log Delete Error',
            error: error.message
        });
        logger.dropError('API', 'Audit Log Delete Error', error.message);
    }
});

// Export Router
export default router;
