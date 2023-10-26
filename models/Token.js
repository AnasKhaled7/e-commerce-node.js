const mongoose = require("mongoose");

// schema
const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  isValid: { type: Boolean, default: true },
  expireAt: { type: Date },
  agent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// model
const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);

module.exports = Token;
