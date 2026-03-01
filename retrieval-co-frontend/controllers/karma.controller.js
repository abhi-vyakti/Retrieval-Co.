const User = require('../models/User');

// @desc    Get Karma Leaderboard
// @route   GET /api/karma/leaderboard
// @access  Public (or Private depending on frontend)
const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
            .select('name collegeId karma role')
            .sort({ karma: -1 })
            .limit(10); // Top 10 users for MVP

        res.json({ message: 'Leaderboard fetched successfully', leaderboard: topUsers });
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    getLeaderboard
};
