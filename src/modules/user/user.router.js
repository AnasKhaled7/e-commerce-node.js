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
router.post("/logout", isAuthenticated, userController.logout);

// get user profile
router.get("/profile", isAuthenticated, userController.getProfile);

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

// get all users
router.get(
  "/",
  isAuthenticated,
  isAuthorized(["manager"]),
  userController.getUsers
);

// get user by id
router.get(
  "/:userId",
  isAuthenticated,
  isAuthorized(["manager"]),
  isValid(userValidation.getUserSchema),
  userController.getUserById
);

// update user by id
router.patch(
  "/:userId",
  isAuthenticated,
  isAuthorized(["manager"]),
  isValid(userValidation.updateUserSchema),
  userController.updateUserById
);

// delete user by id
router.delete(
  "/:userId",
  isAuthenticated,
  isAuthorized(["manager"]),
  isValid(userValidation.deleteUserSchema),
  userController.deleteUserById
);

export default router;
