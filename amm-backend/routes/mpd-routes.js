// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import MPD from '../models/mpd-model.js';

// Import Middleware
import { authToken } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

// ----- [ GET ] ----- //

// Get MPD List
router.get("/api/get/mpd", async (req, res) => {
    try {
        const mpds = await MPD.find().sort({ createdAt: -1 });
        res.json(mpds);
    } catch( error ) {
        res.status(500).json({ message: "MPD List Error", error: error.message });
        logger.dropError("API", "MPD List Error", error);
    }
});

// ----- [ POST ] ----- //

// Create MPD
router.post(
    "/api/post/mpd/create",
    authToken,
    auditLog(
        'MPD_CREATED',
        (req) => req.body.id || 'new',
        (req) => ({
            maintenanceCode: req.body.maintenanceCode,
            description: req.body.description
        })
    ),
    async (req, res) => {
    try {
        const mpd = new MPD(req.body);
        await mpd.save();
        res.status(201).json(mpd);
    } catch (error) {
        res.status(500).json({ message: "Create MPD Error", error: error.message });
        logger.dropError("API", "Create MPD Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update MPD
router.put(
    "/api/put/mpd/update/:id",
    authToken,
    auditLog(
        'MPD_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const mpd = await MPD.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if(!mpd) {
            return res.status(404).json({ message: "MPD not Found"});
        }

        res.json(mpd);
    } catch (error) {
        res.status(500).json({ message: "Update MPD Error", error: error.message });
        logger.dropError("API", "Update MPD Error", error);
    }
});

// ----- [ DELETE ] ----- //

// Delete MPD
router.delete(
    "/api/delete/mpd/delete/:id",
    authToken,
    auditLog(
        'MPD_DELETED',
        'params.id',
        (req) => ({ message: 'MPD deleted' })
    ),
    async (req, res) => {
    try {
        const mpd = await MPD.findByIdAndDelete(req.params.id);

        if(!mpd) {
            return res.status(404).json({ message: "MPD not Found"});
        }
        res.json({ message: "MPD Deleted"});
    } catch (error) {
        res.status(500).json({ message: "Delete MPD Error", error: error.message });
        logger.dropError("API", "Delete MPD Error", error);
    }
});

// Export Router
export default router;