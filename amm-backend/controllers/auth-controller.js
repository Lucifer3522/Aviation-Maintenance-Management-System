// Get Required Modules
import UserModel from '../models/user-model.js';
import dotenv from 'dotenv';

// Load Enviroment Variables
dotenv.config();

// Import Local Libraries
import logger from '../utils/logger.js';
import { JWTToken } from '../services/jwt-service.js';

// Register User
async function userRegister(req, res) {
    try {
        const { username, name , email, password, role, organization, licenseNumber, certifications } = req.body;
        
        const user_exists = await UserModel.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (user_exists) return res.status(400).json({ message: "User Already Exists" });

        const user = await UserModel.create({ 
            username: username || email.split('@')[0],
            name: name || username, 
            email, 
            password, 
            role: role || 'MRO', 
            organization: organization || 'Default Organization',
            licenseNumber,
            certifications: certifications || []
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            organization: user.organization,
            token: JWTToken(user.id, user.role, user.organization),
        });
    } catch (error) {
        logger.dropError("AUTH", "User Registration Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// User Login
async function userLogin(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await UserModel.findOne({ 
            $or: [{ email }, { username: email }] 
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user.id,
                username: user.username,
                name: user.name || user.username,
                email: user.email,
                role: user.role,
                organization: user.organization,
                licenseNumber: user.licenseNumber,
                certifications: user.certifications,
                token: JWTToken(user.id, user.role, user.organization),
            });
        } else {
            res.status(401).json({ message: "Unknown Authentication" });
        }
    } catch (error) {
        logger.dropError("AUTH", "User Login Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Export Controller
export {
    userRegister,
    userLogin,
};