import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cryptoJS from "crypto-js";

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
          "https://res.cloudinary.com/dlyllff3q/image/upload/v1699112868/e-commerce/users/default-profile_bjvilu.png",
      },
      id: { type: String, default: "e-commerce/users/default-profile_bjvilu" },
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

// methods
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// hooks
UserSchema.pre("save", async function (next) {
  // hash password
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
    this.password = await bcrypt.hash(this.password, salt);
  }

  // encrypt phone number
  if (this.isModified("phone")) {
    this.phone = cryptoJS.AES.encrypt(
      this.phone,
      process.env.ENCRYPTION_KEY
    ).toString();
  }

  next();
});

// model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
