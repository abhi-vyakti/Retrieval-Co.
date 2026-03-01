const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
// Dummy authentication for hackathon — finds or creates user
router.post('/login', async (req, res) => {
    try {
        const { code, password } = req.body;

        if (!code || !password) {
            return res.status(400).json({ error: 'College ID and password are required' });
        }

        // Find user or create dummy user in DB
        let user = await User.findOne({ collegeId: code });
        if (!user) {
            user = await User.create({
                collegeId: code,
                name: 'Hackathon User',
                email: `${code.toLowerCase()}@college.edu`,
                password: 'hashed_dummy_password', // Mock
                role: 'student'
            });
        }

        const payload = {
            id: user._id,
            code: user.collegeId,
            name: user.name,
            role: user.role
        };

        const secret = process.env.JWT_SECRET || 'hackathon_super_secret';
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: payload
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;
