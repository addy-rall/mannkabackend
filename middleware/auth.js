// =============================================================================
// || AUTHENTICATION MIDDLEWARE                                               ||
// =============================================================================
// || This middleware verifies JWT tokens and protects routes that require    ||
// || authentication. It extracts the user ID from the token and attaches it  ||
// || to the request object.                                                  ||
// =============================================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-secret-key-for-jwt';

module.exports = function(req, res, next) {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};