const mongoose = require("mongoose");

// schema
const ReviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, default: 0, required: true },
  comment: { type: String },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now },
});

// model
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

module.exports = Review;
