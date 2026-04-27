// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import SB from '../models/service-bulletin-model.js';
import AircraftModel from '../models/aircraft-model-model.js';

// Import Required Middleware
import { authToken, authCAMO } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

// ----- [ GET ] ----- //

// Get SB List
router.get("/api/get/sbList", authToken, async (req, res) => {
    try {
        const sb_list = await SB.find()
            .populate('aircraftModelId')
            .sort({ issuedDate: -1, createdAt: -1 });

        res.json(sb_list);
    } catch (error) {
        res.status(500).json({ message: "SB List Error", error: error.message });
        logger.dropError("API", "SB List Error", error);
    }
});

// ----- [ POST ] ----- //

// Create SB
router.post(
    "/api/post/sbList/create",
    authToken,
    authCAMO,
    auditLog(
        'SERVICE_BULLETIN_CREATED',
        (req) => req.body.id || 'new',
        (req) => ({
            sbNumber: req.body.sbNumber,
            title: req.body.title
        })
    ),
    async (req, res) => {
    try {
        console.log('Creating SB with payload:', JSON.stringify(req.body, null, 2));
        const sb = new SB(req.body);
        await sb.save();

        res.status(201).json({ message: "SB Created" });
    } catch (error) {
        console.error('SB Creation Error Details:', error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                message: "Validation Error", 
                error: error.message,
                errors: validationErrors 
            });
        }
        res.status(500).json({ message: "SB Creation Error", error: error.message });
        logger.dropError("API", "SB Creation Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update SB
router.put(
    "/api/put/sbList/update/:id",
    authToken,
    authCAMO,
    auditLog(
        'SERVICE_BULLETIN_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const sb = await SB.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if(!sb) {
            return res.status(404).json({ message: "SB not Found"});
        }

        res.json(sb);
    } catch (error) {
        res.status(500).json({ message: "Update SB Error", error: error.message });
        logger.dropError("API", "Update SB Error", error);
    }
});

// ----- [ DELETE ] ----- //

// Delete SB
router.delete(
    "/api/delete/sbList/delete/:id",
    authToken,
    authCAMO,
    auditLog(
        'SERVICE_BULLETIN_DELETED',
        'params.id',
        (req) => ({ message: 'Service bulletin deleted' })
    ),
    async (req, res) => {
    try {
        const sb = await SB.findByIdAndDelete(req.params.id);

        if(!sb) {
            return res.status(404).json({ message: "SB not Found"});
        }

        res.json({ message: "SB Deleted"});
    } catch (error) {
        res.status(500).json({ message: "Delete SB Error", error: error.message });
        logger.dropError("API", "Delete SB Error", error);
    }
});

// Router Export
export default router;