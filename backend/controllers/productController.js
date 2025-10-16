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
function toNumber(value, fallback = 0) {
  if (value == null) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

exports.createProduct = asyncHandler(async (req, res, next) => {
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map(f => ({ public_id: f.filename || f.public_id || f.originalname, url: f.path }));
  } else if (req.body.images) {
    const urls = ensureArray(req.body.images);
    images = urls.filter(Boolean).map(url => ({ public_id: url, url }));
  }

  const payload = { ...req.body };

  // Normalize scalar fields coming from multipart
  const price = toNumber(payload.price, 0);
  const originalPrice = toNumber(payload.originalPrice, price);
  const discount = payload.discount != null ? toNumber(payload.discount, 0) : (originalPrice > 0 ? Math.max(0, Math.round((1 - price / originalPrice) * 100)) : 0);
  const stock = toNumber(payload.stock, 0);

  // Defaults to satisfy schema without changing UI
  payload.name = payload.name || 'Untitled Product';
  payload.description = payload.description || 'Description not provided';
  payload.category = payload.category || 'men';
  payload.subcategory = payload.subcategory || 'general';
  payload.brand = payload.brand || 'Generic';
  payload.price = price;
  payload.originalPrice = originalPrice;
  payload.discount = discount;
  payload.stock = stock;
  payload.isActive = payload.isActive != null ? payload.isActive : true;
  payload.isFeatured = payload.isFeatured != null ? payload.isFeatured : false;

  // Sizes
  let sizes = payload.sizes;
  if (typeof sizes === 'string') {
    try { sizes = JSON.parse(sizes); } catch { sizes = []; }
  }
  if (!Array.isArray(sizes) || sizes.length === 0) {
    sizes = [{ size: 'M', stock }];
  }
  payload.sizes = sizes;

  // Colors
  let colors = payload.colors;
  if (typeof colors === 'string') {
    try { colors = JSON.parse(colors); } catch { colors = []; }
  }
  if (!Array.isArray(colors) || colors.length === 0) {
    colors = [{ name: 'Default', hex: '#000000' }];
  }
  payload.colors = colors;

  // Tags
  let tags = payload.tags;
  if (typeof tags === 'string') {
    try { tags = JSON.parse(tags); } catch { tags = ensureArray(tags); }
  }
  payload.tags = Array.isArray(tags) ? tags : [];

  // Shipping info defaults
  payload.shippingInfo = payload.shippingInfo || { freeShipping: false, estimatedDelivery: '3-5 business days' };

  if (images.length) payload.images = images;

  const product = await Product.create(payload);

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

  const update = { ...req.body };
  if (update.price != null) update.price = toNumber(update.price);
  if (update.originalPrice != null) update.originalPrice = toNumber(update.originalPrice);
  if (update.discount != null) update.discount = toNumber(update.discount);
  if (update.stock != null) update.stock = toNumber(update.stock);
  if (req.files && req.files.length > 0) {
    const images = req.files.map(f => ({ public_id: f.filename || f.public_id || f.originalname, url: f.path }));
    update.images = images;
  }

  product = await Product.findByIdAndUpdate(req.params.id, update, {
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
