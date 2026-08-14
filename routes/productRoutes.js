const express = require('express');
const router = express.Router();
const {
  createProduct, getProducts, searchProducts, getProductById, updateProduct, deleteProduct
} = require('../controllers/productController');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalog, search, and reviews
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Full-text search products
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         example: headphones
 *     responses:
 *       200:
 *         description: Matching products
 *       400:
 *         description: Missing query param
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List products (filter, sort, paginate)
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price_asc, price_desc, rating] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Paginated product list
 *   post:
 *     summary: Create a product (seller/admin only)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, category, price]
 *             properties:
 *               name: { type: string, example: "Wireless Mouse" }
 *               description: { type: string, example: "Ergonomic wireless mouse" }
 *               brand: { type: string, example: "TechCo" }
 *               category: { type: string, example: "Electronics" }
 *               price: { type: number, example: 999 }
 *               discountPercent: { type: number, example: 10 }
 *               stock: { type: integer, example: 50 }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Not authorized (customer role)
 */
router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by id
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a product (owner seller or admin)
 *     tags: [Products]
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
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Not authorized
 *   delete:
 *     summary: Delete a product (owner seller or admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product removed
 *       403:
 *         description: Not authorized
 */
router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

/**
 * @swagger
 * /api/products/{productId}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of reviews
 *   post:
 *     summary: Add a review to a product
 *     tags: [Products]
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
 *             required: [rating, comment]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5, example: 5 }
 *               comment: { type: string, example: "Great product!" }
 *     responses:
 *       201:
 *         description: Review added
 *       400:
 *         description: Already reviewed
 */
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, addReview);

module.exports = router;