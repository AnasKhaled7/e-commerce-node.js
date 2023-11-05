import { Brand } from "../../models/index.js";
import cloudinary from "../../utils/cloud.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin/Manager
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // file
  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // check if the brand is already exists
  const isBrandExist = await Brand.findOne({ name });
  if (isBrandExist)
    return next(new Error("Brand already exists", { cause: 409 }));

  // upload image to cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUDINARY_FOLDER_NAME}/brands` }
  );

  // create brand
  const brand = await Brand.create({
    name,
    image: { id: public_id, url: secure_url },
    user: req.user._id,
  });

  return res
    .status(201)
    .json({ success: true, message: "Brand created successfully", brand });
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
  let { page, limit, search } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
  search = !search ? "" : search;

  const count = await Brand.aggregate([
    { $match: { name: { $regex: search, $options: "i" } } },
  ]);

  const brands = await Brand.aggregate([
    { $match: { name: { $regex: search, $options: "i" } } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    { $project: { name: 1, image: 1, createdAt: 1 } },
  ]);

  return res.status(200).json({
    success: true,
    current: page,
    total: Math.ceil(count.length / limit),
    numberOfBrands: count.length,
    brands,
  });
});

// @desc    Get brand by id
// @route   GET /api/brands/:brandId
// @access  Public
export const getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);

  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  return res.status(200).json({ success: true, brand });
});

// @desc    Update brand by id
// @route   PATCH /api/brands/:brandId
// @access  Private/Admin/Manager
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // check if body is empty
  if (!name && !req.file)
    return next(new Error("Name or image is required", { cause: 400 }));

  // check if the brand is found
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  // check if the brand is already exists
  if (name) {
    const isBrandExist = await Brand.findOne({ name });
    if (isBrandExist)
      return next(new Error("Brand already exists", { cause: 409 }));

    brand.name = name;
  }

  // file
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: brand.image.id,
    });

    brand.image.url = secure_url;
  }

  await brand.save();
  return res
    .status(200)
    .json({ success: true, message: "Brand updated successfully", brand });
});

// @desc    Delete brand by id
// @route   DELETE /api/brands/:brandId
// @access  Private/Admin/Manager
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.brandId);

  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  // delete image from cloudinary
  await cloudinary.uploader.destroy(brand.image.id);

  return res
    .status(200)
    .json({ success: true, message: "Brand deleted successfully" });
});
