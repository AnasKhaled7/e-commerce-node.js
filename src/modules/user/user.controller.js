import { Token, User } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc     Get user profile
// @route    GET /api/v1/users/profile
// @access   Private
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -__v -createdAt -updatedAt -isBlocked -resetPasswordCode"
  );
  return res.status(200).json({ success: true, user });
});

// @desc     Logout
// @route    POST /api/v1/users/logout
// @access   Private
export const logout = asyncHandler(async (req, res, next) => {
  // delete token from database
  await Token.findOneAndDelete({ token: req.token });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

// @desc     Update user profile
// @route    PATCH /api/v1/users/profile
// @access   Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const {
    email,
    password,
    phone,
    firstName,
    lastName,
    address,
    city,
    postalCode,
  } = req.body;

  // check if body is empty
  if (Object.keys(req.body).length === 0)
    return next(new Error("Please provide data to update", { cause: 400 }));

  const user = await User.findById(req.user._id);

  // update user
  if (email) {
    // check if the email is already taken
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist)
      return next(new Error("Email is already taken", { cause: 409 }));
    user.email = email;
  }
  if (password) user.password = password;
  user.phone = phone || user.phone;
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;

  user.shippingAddress.address = address || user.shippingAddress.address;
  user.shippingAddress.city = city || user.shippingAddress.city;
  user.shippingAddress.postalCode =
    postalCode || user.shippingAddress.postalCode;

  await user.save();

  const { password: _, ...rest } = user._doc;
  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: rest,
  });
});

// @desc     Get the number of users registered monthly for last year
// @route    GET /api/v1/users/monthly-users
// @access   Private/Admin
export const monthlyUsers = asyncHandler(async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const users = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: lastYear },
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);

  return res.status(200).json({ success: true, data: users });
});

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  let { page, limit, search } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
  search = !search ? "" : search;

  const users = await User.aggregate([
    {
      $match: {
        email: { $regex: search, $options: "i" },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user",
        as: "orders",
      },
    },
    {
      $project: {
        _id: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        isBlocked: 1,
        createdAt: 1,
        ordersCount: { $size: "$orders" },
        totalPrice: { $sum: "$orders.totalPrice" },
      },
    },
  ]);

  const count = await User.aggregate([
    { $match: { email: { $regex: search, $options: "i" } } },
  ]);

  return res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(count.length / limit),
    numOfUsers: count.length,
    users,
  });
});

// @desc     Get user by id
// @route    GET /api/v1/users/:userId
// @access   Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select("-password -__v");

  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ success: true, user });
});

// @desc     Block  user by id
// @route    PATCH /api/v1/users/block/:userId
// @access   Private/Admin
export const blockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (user.isAdmin)
    return next(new Error("You can't block admin account", { cause: 400 }));

  // block the user
  user.isBlocked.status = true;
  user.isBlocked.reason = req.body.reason;
  user.isBlocked.date = Date.now();
  await user.save();

  await Token.deleteMany({ user: user._id });

  return res
    .status(200)
    .json({ success: true, message: "User blocked successfully" });
});

// @desc     unblock user by id
// @route    PATCH /api/v1/users/block/:userId
// @access   Private/Admin
export const unblockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) return next(new Error("User not found", { cause: 404 }));

  user.isBlocked.status = false;
  user.isBlocked.reason = undefined;
  user.isBlocked.date = undefined;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "User unblocked successfully" });
});
