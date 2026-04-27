// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Get Required Services
import aircraftService from '../services/aircraft-service.js';

// ----- [ PATCH ] ----- //

// Update MPD Status
router.patch("/api/patch/mp/:id/items/:itemId", async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const mp = await aircraftService.updateMPItemStatus(id, itemId, req.body);
        
        res.json(mp);
    } catch (error) {
        res.status(500).json({ message: "Update MPD Status Error", error: error.message });
        logger.dropError("API", "Update MPD Status Error", error);
    }
});

// Export Router
export default router;