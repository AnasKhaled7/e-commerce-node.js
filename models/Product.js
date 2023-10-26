const mongoose = require("mongoose");

// schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 50,
    lowercase: true,
    unique: true,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 500,
  },
  defaultImage: {
    id: { type: String, required: true },
    url: { type: String, required: true },
  },
  images: [
    {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  subcategory: {
    type: mongoose.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  brand: { type: mongoose.Types.ObjectId, ref: "Brand", required: true },
  price: { type: Number, min: 1, required: true },
  quantity: { type: Number, min: 1, required: true },
  sold: { type: Number, default: 0 },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// model
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
