// Import Required Modules
import mongoose from 'mongoose';

// Import MPTL Schema
import mptlSchema from '../schema/schema-mptl.js';

// Create and Export MPTL Model
const MPTL = mongoose.model('AMM-MPTL', mptlSchema);

export default MPTL;
