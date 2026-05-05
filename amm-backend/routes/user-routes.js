// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';
import AuditLogModel from '../models/audit-log-model.js';

// Application Router
const router = express.Router();

// Import Models
import User from '../models/user-model.js';

// Get Requeired Middleware
import { authToken, authAdmin } from '../middleware/auth-middleware.js';

// ----- [ GET ] ----- //

// Get Users List
router.get("/api/get/users", authToken, authAdmin, async (req, res) => {
    try {
        const user_list = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(user_list);
    } catch (error) {
        res.status(500).json({ message: "User List Error", error: error.message });
        logger.dropError("API", "User List Error", error);
    }
});

router.get("/api/get/users/:id", authToken, authAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user) {
            return res.status(404).json({ message: "User not Found"});
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Get User Error", error: error.message });
        logger.dropError("API", "Get User Error", error);
    }
});

// ----- [ UPDATE ] ----- //

router.put(
    "/api/put/users/edit/:id",
    authToken,
    authAdmin,
    async (req, res) => {
        try {
            const { password, ...updateData } = req.body;

            const user = await User.findById(req.params.id);
            if(!user) {
                return res.status(404).json({ message: "User not Found"});
            }

            if (updateData.certifications !== undefined) {
                if (typeof updateData.certifications === 'string') {
                    updateData.certifications = updateData.certifications
                        .split(',')
                        .map(c => c.trim())
                        .filter(Boolean);
                }
            }

            if (updateData.username !== undefined) user.username = updateData.username;
            if (updateData.name !== undefined) user.name = updateData.name;
            if (updateData.email !== undefined) user.email = updateData.email;
            if (updateData.role !== undefined) user.role = updateData.role;
            if (updateData.organization !== undefined) user.organization = updateData.organization;
            if (updateData.licenseNumber !== undefined) user.licenseNumber = updateData.licenseNumber;
            if (updateData.certifications !== undefined) user.certifications = updateData.certifications;

            await user.save();

            const { password: _, ...safeData } = req.body;
            AuditLogModel.create({
                userId: req.user?.userId || req.user?.id || req.user?._id,
                actionType: 'USER_UPDATED',
                targetId: req.params.id,
                payload: safeData,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                timestamp: new Date()
            }).catch(err => logger.dropError('AUDIT', 'Failed to log user update', err.message));

            const userResponse = user.toObject();
            delete userResponse.password;

            res.json(userResponse);
        } catch (error) {
            logger.dropError("API", "Update User Error", error.message);
            res.status(500).json({ message: "Update User Error", error: error.message });
        }
    }
);

// ----- [ DELETE ] ----- //

// Delete User
router.delete(
    "/api/users/delete/:id",
    authToken,
    authAdmin,
    async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).json({ message: "User not Found"});
        }

        AuditLogModel.create({
            userId: req.user?.userId || req.user?.id || req.user?._id,
            actionType: 'USER_DELETED',
            targetId: req.params.id,
            payload: { message: 'User deleted' },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            timestamp: new Date()
        }).catch(err => logger.dropError('AUDIT', 'Failed to log user deletion', err.message));

        res.json({ message: "User Deleted"});
    } catch (error) {
        res.status(500).json({ message: "Delete User Error", error: error.message });
        logger.dropError("API", "Delete User Error", error);
    }
});

// Route Export
export default router;