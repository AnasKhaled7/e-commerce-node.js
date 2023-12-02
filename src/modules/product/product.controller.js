import { Brand, Category, Product } from "../../models/index.js";
import asyncHandler from "./../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// @desc      Create product
// @route     POST /api/v1/products
// @access    Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // check if the product is already exists
  const isProductExist = await Product.findOne({ name: req.body.name });
  if (isProductExist)
    return next(new Error("Product already exists", { cause: 409 }));

  // check if category exists
  const isCategoryExist = await Category.findById(req.body.category);
  if (!isCategoryExist)
    return next(new Error("Category not found", { cause: 404 }));

  // check if brand exists
  const isBrandExist = await Brand.findById(req.body.brand);
  if (!isBrandExist) return next(new Error("Brand not found", { cause: 404 }));

  // upload image to cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUDINARY_FOLDER_NAME}/products` }
  );

  // create product
  await Product.create({
    user: req.user._id,
    name: req.body.name,
    description: req.body.description,
    image: { id: public_id, url: secure_url },
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    countInStock: req.body.countInStock,
    discount: req.body.discount,
  });

  return res.status(201).json({ success: true });
});

// @desc      Get all products
// @route     GET /api/v1/products
// @access    Public
export const getProducts = asyncHandler(async (req, res, next) => {
  let { page, limit, search } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
  search = !search ? "" : search;

  const count = await Product.aggregate([
    { $match: { name: { $regex: search, $options: "i" } } },
  ]);

  const products = await Product.aggregate([
    { $match: { name: { $regex: search, $options: "i" } } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: "$brand" },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    {
      $project: {
        name: 1,
        image: 1,
        category: { _id: 1, name: 1 },
        brand: { _id: 1, name: 1 },
        price: 1,
        countInStock: 1,
        rating: 1,
        numReviews: 1,
        discount: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(count.length / limit),
    numOfProducts: count.length,
    products,
  });
});

// @desc      Get product by id
// @route     GET /api/v1/products/:productId
// @access    Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate([
    { path: "category", select: "name" },
    { path: "brand", select: "name" },
  ]);

  if (!product) return next(new Error("Product not found", { cause: 404 }));

  return res.status(200).json({ success: true, product });
});

// @desc     Get products by category
// @route    GET /api/v1/products/category/:category
// @access   Public
export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  let { page, limit, search } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
  search = !search ? "" : search;

  // check if the category exists
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  const count = await Product.aggregate([
    {
      $match: {
        name: { $regex: search, $options: "i" },
        category: category._id,
      },
    },
  ]);

  const products = await Product.aggregate([
    {
      $match: {
        name: { $regex: search, $options: "i" },
        category: category._id,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: "$brand" },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    {
      $project: {
        name: 1,
        image: 1,
        category: { _id: 1, name: 1 },
        brand: { _id: 1, name: 1 },
        price: 1,
        countInStock: 1,
        rating: 1,
        numReviews: 1,
        discount: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(count.length / limit),
    numOfProducts: count.length,
    products,
  });
});

// @desc     Get products by brand
// @route    GET /api/v1/products/brand/:brand
// @access   Public
export const getProductsByBrand = asyncHandler(async (req, res, next) => {
  let { page, limit, search } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
  search = !search ? "" : search;

  // check if the brand exists
  const brand = await Brand.findById(req.params.brand);
  if (!brand) return next(new Error("Brand not found", { cause: 404 }));

  const count = await Product.aggregate([
    {
      $match: {
        name: { $regex: search, $options: "i" },
        brand: brand._id,
      },
    },
  ]);

  const products = await Product.aggregate([
    {
      $match: {
        name: { $regex: search, $options: "i" },
        brand: brand._id,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: "$brand" },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) },
    {
      $project: {
        name: 1,
        image: 1,
        category: { _id: 1, name: 1 },
        brand: { _id: 1, name: 1 },
        price: 1,
        countInStock: 1,
        rating: 1,
        numReviews: 1,
        discount: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(count.length / limit),
    numOfProducts: count.length,
    products,
  });
});

// @desc      Update product by id
// @route     PATCH /api/v1/products/:productId
// @access    Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, category, brand, price, countInStock, discount } =
    req.body;

  // check if body is empty
  if (Object.keys(req.body).length === 0)
    return next(new Error("Nothing to update", { cause: 400 }));

  // check if the product exists
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  // check if the product name is already exists
  if (name) {
    const isProductNameExist = await Product.findOne({ name });
    if (isProductNameExist)
      return next(new Error("Product name already exists", { cause: 409 }));

    product.name = name;
  }

  // check if category exists
  if (category) {
    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist)
      return next(new Error("Category not found", { cause: 404 }));

    product.category = category;
  }

  // check if brand exists
  if (brand) {
    const isBrandExist = await Brand.findById(brand);
    if (!isBrandExist)
      return next(new Error("Brand not found", { cause: 404 }));

    product.brand = brand;
  }

  // update product
  product.description = description ? description : product.description;
  product.price = price ? price : product.price;
  product.countInStock = countInStock ? countInStock : product.countInStock;
  product.discount = discount ? discount : product.discount;
  await product.save();

  return res
    .status(200)
    .json({ success: true, message: "Product updated successfully", product });
});

// @desc      Update product image by id
// @route     PATCH /api/v1/products/:productId/image
// @access    Private/Admin
export const updateProductImage = asyncHandler(async (req, res, next) => {
  // check if no file
  if (!req.file) return next(new Error("Image is required", { cause: 400 }));

  // check if the product exists
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  // upload image to cloudinary
  const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
    public_id: product.image.id,
  });

  product.image.url = secure_url;

  // update product
  await product.save();

  return res
    .status(200)
    .json({ success: true, message: "Product image updated successfully" });
});

// @desc      Delete product by id
// @route     DELETE /api/v1/products/:productId
// @access    Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) return next(new Error("Product not found", { cause: 404 }));

  // delete images from cloudinary
  await cloudinary.uploader.destroy(product.image.id);

  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});
