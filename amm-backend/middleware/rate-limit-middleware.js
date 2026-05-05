const loginAttempts = new Map();

export const loginRateLimit = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const now = Date.now();
    const key = email.toLowerCase();
    
    let attempts = loginAttempts.get(key) || { count: 0, firstAttempt: now, blockedUntil: null };

    if (attempts.blockedUntil && now < attempts.blockedUntil) {
        const remainingTime = Math.ceil((attempts.blockedUntil - now) / 1000);
        return res.status(429).json({ 
            message: `Too many login attempts. Please try again in ${remainingTime} seconds`,
            retryAfter: remainingTime
        });
    }

    if (now - attempts.firstAttempt > 15000) {
        attempts = { count: 0, firstAttempt: now, blockedUntil: null };
    }

    loginAttempts.set(key, attempts);
    
    req.loginAttempt = {
        email: key,
        recordKey: key
    };

    next();
};

export const recordFailedAttempt = (email) => {
    const key = email.toLowerCase();
    const now = Date.now();
    
    let attempts = loginAttempts.get(key) || { count: 0, firstAttempt: now, blockedUntil: null };

    attempts.count++;

    if (attempts.count >= 5) {
        attempts.blockedUntil = now + 15000; 
    }

    loginAttempts.set(key, attempts);
};

export const recordSuccessfulLogin = (email) => {
    const key = email.toLowerCase();
    loginAttempts.delete(key);
};

export const getAttemptCount = (email) => {
    const key = email.toLowerCase();
    const attempts = loginAttempts.get(key);
    return attempts ? attempts.count : 0;
};

setInterval(() => {
    const now = Date.now();
    for (const [key, attempts] of loginAttempts.entries()) {
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
