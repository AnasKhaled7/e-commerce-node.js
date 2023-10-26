const router = require("express").Router();

const { isValid } = require("../../middlewares");
const authValidation = require("./auth.validation");
const authController = require("./auth.controller");

// register
router.post(
  "/register",
  isValid(authValidation.registerSchema),
  authController.register
);

// login
router.post(
  "/login",
  isValid(authValidation.loginSchema),
  authController.login
);

// send reset password code to email
router.patch(
  "/reset-password-code",
  isValid(authValidation.sendResetPasswordCodeSchema),
  authController.sendResetPasswordCode
);

// reset password
router.patch(
  "/reset-password",
  isValid(authValidation.resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;
