// Import Required Modules
import mongoose from 'mongoose';

// Import Maintenance Package Schema
import mpSchema from '../schema/schema-mp.js';

// Create and Export Maintenance Package Model
const MaintenancePackage = mongoose.model('AMM-MP', mpSchema);

export default MaintenancePackage;
