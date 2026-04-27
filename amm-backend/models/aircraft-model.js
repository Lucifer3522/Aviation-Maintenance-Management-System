// Import Required Modules
import mongoose from 'mongoose';

// Import Aircraft Schema
import aircraftSchema from '../schema/schema-aircraft.js';

// Create and Export Aircraft Model
const Aircraft = mongoose.model('AMM-Aircraft', aircraftSchema);

export default Aircraft;
