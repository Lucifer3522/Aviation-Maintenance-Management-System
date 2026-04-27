// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import User from '../models/user-model.js';

// Get Requeired Middleware
import { authToken, authAdmin } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

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

// Update User Role
router.put(
    "/api/put/users/edit/:id",
    authToken,
    authAdmin,
    auditLog(
        'USER_UPDATED',
        'params.id',
        (req) => {
            const { password, ...safely } = req.body;
            return safely;
        }
    ),
    async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { ...req.body },
            { new: true, runValidators: true }
        ).select('-password');

        if(!user) {
            return res.status(404).json({ message: "User not Found"});
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Update User Role Error", error: error.message });
        logger.dropError("API", "Update User Role Error", error);
    }
});

// ----- [ DELETE ] ----- //

// Delete User
router.delete(
    "/api/users/delete/:id",
    authToken,
    authAdmin,
    auditLog(
        'USER_DELETED',
        'params.id',
        (req) => ({ message: 'User deleted' })
    ),
    async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).json({ message: "User not Found"});
        }

        res.json({ message: "User Deleted"});
    } catch (error) {
        res.status(500).json({ message: "Delete User Error", error: error.message });
        logger.dropError("API", "Delete User Error", error);
    }
});

// Route Export
export default router;