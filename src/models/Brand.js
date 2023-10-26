const mongoose = require("mongoose");

// schema
const brandSchema = new mongoose.Schema({
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// model
const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

module.exports = Brand;
