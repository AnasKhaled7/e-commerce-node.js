const mongoose = require("mongoose");

// schema
const CategorySchema = new mongoose.Schema({
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
  createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// model
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

module.exports = Category;
