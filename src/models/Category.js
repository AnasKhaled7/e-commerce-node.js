import mongoose from "mongoose";
// schema
const CategorySchema = new mongoose.Schema(
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
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
