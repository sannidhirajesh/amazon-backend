const express = require('express');
const router = express.Router();
const {
  createProduct, getProducts, searchProducts, getProductById, updateProduct, deleteProduct
} = require('../controllers/productController');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Search must be defined BEFORE /:id so "search" isn't treated as an id
router.get('/search', searchProducts);

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

// Nested review routes
router.route('/:productId/reviews')
  .get(getProductReviews)
  .post(protect, addReview);

module.exports = router;
