const express = require('express');
const router = express.Router();
const { generateQRSession, confirmQRReturn, confirmManualReturn } = require('../controllers/return.controller');
const protect = require('../middlewares/auth.middleware');

router.post('/:id/generate-qr', protect, generateQRSession);
router.post('/confirm-qr', protect, confirmQRReturn);
router.post('/confirm-manual', protect, confirmManualReturn);

module.exports = router;
