const mongoose = require("mongoose");

// schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      lowercase: true,
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
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

module.exports = Category;
