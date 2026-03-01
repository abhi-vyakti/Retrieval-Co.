const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/karma.controller');
const protect = require('../middlewares/auth.middleware');

// Public route or protected depending on preference. MVP uses public viewable board.
router.get('/leaderboard', getLeaderboard);

module.exports = router;
