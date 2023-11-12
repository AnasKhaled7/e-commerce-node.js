import { User } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc     Logout
// @route    PATCH /api/v1/users/logout
// @access   Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

// @desc     Get user profile
// @route    GET /api/v1/users/profile
// @access   Private
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password -__v");

  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ success: true, user });
});

// @desc     Update user profile
// @route    PATCH /api/v1/users/profile
// @access   Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // update user
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.phone) user.phone = req.body.phone;

  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "User updated successfully" });
});

// @desc     Block & unblock user by id
// @route    PATCH /api/v1/users/block/:userId
// @access   Private (admin, manager)
export const blockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  // check if the user is found
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check if the user is admin or manager
  if (user.role !== "user")
    return next(new Error("You can't block this account", { cause: 400 }));

  // check if the user is already blocked then unblock him
  if (user.isBlocked.status) {
    user.isBlocked.status = false;
    user.isBlocked.reason = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "user unblocked successfully" });
  }

  // block the user
  user.isBlocked.status = true;
  user.isBlocked.reason = req.body.reason;
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "user blocked successfully" });
});

// @desc     Get the number of users registered monthly for last year
// @route    GET /api/v1/users/monthly-users
// @access   Private (manager)
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
// @access   Private (manager)
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");

  return res.status(200).json({ success: true, data: users });
});

// @desc     Get user by id
// @route    GET /api/v1/users/:userId
// @access   Private (manager)
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select("-password");

  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ success: true, data: user });
});

// @desc     Delete user by id
// @route    DELETE /api/v1/users/:userId
// @access   Private (manager)
export const deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ success: true, message: "user deleted" });
});

// @desc     Update user by id
// @route    PATCH /api/v1/users/:userId
// @access   Private (manager)
export const updateUserById = asyncHandler(async (req, res, next) => {
  res.send("update user by id");
});
