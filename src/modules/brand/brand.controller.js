import { Brand } from "../../models/index.js";
import cloudinary from "../../utils/cloud.js";
import asyncHandler from "../../utils/asyncHandler.js";

// create brand
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
    { folder: `${process.env.CLOUDINARY_FOLDER_NAME}/products/${name}` }
  );

  // create brand
  const brand = await Brand.create({
    name,
    image: { id: public_id, url: secure_url },
  });

  return res
    .status(201)
    .json({ success: true, message: "Brand created successfully", brand });
});

// get all brands
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
    message: "Get all brands successfully",
    current: page,
    total: Math.ceil(count.length / limit),
    numberOfBrands: count.length,
    brands,
  });
});

// get brand by id
export const getBrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);

  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  return res.status(200).json({ success: true, brand });
});

// update brand by id
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

  // upload image to cloudinary
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: category.image.id,
    });

    brand.image.url = secure_url;
  }

  await brand.save();
  return res
    .status(200)
    .json({ success: true, message: "Brand updated successfully" });
});

// delete brand by id
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findByIdAndDelete(brandId);

  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  return res
    .status(200)
    .json({ success: true, message: "Brand deleted successfully" });
});
