import bcryptjs from "bcryptjs";
import cryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { User, Cart, Token } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";
import sendEmail from "../../utils/sendEmail.js";

// register
export const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, gender } = req.body;

  // check user existence
  const isUser = await User.findOne({ email });
  if (isUser) return next(new Error("User already exists", { cause: 409 }));

  // hash password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  // encrypt phone number
  const encryptPhone = cryptoJS.AES.encrypt(
    phone,
    process.env.ENCRYPTION_KEY
  ).toString();

  // create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    phone: encryptPhone,
    gender,
  });

  // create cart
  await Cart.create({ user: user._id });

  return res.status(201).json({ success: true, message: "User created" });
});

// login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check password
  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) return next(new Error("Invalid credentials", { cause: 400 }));

  // generate token
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  // save token
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
    expireAt: new Date(jwt.decode(token).exp * 1000),
  });

  return res.status(200).json({ success: true, token });
});

// send reset password code to email
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

// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;

  // check user existence
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check code
  if (user.resetPasswordCode !== code)
    return next(new Error("Invalid code", { cause: 400 }));

  // hash password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  // update password
  user.password = hashPassword;
  user.resetPasswordCode = undefined;
  await user.save();

  // delete tokens
  await Token.deleteMany({ user: user._id });

  return res.status(200).json({ success: true, message: "Password reset" });
});
