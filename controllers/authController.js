// =============================================================================
// || AUTHENTICATION CONTROLLER                                               ||
// =============================================================================
// || This file contains the business logic for handling all authentication   ||
// || requests. It interacts with the User model to perform database          ||
// || operations.                                                             ||
// =============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-secret-key-for-jwt';

// --- Controller for Registration ---
exports.registerUser = async (req, res) => {
    const { name, age, phone, email, city, state, password } = req.body;

    try {
        // Validate password strength
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({
                msg: 'Password must include at least one number and one uppercase letter'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            if (user.email === email) {
                return res.status(400).json({ msg: 'Email already registered' });
            }
            if (user.phone === phone) {
                return res.status(400).json({ msg: 'Phone number already registered' });
            }
        }

        // Create new user
        user = new User({
            name, 
            age, 
            phone, 
            email, 
            city, 
            state, 
            password
        });

        await user.save();

        // Generate JWT token
        const payload = { 
            user: { 
                id: user.id,
                email: user.email
            } 
        };

        jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '7d' }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ 
                    msg: 'User registered successfully',
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        state: user.state,
                        city: user.city,
                        age: user.age
                    }
                });
            }
        );

    } catch (err) {
        console.error('Registration Error:', err.message);
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ msg: errors.join(', ') });
        }
        
        // Handle duplicate key errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ msg: `${field} already exists` });
        }
        
        res.status(500).json({ msg: 'Server Error during registration' });
    }
};

// --- Controller for User Login ---
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email and password' });
        }

        // Find user by email
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // Generate JWT token
        const payload = { 
            user: { 
                id: user.id,
                email: user.email
            } 
        };

        jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '7d' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    msg: 'Login successful',
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        state: user.state,
                        city: user.city,
                        age: user.age
                    }
                });
            }
        );

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server Error during login' });
    }
};

// --- Controller for Getting User Profile ---
exports.getUserProfile = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('Get Profile Error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// --- Controller for Updating User Profile ---
exports.updateUserProfile = async (req, res) => {
    const { name, age, phone, state, city } = req.body;

    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (age) user.age = age;
        if (phone) user.phone = phone;
        if (state) user.state = state;
        if (city) user.city = city;

        await user.save();

        res.json({
            msg: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                state: user.state,
                city: user.city,
                age: user.age
            }
        });
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        
        // Handle duplicate phone number
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Phone number already in use' });
        }
        
        res.status(500).json({ msg: 'Server Error during update' });
    }
};

// --- Controller for Deleting User Account ---
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete Account Error:', err.message);
        res.status(500).json({ msg: 'Server Error during deletion' });
    }
};