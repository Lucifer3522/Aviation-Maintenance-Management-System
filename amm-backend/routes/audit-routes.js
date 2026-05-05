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

router.get('/api/admin/logs', authToken, authSuperAdmin, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.actionType) {
            filter.actionType = req.query.actionType;
        }

        if (req.query.userId) {
            filter.userId = req.query.userId;
        }

        if (req.query.startDate || req.query.endDate) {
            filter.timestamp = {};
            if (req.query.startDate) {
                filter.timestamp.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.timestamp.$lte = new Date(req.query.endDate);
            }
        }

        const logs = await AuditLogModel.find(filter)
            .populate('userId', 'username email role organization')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await AuditLogModel.countDocuments(filter);

        const totalPages = Math.ceil(total / limit);

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

router.get('/api/admin/logs/stats/summary', authToken, authSuperAdmin, async (req, res) => {
    try {
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

        const totalLogs = await AuditLogModel.countDocuments();

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
