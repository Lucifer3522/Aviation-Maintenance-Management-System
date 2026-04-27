import dns from 'node:dns';
// Node.js'in DNS sorgularında IPv4'ü zorlamasını sağlar
dns.setDefaultResultOrder('ipv4first');

// Import Required Modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Local Modules
import logger from './utils/logger.js';
import authRoutes from './routes/auth-routes.js';

// Load Enviroment Variables
dotenv.config();

// Application
const app = express();

// Import Libraries to Application
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    logger.dropInfo("DATABASE", "MongoDB Connection", "Successfully");
})
.catch(error => {
    console.error("DATABASE:", error);
    logger.dropError("DATABASE", "MongoDB Connection Error", error);
});

// ----- [ APPLICATION GET ROUTES ] -----

import routerController from './routes/router.js';
app.use("/", routerController);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.dropInfo('SERVER', "Application Running on Port", PORT));