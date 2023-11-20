import crypto from "crypto";

import { User, Cart } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";
import generateToken from "../../utils/generateToken.js";
import sendEmail from "../../utils/sendEmail.js";

// @desc     Register
// @route    POST /api/v1/auth/register
// @access   Public
export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // check user existence
  const isUserExist = await User.findOne({ email });
  if (isUserExist)
    return next(new Error("User already exists", { cause: 409 }));

  // create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
  });

  // create cart
  await Cart.create({ user: user._id });

  // generate token
  generateToken(res, user._id);

  // return user data without password and __v fields
  const { password: userPassword, __v, ...userData } = user._doc;

  return res.status(201).json(userData);
});

// @desc     Login
// @route    POST /api/v1/auth/login
// @access   Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid credentials", { cause: 400 }));

  // check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new Error("Invalid credentials", { cause: 400 }));

  // generate token
  generateToken(res, user._id);

  // return user data without password and __v fields
  const { password: userPassword, __v, ...userData } = user._doc;

  return res.status(200).json(userData);
});

// @desc     Send reset password code to email
// @route    PATCH /api/v1/auth/reset-password-code
// @access   Public
export const sendResetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // generate code
  const code = crypto.randomBytes(3).toString("hex");
  user.resetPasswordCode = code;
  await user.save();

  // send email
  const isSent = await sendEmail({
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Password Code",
    html: `<h1>${code}</h1>`,
  });

  if (!isSent) return next(new Error("Email not sent", { cause: 500 }));

  return res.status(200).json({ success: true, message: "Email sent" });
});

// @desc     Reset password
// @route    PATCH /api/v1/auth/reset-password
// @access   Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;

  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check code
  if (user.resetPasswordCode !== code)
    return next(new Error("Invalid code", { cause: 400 }));

  // update password
  user.password = password;
  user.resetPasswordCode = undefined;
  await user.save();

  return res.status(200).json({ success: true, message: "Password reset" });
});
