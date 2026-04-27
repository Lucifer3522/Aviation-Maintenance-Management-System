// Import Required Modules
import mongoose from 'mongoose';

// Import Service Bulletin Schema
import sbSchema from '../schema/schema-service-bulletin.js';

// Create and Export Service Bulletin Model
const ServiceBulletin = mongoose.model('AMM-SB', sbSchema);

export default ServiceBulletin;
