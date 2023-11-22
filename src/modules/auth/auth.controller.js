import crypto from "crypto";

import { User, Cart } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";
import generateToken from "../../utils/generateToken.js";
import sendEmail from "../../utils/sendEmail.js";

// @desc     Register
// @route    POST /api/v1/auth/register
// @access   Public
export const register = asyncHandler(async (req, res, next) => {
  // check user existence
  const isUserExist = await User.findOne({ email: req.body.email });
  if (isUserExist)
    return next(new Error("User already exists", { cause: 409 }));

  // create user
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  // create cart
  await Cart.create({ user: user._id });

  // generate token
  generateToken(res, user._id);

  // return user data without password and __v fields
  const { password, __v, ...userData } = user._doc;
  return res.status(201).json(userData);
});

// @desc     Login
// @route    POST /api/v1/auth/login
// @access   Public
export const login = asyncHandler(async (req, res, next) => {
  // check user existence
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("Invalid credentials", { cause: 400 }));

  // check password
  const isMatch = await user.matchPassword(req.body.password);
  if (!isMatch) return next(new Error("Invalid credentials", { cause: 400 }));

  // generate token
  generateToken(res, user._id);

  // return user data without password and __v fields
  const { password, __v, ...userData } = user._doc;
  return res.status(200).json(userData);
});

// @desc     Send reset password code to email
// @route    PATCH /api/v1/auth/reset-password-code
// @access   Public
export const sendResetPasswordCode = asyncHandler(async (req, res, next) => {
  // check user existence
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // generate code
  const code = crypto.randomBytes(3).toString("hex");
  user.resetPasswordCode = code;
  await user.save();

  // send email
  const isSent = await sendEmail({
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "Reset Password Code",
    html: `<h1>${code}</h1>`,
  });

  return isSent
    ? res.status(200).json({ success: true, message: "Email Sent" })
    : next(new Error("Email not sent", { cause: 500 }));
});

// @desc     Reset password
// @route    PATCH /api/v1/auth/reset-password
// @access   Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // check user existence
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check code
  if (user.resetPasswordCode !== req.body.code)
    return next(new Error("Invalid code", { cause: 400 }));

  // update password
  user.password = req.body.password;
  user.resetPasswordCode = undefined;
  await user.save();

  return res.status(200).json({ success: true, message: "Password reset" });
});
