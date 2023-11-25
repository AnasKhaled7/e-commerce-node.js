import mongoose from "mongoose";

// schema
const BrandSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    name: { type: String, unique: true, required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// model
const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

export default Brand;
