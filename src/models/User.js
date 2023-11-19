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
    phone: { type: String },
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
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },
  },
  { timestamps: true }
);

// methods
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.encryptPhoneNumber = function (phone) {
  return cryptoJS.AES.encrypt(phone, process.env.ENCRYPTION_KEY).toString();
};

// hooks
UserSchema.pre("save", async function (next) {
  // hash password
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
