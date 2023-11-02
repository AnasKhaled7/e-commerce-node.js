import mongoose from "mongoose";

// schema
const CartSchema = new mongoose.Schema(
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
      },
    ],
  },
  { timestamps: true }
);

// model
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
