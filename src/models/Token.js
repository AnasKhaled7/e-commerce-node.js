import mongoose from "mongoose";

// schema
const TokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    isValid: { type: Boolean, default: true },
    expireAt: { type: Date },
    agent: { type: String },
  },
  { timestamps: true }
);

// model
const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);

export default Token;
