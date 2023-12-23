import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    isBlocked: {
      status: { type: Boolean, default: false },
      reason: { type: String },
      date: { type: Date },
    },
    isAdmin: { type: Boolean, default: false },
    resetPasswordCode: String,
    shippingAddress: {
      _id: false,
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },
  },
  { timestamps: true }
);

// hooks
UserSchema.pre("save", async function (next) {
  // hash password
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// methods
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// model
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
