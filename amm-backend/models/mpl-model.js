// Import Required Modules
import mongoose from 'mongoose';

// Import MPL Schema
import mplSchema from '../schema/schema-mpl.js';

// Create and Export MPL Model
const MPL = mongoose.model('AMM-MPL', mplSchema);

export default MPL;
