const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Generate a Secure QR Session Token for a Post
// @route   POST /api/return/:id/generate-qr
// @access  Private
const generateQRSession = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Only the original post owner should be generating a code for someone else to scan
        if (post.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: 'Not authorized: Only the post owner can generate a return code.' });
        }

        if (post.returnConfirmedAt) {
            return res.status(400).json({ error: 'This item has already been marked as returned.' });
        }

        // Create a secure JWT for the QR payload valid for 10 minutes
        const secureToken = jwt.sign(
            { postId: post._id, ownerId: post.author },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.json({
            message: 'QR Token generated',
            qrData: {
                postId: post._id,
                ownerId: post.author,
                token: secureToken
            }
        });
    } catch (error) {
        console.error('Error in generateQRSession:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Confirm a physical return via QR Scan
// @route   POST /api/return/confirm-qr
// @access  Private
const confirmQRReturn = async (req, res) => {
    try {
        const { postId, ownerId, token } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Safeguard 1: Ensure it hasn't already been returned (Prevent Double Karma)
        if (post.returnConfirmedAt || post.status === 'returned') {
            return res.status(400).json({ error: 'Return already confirmed. Karma has already been awarded.' });
        }

        // Safeguard 2: The person SCANNING the code (req.user) is the FINDER.
        // The QR code contains the OWNER's ID. Validate that the owner ID is indeed the post author.
        if (post.author.toString() !== ownerId) {
            return res.status(403).json({ error: 'Invalid QR code. Owner mismatch.' });
        }

        // Note: We also assume req.user is the finder who physically scanned it.
        // We shouldn't let the owner scan their own code to get phantom karma.
        if (req.user.id.toString() === ownerId) {
            return res.status(400).json({ error: 'You cannot scan your own return code.' });
        }

        // Validate `token` securely
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.postId !== postId || decoded.ownerId !== ownerId) {
                return res.status(403).json({ error: 'QR token payload mismatch. Invalid code.' });
            }
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired QR code. Please ask the owner to generate a new one.' });
        }

        // Mark Post as Returned
        post.status = 'returned';
        post.returnConfirmedAt = new Date();
        post.returnMethod = 'qr';

        await post.save();

        // Award Karma to Finder (the one who scanned)
        const finder = await User.findById(req.user.id);
        if (finder) {
            finder.karma = (finder.karma || 0) + 50; // Award 50 points
            await finder.save();
        }

        res.json({ message: 'Return confirmed successfully and Karma awarded!' });
    } catch (error) {
        console.error('Error in confirmQRReturn:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    generateQRSession,
    confirmQRReturn
};
