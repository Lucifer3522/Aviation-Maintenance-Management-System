// Rate Limiter Middleware for Login Attempts
// Tracks failed login attempts and blocks after 5 failures for 15 seconds

const loginAttempts = new Map();

/**
 * Rate limit middleware for login
 * Blocks login after 5 failed attempts for 15 seconds
 */
export const loginRateLimit = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const now = Date.now();
    const key = email.toLowerCase();
    
    // Get or initialize attempt record
    let attempts = loginAttempts.get(key) || { count: 0, firstAttempt: now, blockedUntil: null };

    // Check if user is currently blocked
    if (attempts.blockedUntil && now < attempts.blockedUntil) {
        const remainingTime = Math.ceil((attempts.blockedUntil - now) / 1000);
        return res.status(429).json({ 
            message: `Too many login attempts. Please try again in ${remainingTime} seconds`,
            retryAfter: remainingTime
        });
    }

    // Reset if 15 seconds have passed since first attempt
    if (now - attempts.firstAttempt > 15000) {
        attempts = { count: 0, firstAttempt: now, blockedUntil: null };
    }

    // Store updated attempts
    loginAttempts.set(key, attempts);
    
    // Pass attempt info to controller
    req.loginAttempt = {
        email: key,
        recordKey: key
    };

    next();
};

/**
 * Record a failed login attempt
 */
export const recordFailedAttempt = (email) => {
    const key = email.toLowerCase();
    const now = Date.now();
    
    let attempts = loginAttempts.get(key) || { count: 0, firstAttempt: now, blockedUntil: null };

    attempts.count++;

    // If 5 failed attempts, block for 15 seconds
    if (attempts.count >= 5) {
        attempts.blockedUntil = now + 15000; // 15 seconds
    }

    loginAttempts.set(key, attempts);
};

/**
 * Record a successful login (reset attempts)
 */
export const recordSuccessfulLogin = (email) => {
    const key = email.toLowerCase();
    loginAttempts.delete(key);
};

/**
 * Get current attempt count for an email
 */
export const getAttemptCount = (email) => {
    const key = email.toLowerCase();
    const attempts = loginAttempts.get(key);
    return attempts ? attempts.count : 0;
};

// Optional: Cleanup old entries every 30 minutes to prevent memory leak
setInterval(() => {
    const now = Date.now();
    for (const [key, attempts] of loginAttempts.entries()) {
        // Remove if no attempts in last 30 minutes
        if (now - attempts.firstAttempt > 30 * 60 * 1000) {
            loginAttempts.delete(key);
        }
    }
}, 30 * 60 * 1000);

export default {
    loginRateLimit,
    recordFailedAttempt,
    recordSuccessfulLogin,
    getAttemptCount
};
