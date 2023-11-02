import mongoose from "mongoose";

// schema
const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

// model
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
