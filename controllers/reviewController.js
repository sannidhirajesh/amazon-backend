const Review = require('../models/Review');
const Product = require('../models/Product');

// Recalculate and store a product's average rating and review count
const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: stats.length ? +stats[0].avgRating.toFixed(1) : 0,
    numReviews: stats.length ? stats[0].count : 0
  });
};

// @desc    Add a review to a product
// @route   POST /api/products/:productId/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) return res.status(400).json({ message: 'rating and comment are required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment
    });

    await recalcProductRating(product._id);

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment) review.comment = req.body.comment;
    await review.save();

    await recalcProductRating(review.product);
    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own review (or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();
    await recalcProductRating(productId);

    res.json({ message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getProductReviews, updateReview, deleteReview };
