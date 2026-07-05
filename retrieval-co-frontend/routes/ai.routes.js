const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { parsePostText, analyzeImage, findMatches, chatWithBot } = require('../controllers/ai.controller');
const jwt = require('jsonwebtoken');

// Optional auth — attaches req.user if token present, never blocks
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            req.user = jwt.verify(token, process.env.JWT_SECRET || 'hackathon_super_secret');
        } catch (_) { /* invalid token — proceed as guest */ }
    }
    next();
};

// POST /api/ai/parse-post -> Parse natural language text
router.post('/parse-post', authMiddleware, parsePostText);

// POST /api/ai/analyze-image -> Classify image via AI vision
router.post('/analyze-image', authMiddleware, analyzeImage);

// POST /api/ai/find-matches -> Find potential Lost<->Found matches
router.post('/find-matches', authMiddleware, findMatches);

// POST /api/ai/chat -> Requestly AI floating bot (public — no auth required)
router.post('/chat', optionalAuth, chatWithBot);

module.exports = router;
