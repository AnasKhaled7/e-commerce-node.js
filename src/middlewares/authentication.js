import jwt from "jsonwebtoken";

import { Token, User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  // check token format
  if (!token || !token.startsWith(`${process.env.BEARER_TOKEN} `))
    return next(new Error("Access token not found", { cause: 401 }));

  // check payload
  token = token.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded)
    return next(new Error("Access token not valid", { cause: 401 }));

  // check token in database
  const tokenDB = await Token.findOne({ token });
  if (!tokenDB)
    return next(new Error("Access token not valid", { cause: 401 }));

  const user = await User.findById(decoded.userId).select("-password -__v");

  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check if the user is blocked
  if (user.isBlocked.status)
    return next(new Error("Your account is blocked", { cause: 403 }));

  // check if the token is expired
  if (
    tokenDB.expiresIn < Date.now() ||
    tokenDB.user.toString() !== user._id.toString() ||
    tokenDB.token !== token
  )
    return next(new Error("Access token expired", { cause: 401 }));

  req.user = user;
  req.token = token;
  return next();
});

export default isAuthenticated;
