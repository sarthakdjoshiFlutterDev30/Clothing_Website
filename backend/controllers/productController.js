const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const resPerPage = 12;
  const page = parseInt(req.query.page, 10) || 1;

  let query = {};

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by subcategory
  if (req.query.subcategory) {
    query.subcategory = req.query.subcategory;
  }

  // Filter by brand
  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      query.price.$lte = parseFloat(req.query.maxPrice);
    }
  }

  // Filter by rating
  if (req.query.rating) {
    query.ratings = { $gte: parseFloat(req.query.rating) };
  }

  // Search by keyword
  if (req.query.keyword) {
    query.$text = { $search: req.query.keyword };
  }

  // Filter by featured
  if (req.query.featured) {
    query.isFeatured = req.query.featured === 'true';
  }

  // Filter by active status
  query.isActive = true;

  const skip = resPerPage * (page - 1);

  let products = Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(resPerPage);

  // Sort by price
  if (req.query.sort) {
    const sortBy = req.query.sort;
    if (sortBy === 'price-low') {
      products = products.sort({ price: 1 });
    } else if (sortBy === 'price-high') {
      products = products.sort({ price: -1 });
    } else if (sortBy === 'rating') {
      products = products.sort({ ratings: -1 });
    } else if (sortBy === 'newest') {
      products = products.sort({ createdAt: -1 });
    }
  }

  products = await products;

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    resPerPage,
    currentPage: page,
    totalPages: Math.ceil(total / resPerPage),
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Delete images from Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: 'Product already reviewed'
    });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.numOfReviews = product.reviews.length;

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Review added successfully'
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(8);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ 
    category: req.params.category,
    isActive: true 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search keyword'
    });
  }

  const products = await Product.find({
    $text: { $search: keyword },
    isActive: true
  }).sort({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});
