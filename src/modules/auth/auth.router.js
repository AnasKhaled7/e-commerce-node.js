import { Router } from "express";

import { isValid } from "../../middlewares/index.js";
import * as authValidation from "./auth.validation.js";
import * as authController from "./auth.controller.js";

const router = Router();

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

export default router;
