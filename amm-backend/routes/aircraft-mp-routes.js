// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import MP from '../models/mp-model.js';

// Get Maintenance Package
router.get("/api/get/mp/:id", async (req, res) => {
    try {
        const mp = await MP.findById(req.params.id).populate('mpdItems.mpdId').populate('aircraftId');
        if (!mp) {
            return res.status(404).json({ message: "MP not Found" });
        }
        res.json(mp);
    } catch( error ) {
        res.status(500).json({ message: "MP Error", error: error.message });
        logger.dropError("API", "MP Error", error);
    }
});

// Export Router
export default router;