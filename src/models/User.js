const mongoose = require("mongoose");

// schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 30,
    lowercase: true,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 30,
    lowercase: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
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
  isOnline: { type: Boolean, default: false },
  isBlocked: {
    status: { type: Boolean, default: false },
    reason: { type: String },
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
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
        default: "home",
        enum: ["home", "work", "other"],
      },
      isDefault: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
