import mongoose from "mongoose";

import { Product, Review } from "../../models/index.js";
import asyncHandler from "./../../utils/asyncHandler.js";

// @desc      Create new review
// @route     POST /api/v1/reviews/product/:productId
// @access    Private
export const createReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;
  const user = req.user._id;

  const product = await Product.findById(productId);

  if (!product) return next(new Error("Product not found", { cause: 404 }));

  const alreadyReviewed = await Review.findOne({ user, product: productId });

  if (alreadyReviewed)
    return next(new Error("Product already reviewed", { cause: 400 }));

  await Review.create({
    rating,
    comment,
    user,
    product: productId,
  });

  // update product rating and numReviews
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  product.rating = totalRating / product.numReviews;

  await product.save();

  return res
    .status(201)
    .json({ success: true, message: "Review added successfully" });
});

// @desc      Get reviews of a product
// @route     GET /api/v1/reviews/product/:productId
// @access    Public
export const getReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  let { page, limit } = req.query;

  page = !page || page < 1 || isNaN(page) ? 1 : page;
  limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  const reviews = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
        user: { _id: 1, firstName: 1 },
      },
    },
  ]);

  const totalReviews = await Review.countDocuments({ product: productId });

  return res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(totalReviews / limit),
    numOfReviews: totalReviews,
    reviews,
  });
});
