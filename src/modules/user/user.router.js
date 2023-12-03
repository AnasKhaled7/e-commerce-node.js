import { Router } from "express";

import { isAuthenticated, isAdmin, isValid } from "../../middlewares/index.js";
import * as userValidation from "./user.validation.js";
import * as userController from "./user.controller.js";

const router = Router();

// get user profile
router.get("/profile", isAuthenticated, userController.getProfile);

// logout
router.post("/logout", isAuthenticated, userController.logout);

// update user profile
router.patch(
  "/profile",
  isAuthenticated,
  isValid(userValidation.updateProfileSchema),
  userController.updateProfile
);

// get the number of users registered monthly for last year
router.get(
  "/monthly-users",
  isAuthenticated,
  isAdmin,
  userController.monthlyUsers
);

// get all users
router.get(
  "/",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.getUsersSchema),
  userController.getUsers
);

// get user by id
router.get(
  "/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.userIdSchema),
  userController.getUserById
);

// block user by id
router.patch(
  "/block/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.blockUserSchema),
  userController.blockUser
);

// unblock user by id
router.patch(
  "/unblock/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.userIdSchema),
  userController.unblockUser
);

export default router;
