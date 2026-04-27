// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Required Middleware
import { authToken, authMRO, authTech, authCRS } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

// Import Models
import MPTL from '../models/mptl-model.js';

// ----- [ GET ] ----- //

// Get MPT List
router.get("/api/get/mptList", authToken, async (req, res) => {
    try {
        let query = {};

        if(req.user.role === "MRO") {
            query = { mroOrganization: req.user.organization };
        } else if(['B1_TECH', 'B2_TECH', 'C_TECH'].includes(req.user.role)) {
            query = {
                $or: [
                    { 'tasks.assignedRole': req.user.role },
                    { 'tasks.assignedTo': req.user.userId }
                ]
            };
        }

        const mpt_list = await MPTL.find(query)
        .populate('mplId')
        .populate('aircraftId')
        .populate('createdBy', 'name email')
        .populate('tasks.assignedTo', 'name email role')
        .populate('tasks.mpdId')
        .sort({ createdAt: -1 });
    
        res.json(mpt_list);
    } catch( error ) {
        res.status(500).json({ message: "MPT List Error", error: error.message });
        logger.dropError("API", "MPT List Error", error);
    }
});

// Get Single MPTL by ID
router.get("/api/get/mptList/:id", authToken, async (req, res) => {
    try {
        const mptl = await MPTL.findById(req.params.id)
            .populate('mplId')
            .populate('aircraftId')
            .populate('createdBy', 'name email')
            .populate('tasks.assignedTo', 'name email role')
            .populate('tasks.mpdId');

        if (!mptl) {
            return res.status(404).json({ message: "MPTL not found" });
        }

        if (req.user.role === "MRO" && mptl.mroOrganization !== req.user.organization) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(mptl);
    } catch (error) {
        res.status(500).json({ message: "Get MPTL Error", error: error.message });
        logger.dropError("API", "Get MPTL Error", error);
    }
});

// ----- [ POST ] ----- //

// Create MPTL
router.post(
    "/api/post/mptList/create",
    authToken,
    authMRO,
    auditLog(
        'MPTL_CREATED',
        (req) => req.body.id || 'new',
        (req) => ({
            mpl: req.body.mplId,
            aircraft: req.body.aircraftId
        })
    ),
    async (req, res) => {
    try {
        const mptl_data = {
            ...req.body,
            mroOrganization: req.user.organization,
            createdBy: req.user.userId
        }

        const mptl = new MPTL(mptl_data);
        await mptl.save();

        res.status(201).json(mptl);
    } catch (error) {
        res.status(500).json({ message: "MPTL Creation Error", error: error.message });
        logger.dropError("API", "MPTL Creation Error", error);
    }
});

// Add Worklog to MPTL
router.post("/api/post/mptList/:id/tasks/:taskId/worklogs", authToken, authTech, async (req, res) => {
    try {
        const mptl = await MPTL.findById(req.params.id);

        if(!mptl) {
            return res.status(404).json({ message: "MPTL not Found"});
        }

        const task = mptl.tasks.id(req.params.taskId);
        
        if(!task) {
            return res.status(404).json({ message: "Task not Found"});
        }

        // Initialize workLogs array if it doesn't exist
        if (!task.workLogs) {
            task.workLogs = [];
        }

        task.workLogs.push({
            technicianId: req.user.userId,
            technicianName: req.user.name,
            ...req.body
        });

        await mptl.save();

        res.json(mptl);
    } catch (error) {
        res.status(500).json({ message: "Add Worklog Error", error: error.message });
        logger.dropError("API", "Add Worklog Error", error);
    }

});

// Issue MPTL
router.post("/api/post/mptList/:id/issue", authToken, authCRS, async (req, res) => {
    try {
        const mptl = await MPTL.findById(req.params.id);

        if(!mptl) {
            return res.status(404).json({ message: "MPTL not Found"});
        }

        if (mptl.completedTasks !== mptl.totalTasks) {
            return res.status(400).json({ message: "All Tasks not Completed" });
        }

        mptl.crsIssued = true;
        mptl.crsNumber = req.body.crsNumber;
        mptl.crsIssuedBy = req.user.userId;
        mptl.crsIssuedDate = new Date();
        mptl.crsNotes = req.body.crsNotes;
        mptl.overallStatus = 'Completed';
        
        await mptl.save();

        res.json(mptl);
    } catch (error) {
        res.status(500).json({ message: "Issue MPTL Error", error: error.message });
        logger.dropError("API", "Issue MPTL Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update MPTL
router.put(
    "/api/put/mptList/update/:id",
    authToken,
    authMRO,
    auditLog(
        'MPTL_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const mptl = await MPTL.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if(!mptl) {
            return res.status(404).json({ message: "MPTL not Found"});
        }

        res.json(mptl);
    } catch (error) {
        res.status(500).json({ message: "MPTL Update Error", error: error.message });
        logger.dropError("API", "MPTL Update Error", error);
    }
});

// ----- [ PATCH ] ----- //

// Update MPTL Task Status
router.patch("/api/patch/mptList/:id/tasks/:taskId", authToken, async (req, res) => {
    try {
        const mptl = await MPTL.findById(req.params.id);

        if(!mptl) {
            return res.status(404).json({ message: "MPTL not Found"});
        }

        const task = mptl.tasks.id(req.params.taskId);

        if(!task) {
            return res.status(404).json({ message: "Task not Found"});
        }
        
        // Check authorization - allow if user is admin/MRO, or if task is assigned to them, or if task matches their role
        const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MRO'].includes(req.user.role);
        const isAssignedToUser = task.assignedTo && task.assignedTo.toString() === req.user.userId;
        const matchesRole = task.assignedRole === req.user.role;
        
        if (!isAdmin && !isAssignedToUser && !matchesRole) {
            return res.status(403).json({ message: "Not Authorized to update this task" });
        }

        Object.assign(task, req.body);
        await mptl.save();
        
        res.json(mptl);
    } catch (error) {
        res.status(500).json({ message: "MPTL Task Update Error", error: error.message });
        logger.dropError("API", "MPTL Task Update Error", error);
    }
});

// Export Router
export default router;
