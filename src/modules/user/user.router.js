const router = require("express").Router();

const { isAuthorized, isAuthenticated, isValid } = require("../../middlewares");
const userValidation = require("./user.validation");
const userController = require("./user.controller");

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

module.exports = router;
