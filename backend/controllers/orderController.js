const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingInfo, paymentInfo } = req.body;

  // Calculate prices
  let itemsPrice = 0;
  const orderItemsWithPrices = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.product}`
      });
    }

    const price = product.price * item.quantity;
    itemsPrice += price;

    orderItemsWithPrices.push({
      product: item.product,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.images[0].url
    });
  }

  // Calculate tax (10% of items price)
  const taxPrice = itemsPrice * 0.1;

  // Calculate shipping (free if order > $100, otherwise $10)
  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const order = await Order.create({
    user: req.user._id,
    orderItems: orderItemsWithPrices,
    shippingInfo,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: itemsPrice + taxPrice + shippingPrice
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user owns order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this order'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });

  let totalAmount = 0;
  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount,
    data: orders
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  if (order.orderStatus === 'Delivered') {
    return res.status(400).json({
      success: false,
      message: 'You have already delivered this order'
    });
  }

  if (req.body.orderStatus === 'Shipped') {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });
  }

  order.orderStatus = req.body.orderStatus;

  if (req.body.orderStatus === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});

// Helper function to update stock
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  if (product.stock >= quantity) {
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
}
