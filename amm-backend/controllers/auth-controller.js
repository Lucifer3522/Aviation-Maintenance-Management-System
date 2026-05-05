// Get Required Modules
import UserModel from '../models/user-model.js';
import dotenv from 'dotenv';

// Load Enviroment Variables
dotenv.config();

// Import Local Libraries
import logger from '../utils/logger.js';
import { JWTToken } from '../services/jwt-service.js';
import { recordFailedAttempt, recordSuccessfulLogin } from '../middleware/rate-limit-middleware.js';

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
            // Record successful login (reset rate limit counter)
            recordSuccessfulLogin(email);
            
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
            // Record failed login attempt
            recordFailedAttempt(email);
            
            res.status(401).json({ message: "Unknown Authentication" });
        }
    } catch (error) {
        logger.dropError("AUTH", "User Login Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Update User Password
async function updatePassword(req, res) {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ 
                message: "Current password, new password, and confirmation are required" 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                message: "New passwords do not match" 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: "New password must be at least 6 characters" 
            });
        }

        // Find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Current password is incorrect" 
            });
        }

        // Update password - this will trigger the pre-save hook
        user.password = newPassword;
        await user.save();

        logger.dropInfo("AUTH", `Password updated for user ${user.email}`, "Success");

        res.json({ 
            message: "Password updated successfully" 
        });
    } catch (error) {
        logger.dropError("AUTH", "Update Password Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Admin Update User Password (bypass current password verification)
async function adminUpdatePassword(req, res) {
    try {
        const { userId } = req.params;
        const { newPassword, confirmPassword } = req.body;

        // Validate input
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ 
                message: "New password and confirmation are required" 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                message: "New passwords do not match" 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: "New password must be at least 6 characters" 
            });
        }

        // Find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update password - this will trigger the pre-save hook
        user.password = newPassword;
        await user.save();

        logger.dropInfo("AUTH", `Password updated by admin for user ${user.email}`, "Success");

        res.json({ 
            message: "Password updated successfully" 
        });
    } catch (error) {
        logger.dropError("AUTH", "Admin Update Password Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Export Controller
export {
    userRegister,
    userLogin,
    updatePassword,
    adminUpdatePassword,
};