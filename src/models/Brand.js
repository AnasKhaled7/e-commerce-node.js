import mongoose from "mongoose";

// schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      unique: true,
      required: true,
      trim: true,
    },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// model
const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

export default Brand;
