const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, addAddress } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registration, login, and profile management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Sannidhi" }
 *               email: { type: string, example: "sannidhi@example.com" }
 *               password: { type: string, example: "password123" }
 *               role: { type: string, enum: [customer, seller], example: "customer" }
 *     responses:
 *       201:
 *         description: User created, returns JWT token
 *       400:
 *         description: Missing fields or user already exists
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "customer@example.com" }
 *               password: { type: string, example: "customer123" }
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authorized
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Updated profile
 */
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /api/auth/addresses:
 *   post:
 *     summary: Add a shipping address
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [line1, city, state, pincode]
 *             properties:
 *               label: { type: string, example: "Home" }
 *               line1: { type: string, example: "123 MG Road" }
 *               city: { type: string, example: "Hubballi" }
 *               state: { type: string, example: "Karnataka" }
 *               pincode: { type: string, example: "580001" }
 *     responses:
 *       201:
 *         description: Address added
 */
router.post('/addresses', protect, addAddress);

module.exports = router;