const mongoose = require("mongoose");

// schema
const CartSchema = new mongoose.Schema({
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
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// model
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

module.exports = Cart;
