const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { parsePostText, analyzeImage, findMatches, chatWithBot } = require('../controllers/ai.controller');

// POST /api/ai/parse-post -> Parse natural language text
router.post('/parse-post', authMiddleware, parsePostText);

// POST /api/ai/analyze-image -> Classify image via AI vision
router.post('/analyze-image', authMiddleware, analyzeImage);

// POST /api/ai/find-matches -> Find potential Lost<->Found matches
router.post('/find-matches', authMiddleware, findMatches);

// POST /api/ai/chat -> Requestly AI floating bot
router.post('/chat', authMiddleware, chatWithBot);

module.exports = router;
