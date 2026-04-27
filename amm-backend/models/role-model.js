// Import Required Modules
import mongoose from 'mongoose';

// Import Role Schema
import roleSchema from '../schema/schema-role.js';

// Create and Export Role Model
const Role = mongoose.model('AMM-Role', roleSchema);

export default Role;
