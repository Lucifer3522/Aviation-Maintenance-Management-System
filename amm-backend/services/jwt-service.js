// Get Required Modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// JWT Token Creator
const JWTToken = (id, role, organization) => {
    return jwt.sign({ 
        userId: id, 
        role: role, 
        organization: organization 
    }, process.env.JWT_SECRET, { 
        expiresIn: "30d" 
    });
};

// Export Service Module
export { JWTToken };
