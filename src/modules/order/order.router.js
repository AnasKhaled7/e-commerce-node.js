import { Router } from "express";

import { isAuthenticated, isAdmin, isValid } from "../../middlewares/index.js";
import * as orderValidation from "./order.validation.js";
import * as orderController from "./order.controller.js";

const router = Router();

// create order
router.post(
  "/",
  isAuthenticated,
  isValid(orderValidation.createOrderSchema),
  orderController.createOrder
);

// get logged in user orders
router.get("/my-orders", isAuthenticated, orderController.getMyOrders);

// get order by id
router.get("/:orderId", isAuthenticated, orderController.getOrderById);

// update order to paid
router.patch(
  "/:orderId/pay",
  isAuthenticated,
  isValid(orderValidation.updateOrderToPaidSchema),
  orderController.updateOrderToPaid
);

// update order to delivered
router.patch(
  "/:orderId/deliver",
  isAuthenticated,
  isAdmin,
  isValid(orderValidation.updateOrderToDeliveredSchema),
  orderController.updateOrderToDelivered
);

// get all orders
router.get("/", isAuthenticated, isAdmin, orderController.getAllOrders);

export default router;
