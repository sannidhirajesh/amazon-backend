const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Mock payment processing (not a real gateway)
 */

/**
 * @swagger
 * /api/payments/{orderId}:
 *   post:
 *     summary: Simulate processing payment for an order (mock, not a real gateway)
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method: { type: string, enum: [card, upi, cod], example: "upi" }
 *               cardNumberLast4: { type: string, example: "4242" }
 *     responses:
 *       200:
 *         description: Payment successful (mock), order marked as paid
 *       400:
 *         description: Already paid
 *       403:
 *         description: Not authorized
 */
router.post('/:orderId', protect, processPayment);

module.exports = router;