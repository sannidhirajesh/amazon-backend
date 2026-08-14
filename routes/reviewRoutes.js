const express = require('express');
const router = express.Router();
const { updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Standalone review update/delete (creation lives under /api/products/{productId}/reviews)
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update own review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Not authorized
 *   delete:
 *     summary: Delete own review (or admin)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review removed
 *       403:
 *         description: Not authorized
 */
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;