// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Required Middleware
import { authToken, authCAMO } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

// Import Models
import MPL from '../models/mpl-model.js';

// ----- [ GET ] ----- //

// Get MPL List
router.get("/api/get/mpList", authToken, async (req, res) => {
    try {
        let query = {};
        if(req.user.role === "MRO") {
            query = { sentToMRO: true, mroOrganization: req.user.organization };
        } else {
            query = { camoOrganization: req.user.organization };
        }

        const mp_list = await MPL.find(query)
            .populate('aircraftId')
            .populate('mpdId')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(mp_list);
    } catch( error ) {
        res.status(500).json({ message: "MPL List Error", error: error.message });
        logger.dropError("API", "MPL List Error", error);
    }
});


// Get MPL
router.get("/api/get/mpList/:id", authToken, async (req, res) => {
    try {
        console.log('Getting MPL with ID:', req.params.id);
        
        if (!req.params.id || req.params.id === 'undefined') {
            return res.status(400).json({ message: "Invalid MPL ID" });
        }

        const mpl = await MPL.findById(req.params.id)
            .populate('aircraftId')
            .populate('mpdId')
            .populate('createdBy', 'name email');

        if(!mpl) {
            return res.status(404).json({ message: "MPL not Found"});
        }

        res.json(mpl);
    } catch (error) {
        console.error('Get MPL Error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid MPL ID format", error: error.message });
        }
        res.status(500).json({ message: "Get MPL Error", error: error.message });
        logger.dropError("API", "Get MPL Error", error);
    }
});

// ----- [ POST ] ----- //

// Create MPL
router.post(
    "/api/post/mpList/create",
    authToken,
    authCAMO,
    auditLog(
        'MPL_CREATED',
        (req) => req.body.id || 'new',
        (req) => ({
            aircraft: req.body.aircraftId,
            mpd: req.body.mpdId
        })
    ),
    async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "User not Authenticated" });
        }

        const mpl_data = {
            ...req.body,
            camoOrganization: req.user.organization,
            createdBy: req.user.userId
        }

        const mpl = new MPL(mpl_data);
        await mpl.save();

        res.status(201).json({ message: "MPL Created", mpl });
    } catch (error) {
        console.error('MPL Creation Error Details:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                message: "Validation Error", 
                error: error.message,
                errors: validationErrors 
            });
        }
        res.status(500).json({ message: "Create MPL Error", error: error.message });
        logger.dropError("API", "Create MPL Error", error);
    }
});

// Send MPL to MRO
router.post("/api/post/mpList/:id/send", authToken, authCAMO, async (req, res) => {
    try {
        const mpl = await MPL.findByIdAndUpdate(
            req.params.id,
            { 
                sentToMRO: true,
                sentToMRODate: new Date(),
                mroOrganization: req.body.mroOrganization,
            },
            { new: true, runValidators: true }
        );

        if(!mpl) {
            return res.status(404).json({ message: "MPL not Found"});
        }

        res.json(mpl);
    } catch (error) {
        res.status(500).json({ message: "Send MPL to MRO Error", error: error.message });
        logger.dropError("API", "Send MPL to MRO Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update MPL
router.put(
    "/api/put/mpList/update/:id",
    authToken,
    authCAMO,
    auditLog(
        'MPL_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const mpl = await MPL.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if(!mpl) {
            return res.status(404).json({ message: "MPL not Found"});
        }

        res.json(mpl);
    } catch (error) {
        res.status(500).json({ message: "Update MPL Error", error: error.message });
        logger.dropError("API", "Update MPL Error", error);
    }
});

// ----- [ DELETE ] ----- //

// Delete MPL
router.delete(
    "/api/delete/mpList/delete/:id",
    authToken,
    authCAMO,
    auditLog(
        'MPL_DELETED',
        'params.id',
        (req) => ({ message: 'MPL deleted' })
    ),
    async (req, res) => {
    try {
        const mpl = await MPL.findByIdAndDelete(req.params.id);

        if(!mpl) {
            return res.status(404).json({ message: "MPL not Found"});
        }

        res.json({ message: "MPL Deleted"});
    } catch (error) {
        res.status(500).json({ message: "Delete MPL Error", error: error.message });
        logger.dropError("API", "Delete MPL Error", error);
    }
});

// Export Router
export default router;