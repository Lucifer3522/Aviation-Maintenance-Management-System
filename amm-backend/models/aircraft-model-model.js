// Import Required Modules
import mongoose from 'mongoose';

// Import Aircraft Model Schema
import aircraftModelSchema from '../schema/schema-aircraft-model.js';

// Create and Export Aircraft Model
const AircraftModel = mongoose.model('AMM-AircraftModel', aircraftModelSchema);

export default AircraftModel;
