import mongoose from "mongoose";

// schema
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["m", "f"], required: true },
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dlyllff3q/image/upload/v1693919199/e-commerce/user/default-profile_vl2nvl.png",
      },
      id: { type: String, default: "e-commerce/user/default-profile_vl2nvl" },
    },
    isBlocked: {
      status: { type: Boolean, default: false },
      reason: { type: String },
    },
    role: {
      type: String,
      lowercase: true,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    resetPasswordCode: String,
    addresses: [
      {
        city: { type: String, required: true },
        street: { type: String, required: true },
        building: { type: String, required: true },
        floor: { type: String },
        apartment: { type: String },
        label: {
          type: String,
          required: true,
          lowercase: true,
          default: "home",
          enum: ["home", "work", "other"],
        },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
