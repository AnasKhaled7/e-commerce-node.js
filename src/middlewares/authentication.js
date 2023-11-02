import jwt from "jsonwebtoken";

import { Token } from "../models/index.js";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    // check token existence
    if (
      !token ||
      !token.startsWith("Bearer ") ||
      token.split(" ")[1] === "null"
    )
      return res
        .status(401)
        .json({ success: false, message: "Access token not valid" });

    // get token from header
    token = token.split(" ")[1];

    // check token existence
    const tokenDoc = await Token.findOne({ token });
    if (!tokenDoc)
      return res
        .status(401)
        .json({ success: false, message: "Access token not valid" });

    // check token isValid & expireAt date & user
    if (!tokenDoc.isValid || new Date() > tokenDoc.expireAt)
      return res
        .status(401)
        .json({ success: false, message: "Access token not valid" });

    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode)
      return res
        .status(401)
        .json({ success: false, message: "Access token not valid" });

    // check user
    if (tokenDoc.user.toString() !== decode._id)
      return res
        .status(401)
        .json({ success: false, message: "Access token not valid" });

    // attach user and token to req
    req.user = decode;
    req.token = token;

    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default isAuthenticated;
