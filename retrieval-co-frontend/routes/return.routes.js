const express = require('express');
const router = express.Router();
const { generateQRSession, confirmQRReturn } = require('../controllers/return.controller');
const protect = require('../middlewares/auth.middleware');

router.post('/:id/generate-qr', protect, generateQRSession);
router.post('/confirm-qr', protect, confirmQRReturn);

module.exports = router;
