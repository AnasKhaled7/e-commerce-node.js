const jwt = require("jsonwebtoken");

const { User, Token } = require("../models");

const isAuthenticated = async (req, res, next) => {
  try {
    // check token existence
    if (
      !req.header("Authorization") ||
      !req.header("Authorization").startsWith("Bearer ")
    )
      return res
        .status(401)
        .json({ success: false, message: "Access token missing from header" });

    // get token from header
    const token = req.header("Authorization").split(" ")[1];

    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // check token existence
    const tokenDoc = await Token.findOne({ token, user: decode._id });
    if (!tokenDoc)
      return res.status(401).json({ success: false, message: "Invalid token" });

    // check token validity
    if (!tokenDoc.isValid || tokenDoc.expireAt < new Date()) {
      await Token.findByIdAndDelete(tokenDoc._id);
      return res.status(401).json({ success: false, message: "Expired token" });
    }

    // check user existence
    const user = await User.findById(decode._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // check user status
    if (user.isBlocked.status)
      return res
        .status(403)
        .json({ success: false, message: "User is blocked" });

    // attach user and token to req
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = isAuthenticated;
