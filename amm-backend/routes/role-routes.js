// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Get Required Middleware
import { authToken, authSuperAdmin } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

// Import Models
import Role from '../models/role-model.js';
import User from '../models/user-model.js';

// ----- [ GET ] ----- //

// Get Roles List
router.get("/api/get/roles", authToken, async (req, res) => {
    try {
        const roles = await Role.find().sort({ name: 1 });
        res.json(roles);
    } catch( error ) {
        res.status(500).json({ message: "Roles List Error", error: error.message });
        logger.dropError("API", "Roles List Error", error);
    }
});

// Get Role
router.get("/api/get/roles/:id", authToken, async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        
        if (!role) {
            return res.status(404).json({ message: "Role not Found" });
        }
        
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: "Get Role Error", error: error.message });
        logger.dropError("API", "Get Role Error", error);
    }
});

// ----- [ POST ] ----- //

// Create Role
router.post(
    "/api/post/roles/create",
    authToken,
    authSuperAdmin,
    auditLog(
        'ROLE_CREATED',
        (req) => req.body.id || req.body.name,
        (req) => ({
            name: req.body.name,
            permissions: req.body.permissions
        })
    ),
    async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).json({ message: "Role Already Exists" });
        }
        res.status(500).json({ message: "Create Role Error", error: error.message });
        logger.dropError("API", "Create Role Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update Role
router.put(
    "/api/put/roles/update/:id",
    authToken,
    authSuperAdmin,
    auditLog(
        'ROLE_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if(!role) {
            return res.status(404).json({ message: "Role not Found"});
        }

        if (role.isSystem && (req.body.name || req.body.isSystem !== undefined)) {
            return res.status(400).json({ 
                message: "Can not Modify System Role" 
            });
        }
        
        Object.assign(role, req.body);
        await role.save();
        
        res.json(role);
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).json({ message: "Role Already Exists" });
        }
        res.status(500).json({ message: "Update Role Error", error: error.message });
        logger.dropError("API", "Update Role Error", error);
    }
});

// ----- [ DELETE ] ----- //

// Delete Role
router.delete(
    "/api/delete/roles/delete/:id",
    authToken,
    authSuperAdmin,
    auditLog(
        'ROLE_DELETED',
        'params.id',
        (req) => ({ message: 'Role deleted' })
    ),
    async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if(!role) {
            return res.status(404).json({ message: "Role not Found"});
        }

        if (role.isSystem) {
            return res.status(400).json({ 
                message: "Can not Delete System Role" 
            });
        }

        const user_count = await User.countDocuments({ role: role.name });

        if (user_count > 0) {
            return res.status(400).json({ 
                message: "Can not Delete Role. Some Users have this Role" 
            });
        }

        await role.deleteOne();

        res.json({ message: "Role Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete Role Error", error: error.message });
        logger.dropError("API", "Delete Role Error", error);
    }
});

// Export Router
export default router;