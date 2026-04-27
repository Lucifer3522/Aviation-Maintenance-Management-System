// Import Required Modules
import express from 'express';
import logger from '../utils/logger.js';

// Application Router
const router = express.Router();

// Import Models
import Aircraft from '../models/aircraft-model.js';
import AircraftModel from '../models/aircraft-model-model.js';
import MP from '../models/mp-model.js';

// Get Required Services
import aircraftService from '../services/aircraft-service.js';

// Import Middleware
import { auditLog } from '../middleware/audit-middleware.js';
import { authToken } from '../middleware/auth-middleware.js';

// ----- [ GET ] ----- //

// Get Aircraft List
router.get("/api/get/aircraftList", async (req, res) => {
    try {
        const aircraft_list = await Aircraft.find().populate('aircraftModelId');
        res.json(aircraft_list);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft List Error", error: error.message });
        logger.dropError("API", "Aircraft List Error", error);
    }
});

// Get Aircraft
router.get("/api/get/aircraftList/:id", async (req, res) => {
    try {
        const aircraft = await aircraftService.getAircraft(req.params.id);
        if(!aircraft) {
            return res.status(404).json({ message: "Aircraft not Found" });
        }
        res.json(aircraft);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft Error", error: error.message });
        logger.dropError("API", "Aircraft Error", error);
    }
});

// Get Aircraft MPDs
router.get("/api/get/aircraftList/:id/mpd", async (req, res) => {
    try {
        const aircraft_mpds = await aircraftService.getMPDs(req.params.id);
        res.json(aircraft_mpds);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft MPD Error", error: error.message });
        logger.dropError("API", "Aircraft MPD Error", error);
    }
});

// Get Aircraft MPs
router.get("/api/get/aircraftList/:id/mp" , async (req, res) => {
    try {
        const aircraft_mps = await aircraftService.getMP(req.params.id);
        res.json(aircraft_mps);
    } catch( error ) {
        res.status(500).json({ message: "Aircraft MP Error", error: error.message });
        logger.dropError("API", "Aircraft MP Error", error);
    }
});

// ----- [ POST ] ----- //

// Add Aircraft
router.post(
    "/api/post/aircraftList/create",
    authToken,
    auditLog(
        'AIRCRAFT_CREATED',
        (req) => req.body.id || 'new',
        (req) => ({
            registration: req.body.registration,
            serialNumber: req.body.serialNumber,
            aircraftModelId: req.body.aircraftModelId
        })
    ),
    async (req, res) => {
    try {
        const aircraft = await aircraftService.createAircraft(req.body);
        res.status(201).json(aircraft);
    } catch (error) {
        res.status(500).json({ message: "Aircraft Creation Error", error: error.message });
        logger.dropError("API", "Aircraft Creation Error", error);
    }
});

// ----- [ PUT ] ----- //

// Update Aircraft
router.put(
    "/api/put/aircraftList/update/:id",
    authToken,
    auditLog(
        'AIRCRAFT_UPDATED',
        'params.id',
        (req) => req.body
    ),
    async (req, res) => {
    try {
        const aircraft = await Aircraft.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!aircraft) {
            return res.status(404).json({ message: "Aircraft not Found" });
        }

        res.json(aircraft);
    } catch (error) {
        res.status(500).json({ message: "Aircraft Update Error", error: error.message });
        logger.dropError("API", "Aircraft Update Error", error);
    }
});

// ----- [ DELETE ] ----- //

// Delete Aircraft
router.delete(
    "/api/delete/aircraftList/delete/:id",
    authToken,
    auditLog(
        'AIRCRAFT_DELETED',
        'params.id',
        (req) => ({ message: 'Aircraft deleted' })
    ),
    async (req, res) => {
    try {
        const aircraft_mp_count = await MP.countDocuments({ aircraftId: req.params.id });
        if (aircraft_mp_count > 0) {
            await MP.deleteMany({ aircraftId: req.params.id });
        }

        const aircraft = await Aircraft.findByIdAndDelete(req.params.id);
        
        if (!aircraft) {
            return res.status(404).json({ message: "Aircraft not Found" });
        }

        res.json({ message: "Aircraft Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Aircraft Deletion Error", error: error.message });
        logger.dropError("API", "Aircraft Deletion Error", error);
    }
});

// Export Router
export default router;