import { Router } from "express";

import {
  isAuthenticated,
  isAuthorized,
  isValid,
} from "../../middlewares/index.js";
import * as userValidation from "./user.validation.js";
import * as userController from "./user.controller.js";

const router = Router();

// logout
router.patch("/logout", isAuthenticated, userController.logout);

// block & unblock user by id or email or phone number
router.patch(
  "/block/:userId",
  isAuthenticated,
  isAuthorized(["manager", "admin"]),
  isValid(userValidation.blockUserSchema),
  userController.blockUser
);

// get the number of users registered monthly for last year
router.get(
  "/monthly-users",
  isAuthenticated,
  isAuthorized(["manager"]),
  userController.monthlyUsers
);

export default router;
