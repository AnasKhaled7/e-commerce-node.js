const mongoose = require("mongoose");

// schema
const OrderSchema = new mongoose.Schema({
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
      required: true,
      default: "home",
      enum: ["home", "work", "other"],
    },
  },
  phone: { type: String, required: true },
  total: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "processing", "delivering", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card"],
    default: "cash",
  },
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
