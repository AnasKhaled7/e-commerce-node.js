const mongoose = require("mongoose");

// schema
const SubcategorySchema = new mongoose.Schema(
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
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// model
const Subcategory =
  mongoose.models.Subcategory ||
  mongoose.model("Subcategory", SubcategorySchema);

module.exports = Subcategory;
