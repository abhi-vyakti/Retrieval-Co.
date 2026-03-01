const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/auth.middleware');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Protect against duplicate names
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

        // Return full URL to the image
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Server error during upload.' });
    }
});

module.exports = router;
