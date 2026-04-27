// Get Required Modules
import express from "express";
import { userRegister, userLogin } from '../controllers/auth-controller.js';

// Initialize Router
const router = express.Router();

// Auth Routes
router.post("/register", userRegister);
router.post("/login", userLogin);

// Export Router
export default router;
