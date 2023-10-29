const mongoose = require("mongoose");

// schema
const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        _id: false,
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        productName: { type: String, required: true },
        productPrice: { type: Number, required: true },
      },
    ],
    address: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      building: { type: String, required: true },
      floor: { type: String },
      apartment: { type: String },
      label: {
        type: String,
        lowercase: true,
        required: true,
        default: "home",
        enum: ["home", "work", "other"],
      },
    },
    phone: { type: String, required: true },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      lowercase: true,
      default: "pending",
      enum: ["pending", "processing", "delivering", "delivered", "cancelled"],
    },
    paymentMethod: {
      type: String,
      lowercase: true,
      default: "cash",
      enum: ["cash", "card"],
    },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
