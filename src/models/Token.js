import mongoose from "mongoose";

// schema
const TokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    token: { type: String, unique: true, required: true },
    expiresIn: { type: Date, required: true },
  },
  { timestamps: true }
);

// model
const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);

export default Token;
