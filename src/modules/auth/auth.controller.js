const bcryptjs = require("bcryptjs");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { User, Cart, Token } = require("../../models");
const sendEmail = require("../../utils/sendEmail");

// register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, gender } = req.body;

    // check user existence
    const isUser = await User.findOne({ email });
    if (isUser) return res.status(409).json({ message: "User already exists" });

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

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // check password
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

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

    // update user status
    user.isOnline = true;
    await user.save();

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// send reset password code to email
const sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;

    // check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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

    if (!isSent)
      return res.status(500).json({ message: "Failed to send email" });

    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    // check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // check code
    if (user.resetPasswordCode !== code)
      return res.status(400).json({ message: "Invalid code" });

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
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  sendResetPasswordCode,
  resetPassword,
};
