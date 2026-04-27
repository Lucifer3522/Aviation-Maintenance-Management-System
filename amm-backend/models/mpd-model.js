// Import Required Modules
import mongoose from 'mongoose';

// Import MPD Schema
import mpdSchema from '../schema/schema-mpd.js';

// Create and Export MPD Model
const MPD = mongoose.model('AMM-MPD', mpdSchema);

export default MPD;
