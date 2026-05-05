// Get Required Modules
import express from "express";
import { userRegister, userLogin, updatePassword, adminUpdatePassword } from '../controllers/auth-controller.js';
import { authToken } from '../middleware/auth-middleware.js';
import { authAdmin } from '../middleware/auth-middleware.js';
import { loginRateLimit } from '../middleware/rate-limit-middleware.js';

// Initialize Router
const router = express.Router();

// Auth Routes
router.post("/register", userRegister);
router.post("/login", loginRateLimit, userLogin);
router.put("/update-password/:userId", authToken, updatePassword);
router.put("/admin/update-password/:userId", authToken, authAdmin, adminUpdatePassword);

// Export Router
export default router;
