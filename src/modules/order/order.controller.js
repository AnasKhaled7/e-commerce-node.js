import { Order, Product } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc      Create order
// @route     POST /api/v1/orders
// @access    Private
export const createOrder = asyncHandler(async (req, res, next) => {
  if (req.body.orderItems.length === 0)
    return next(new Error("No order items", { cause: 400 }));

  const order = await Order.create({
    user: req.user.id,
    orderItems: req.body.orderItems,
    shippingAddress: req.body.shippingAddress,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    phone: req.body.phone,
    totalPrice: req.body.totalPrice,
  });

  // decrease countInStock of ordered products & increase sold of ordered products
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    product.countInStock -= item.quantity;
    product.sold += item.quantity;

    await product.save();
  }

  res.status(201).json({ success: true, order });
});

// @desc      Get logged in user orders
// @route     GET /api/v1/orders/my-orders
// @access    Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        totalPrice: 1,
        status: 1,
        createdAt: 1,
      },
    },
  ]);
  res.status(200).json(orders);
});

// @desc      Get order by id
// @route     GET /api/v1/orders/:id
// @access    Private
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate(
    "user",
    "firstName lastName email"
  );

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  res.status(200).json(order);
});

// @desc      Update order to paid
// @route     PATCH /api/v1/orders/:orderId/pay
// @access    Private/Admin
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc      Update order to delivered
// @route     PATCH /api/v1/orders/:orderId/deliver
// @access    Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order.isDelivered = true;
  order.status = "delivered";
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc      Get all orders
// @route     GET /api/v1/orders
// @access    Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  let { page, limit } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;

  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Order.countDocuments();

  res.status(200).json({
    success: true,
    orders,
    numberOfOrders: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});
