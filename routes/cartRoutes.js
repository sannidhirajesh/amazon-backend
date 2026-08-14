const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // every cart route requires login

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get logged-in user's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Current cart contents
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId: { type: string, example: "665f1a2b3c4d5e6f7a8b9c0d" }
 *               quantity: { type: integer, example: 2, default: 1 }
 *     responses:
 *       201:
 *         description: Item added to cart
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, example: 3 }
 *     responses:
 *       200:
 *         description: Cart item updated
 *   delete:
 *     summary: Remove one item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed
 */
router.route('/:productId')
  .put(updateCartItem)
  .delete(removeCartItem);

module.exports = router;