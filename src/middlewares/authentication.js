import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.token;

  if (!token) return next(new Error("Access token not found", { cause: 401 }));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded)
    return next(new Error("Access token not valid", { cause: 401 }));

  const user = await User.findById(decoded.userId).select("-password -__v");

  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check if the user is blocked
  if (user.isBlocked.status)
    return next(new Error("Your account is blocked", { cause: 403 }));

  req.user = user;
  next();
});

export default isAuthenticated;
