import { Category } from "../../models/index.js";
import asyncHandler from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// @desc      Create category
// @route     POST /api/v1/categories
// @access    Private/Admin
export const createCategory = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // check if the category is already exists
  const isCategoryExist = await Category.findOne({ name: req.body.name });
  if (isCategoryExist)
    return next(new Error("Category already exists", { cause: 409 }));

  // upload image to cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUDINARY_FOLDER_NAME}/categories` }
  );

  // create category
  const category = await Category.create({
    name: req.body.name,
    image: { url: secure_url, id: public_id },
    user: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

// @desc      Get all categories
// @route     GET /api/v1/categories
// @access    Public
export const getCategories = asyncHandler(async (req, res) => {
  let { page, limit, search } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
  search = !search ? "" : search;

  const count = await Category.aggregate([
    { $match: { name: { $regex: search, $options: "i" } } },
  ]);

  const categories = await Category.aggregate([
    { $match: { name: { $regex: search, $options: "i" } } },
    { $unwind: "$user" },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    { $project: { name: 1, image: 1 } },
  ]);

  return res.status(200).json({
    success: true,
    current: page,
    total: Math.ceil(count.length / limit),
    numberOfCategories: count.length,
    categories,
  });
});

// @desc      Get all categories names
// @route     GET /api/v1/categories/names
// @access    Public
export const getCategoriesNames = asyncHandler(async (req, res) => {
  const categories = await Category.find().select("name");
  return res.status(200).json({ success: true, categories });
});

// @desc      Get category by id
// @route     GET /api/v1/categories/:categoryId
// @access    Public
export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId).select(
    "name"
  );

  // check if the category is found
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  return res.status(200).json({ success: true, category });
});

// @desc      Update category by id
// @route     PUT /api/v1/categories/:categoryId
// @access    Private/Admin
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // check if body is empty
  if (!name || !req.file)
    return next(new Error("Name or image is required", { cause: 400 }));

  // check if the category is found
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  // check if the category is already exists
  if (name) {
    isCategoryExist = await Category.findOne({ name });
    if (isCategoryExist)
      return next(new Error("Category already exists", { cause: 409 }));

    category.name = name;
  }

  // file
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: category.image.id,
    });

    category.image.url = secure_url;
  }

  await category.save();
  return res
    .status(200)
    .json({ success: true, message: "Category updated successfully" });
});

// @desc      Delete category by id
// @route     DELETE /api/v1/categories/:categoryId
// @access    Private/Admin
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);

  // check if the category is found
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  // delete image from cloudinary
  await cloudinary.uploader.destroy(category.image.id);

  return res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
});
