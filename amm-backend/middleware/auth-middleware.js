// Import Required Modules
import jwt from 'jsonwebtoken';

// Authentication Middleware
export const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: "Access Token Required"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ message: "Invalid Access Token"});
        }
        req.user = user;
        next();
    });
};

export const authRole = (...roles) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(403).json({ message: "User not Authenticated"});
        }

        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "User not Authorized"});
        }

        next();
    };
};

// Roles
export const authSuperAdmin = authRole('SUPER_ADMIN');
export const authAdmin = authRole('SUPER_ADMIN', 'ADMIN');
export const authCAMO = authRole('SUPER_ADMIN', 'ADMIN', 'CAMO');
export const authMRO = authRole('SUPER_ADMIN', 'ADMIN', 'MRO');
export const authTech = authRole('SUPER_ADMIN', 'ADMIN', 'B1_TECH', 'B2_TECH', 'C_TECH');
export const authCRS = authRole('SUPER_ADMIN', 'ADMIN', 'CRS');
export const authManager = authRole('SUPER_ADMIN', 'ADMIN', 'CAMO', 'MRO');
export const authStaff = authRole('SUPER_ADMIN', 'ADMIN', 'MRO', 'B1_TECH', 'B2_TECH', 'C_TECH', 'CRS');

// Export Middleware
export default {
    authToken,
    authSuperAdmin,
    authAdmin,
    authCAMO,
    authMRO,
    authTech,
    authCRS,
    authManager,
    authStaff
}