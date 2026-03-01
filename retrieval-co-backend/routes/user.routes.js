const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/users/me (protected)
router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'User profile fetched successfully', user: req.user });
});

module.exports = router;
