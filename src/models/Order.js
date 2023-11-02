import mongoose from "mongoose";

// schema
const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        _id: false,
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
        image: {
          id: { type: String, required: true },
          url: { type: String, required: true },
        },
      },
    ],
    shippingAddress: {
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
    paymentMethod: {
      type: String,
      lowercase: true,
      default: "cash",
      enum: ["cash", "card"],
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, default: 0.0 },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
