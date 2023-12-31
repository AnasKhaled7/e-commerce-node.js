import { Brand } from "../../models/index.js";
import cloudinary from "../../utils/cloud.js";
import asyncHandler from "../../utils/asyncHandler.js";

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
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

// @desc    Get all brands name
// @route   GET /api/brands/names
// @access  Public
export const getBrandsNames = asyncHandler(async (req, res) => {
  const brands = await Brand.find().select("name");
  return res.status(200).json({ success: true, brands });
});

// @desc    Get brand
// @route   GET /api/brands/:brandId
// @access  Public
export const getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);

  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  return res.status(200).json({ success: true, brand });
});

// @desc    Update brand
// @route   PATCH /api/brands/:brandId
// @access  Private/Admin
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // check if body is empty
  if (!name) return next(new Error("Name is required", { cause: 400 }));

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

  await brand.save();
  return res
    .status(200)
    .json({ success: true, message: "Brand updated successfully", brand });
});

// @desc    Update brand image
// @route   PATCH /api/brands/:brandId/image
// @access  Private/Admin
export const updateBrandImage = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // check if the brand is found
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  // upload image to cloudinary
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    public_id: brand.image.id,
  });

  brand.image.url = secure_url;

  await brand.save();
  return res
    .status(200)
    .json({ success: true, message: "Brand image updated successfully" });
});

// @desc    Delete brand
// @route   DELETE /api/brands/:brandId
// @access  Private/Admin
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.brandId);

  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  // delete image from cloudinary
  await cloudinary.uploader.destroy(brand.image.id);

  return res
    .status(200)
    .json({ success: true, message: "Brand deleted successfully" });
});
