import { Order } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc      Create order
// @route     POST /api/v1/orders
// @access    Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems.length === 0)
    return next(new Error("No order items", { cause: 400 }));

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// @desc      Get logged in user orders
// @route     GET /api/v1/orders/my-orders
// @access    Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.orderId });

  res.status(200).json({ success: true, orders });
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
// @route     PATCH /api/v1/orders/:id/pay
// @access    Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc      Update order to delivered
// @route     PATCH /api/v1/orders/:id/deliver
// @access    Private (admin, manager)
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new Error("Order not found", { cause: 404 }));

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({ success: true, order });
});

// @desc      Get all orders
// @route     GET /api/v1/orders
// @access    Private (admin, manager)
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "id firstName lastName");

  res.status(200).json({ success: true, orders });
});
