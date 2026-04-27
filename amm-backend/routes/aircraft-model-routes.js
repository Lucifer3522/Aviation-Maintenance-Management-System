// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import AircraftModel from '../models/aircraft-model-model.js';
import MPD from '../models/mpd-model.js';

// Import Middleware
import { authToken } from '../middleware/auth-middleware.js';
import { auditLog } from '../middleware/audit-middleware.js';

// ----- [ GET ] ----- //

// Get Aircraft Models List
router.get("/api/get/aircraftModels", async (req, res) => {
    try {
        const aircraft_models = await AircraftModel.find().sort({ manufacturer: 1, model: 1});
        res.json(aircraft_models);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft Models Error", error: error.message });
        logger.dropError("API", "Aircraft Models Error", error);
    }
});

// Get Aircraft Model
router.get("/api/get/aircraftModels/:id", async (req, res) => {
    try {
        const aircraft_model = await AircraftModel.findById(req.params.id);
        
        if(!aircraft_model) {
            res.status(404).json({ message: "Aircraft Model not Found"});
        }
        res.json(aircraft_model);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft Model Error", error: error.message });
        logger.dropError("API", "Aircraft Model Error", error);
    }
});

// Get Aircraft Model MPDs
router.get("/api/get/aircraftModels/:id/mpd", async (req, res) => {
    try {
        const aircraft_model_mpd = await MPD.find({ aircraftModelId: req.params.id });
        res.json(aircraft_model_mpd);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft Model MPD Error", error: error.message });
        logger.dropError("API", "Aircraft Model MPD Error", error);
    }
});

// ----- [ POST ] ----- //

// Create Aircraft Model
router.post(
    "/api/post/aircraftModels/create",
    authToken,
    auditLog(
        'AIRCRAFT_MODEL_CREATED',
        (req) => req.body.id || 'new',
        (req) => ({
            manufacturer: req.body.manufacturer,
            model: req.body.model
        })
    ),
    async (req, res) => {
    try {
        const aircraft_model = new AircraftModel(req.body);
        await aircraft_model.save();

        res.status(201).json({ message: "Aircraft Model Created Successfully"});
    } catch( error ) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Aircraft Model Exists" });
        } else {
            res.status(500).json({ message: "Create Aircraft Model Error", error: error.message });
            logger.dropError("API", "Create Aircraft Model Error", error);
        }
    }
});

// Create Aircraft MPD
router.post("/api/post/aircraftModels/:id/mpd/create", async (req, res) => {
    try {
        const mpdData = {
            ...req.body,
            aircraftModelId: req.params.id,
        };

        const mpd = new MPD(mpdData);
        await mpd.save();

        res.status(201).json({ message: "Aircraft Model MPD Created"});
    } catch (error) {
        res.status(500).json({ message: "Create Aircraft Model MPD Error", error: error.message });
        logger.dropError("API", "Create Aircraft Model MPD Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update Aircraft Model
router.put(
    "/api/put/aircraftModels/update/:id",
    authToken,
    auditLog(
        'AIRCRAFT_MODEL_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const aircraft_model = await AircraftModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true });

        if(!aircraft_model) {
            return res.status(404).json({ message: "Aircraft Model not Found" });
        }

        res.json({ message: "Aircraft Model Updated Successfully"});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Aircraft Model not Exists" });
        } else {
            res.status(500).json({ message: "Update Aircraft Model Error", error: error.message });
            logger.dropError("API", "Update Aircraft Model Error", error);
        }
    }
});

// ----- [ DELETE ] ----- //

// Delete Aircraft Model
router.delete(
    "/api/delete/aircraftModels/delete/:id",
    authToken,
    auditLog(
        'AIRCRAFT_MODEL_DELETED',
        'params.id',
        (req) => ({ message: 'Aircraft model deleted' })
    ),
    async (req, res) => {
    try {
        const aircraft_models_count = await AircraftModel.countDocuments({ aircraftModelId: req.params.id });

        if(aircraft_models_count > 0 ) {
            return res.status(400).json({ message: "Not Deleted Aircraft Model" });
        }

        const mpd_count = await MPD.countDocuments({ aircraftModelId: req.params.id });
        
        if(mpd_count > 0 ) {
            return res.status(400).json({ message: "Not Deleted Aircraft Model MPDs" });
        }

        const aircraft_model = await AircraftModel.findByIdAndDelete(req.params.id);
        
        if(!aircraft_model) {
            return res.status(404).json({ message: "Aircraft Model not Found" });
        }

        res.json({ message: "Aircraft Model Deleted"});
    } catch (error) {
        res.status(500).json({ message: "Delete Aircraft Model Error", error: error.message });
        logger.dropError("API", "Delete Aircraft Model Error", error);
    }
});

// Export Router
export default router;