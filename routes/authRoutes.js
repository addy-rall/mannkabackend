// =============================================================================
// || AUTHENTICATION ROUTES                                                   ||
// =============================================================================
// || This file defines the API endpoints for all authentication-related      ||
// || actions (register, verify, login) and maps them to the corresponding    ||
// || controller functions.                                                   ||
// =============================================================================

const express = require('express');
const router = express.Router();
const {
    registerUser,
    
    loginUser
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Step 1 of Registration: Register user details, send phone OTP
router.post('/register', registerUser);

// @route   POST /api/auth/verify-phone


// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', loginUser);

module.exports = router;
