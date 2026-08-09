const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/:orderId', protect, processPayment);

module.exports = router;
