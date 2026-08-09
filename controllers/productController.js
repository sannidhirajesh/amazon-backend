const Product = require('../models/Product');

// @desc    Create a product (seller/admin)
// @route   POST /api/products
// @access  Private (seller, admin)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, brand, category, price, discountPercent, stock, images } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({ message: 'name, description, category and price are required' });
    }

    const product = await Product.create({
      name, description, brand, category, price, discountPercent, stock, images,
      seller: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filters, pagination, sorting
// @route   GET /api/products?keyword=&category=&minPrice=&maxPrice=&sort=&page=&limit=
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { ratingsAverage: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalResults: total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Full-text search products
// @route   GET /api/products/search?q=keyword
// @access  Public
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query param "q" is required' });

    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(30);

    res.json({ query: q, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (owner seller or admin)
// @route   PUT /api/products/:id
// @access  Private (seller, admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const fields = ['name', 'description', 'brand', 'category', 'price', 'discountPercent', 'stock', 'images', 'isActive'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (owner seller or admin)
// @route   DELETE /api/products/:id
// @access  Private (seller, admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct, getProducts, searchProducts, getProductById, updateProduct, deleteProduct
};
