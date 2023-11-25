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

// block & unblock user by id
router.patch(
  "/block/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.blockUserSchema),
  userController.blockUser
);

// get the number of users registered monthly for last year
router.get(
  "/monthly-users",
  isAuthenticated,
  isAdmin,
  userController.monthlyUsers
);

// get all users
router.get("/", isAuthenticated, isAdmin, userController.getUsers);

// get user by id
router.get(
  "/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.getUserSchema),
  userController.getUserById
);

// update user by id
router.patch(
  "/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.updateUserSchema),
  userController.updateUserById
);

// delete user by id
router.delete(
  "/:userId",
  isAuthenticated,
  isAdmin,
  isValid(userValidation.deleteUserSchema),
  userController.deleteUserById
);

export default router;
