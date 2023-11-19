import mongoose from "mongoose";
import cryptoJS from "crypto-js";

// schema
const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        _id: false,
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered"],
      default: "pending",
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

// hooks
OrderSchema.pre("save", function (next) {
  // encrypt phone number
  this.shippingAddress.phone = cryptoJS.AES.encrypt(
    this.shippingAddress.phone,
    process.env.ENCRYPTION_KEY
  ).toString();

  next();
});

OrderSchema.post("save", function (doc, next) {
  // decrypt phone number
  doc.shippingAddress.phone = cryptoJS.AES.decrypt(
    doc.shippingAddress.phone,
    process.env.ENCRYPTION_KEY
  ).toString(cryptoJS.enc.Utf8);

  next();
});

// model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
