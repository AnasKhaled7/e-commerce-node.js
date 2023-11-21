import mongoose from "mongoose";

// schema
const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: mongoose.Types.ObjectId, ref: "Brand", required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    numReviews: { type: Number, min: 0, default: 0 },
    price: { type: Number, min: 1, required: true },
    countInStock: { type: Number, min: 1, required: true },
    sold: { type: Number, default: 0 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

// model
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
