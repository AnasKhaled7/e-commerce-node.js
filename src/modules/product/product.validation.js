import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create product
export const createProductSchema = joi
  .object({
    name: joi.string().trim().required(),
    description: joi.string().trim().required(),
    price: joi.number().min(1).required(),
    quantity: joi.number().min(1).required(),
    category: joi.string().custom(isValidObjectId).required(),
    brand: joi.string().custom(isValidObjectId).required(),
    defaultImage: joi
      .object({
        id: joi.string().required(),
        url: joi.string().required(),
      })
      .required(),
    images: joi
      .array()
      .items(
        joi.object({
          id: joi.string().required(),
          url: joi.string().required(),
        })
      )
      .required(),
    discount: joi.number().min(0).max(100).default(0),
  })
  .required();

// get all products
export const getProductsSchema = joi.object({
  page: joi.number(),
  limit: joi.number(),
  search: joi.string(),
});

// get product by id
export const getProductSchema = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// get products by category
export const getProductsByCategorySchema = joi
  .object({
    category: joi.string().custom(isValidObjectId).required(),
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
  })
  .required();

// get products by brand
export const getProductsByBrandSchema = joi
  .object({
    brand: joi.string().custom(isValidObjectId).required(),
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
  })
  .required();

// update product by id
export const updateProductSchema = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
    description: joi.string().trim(),
    price: joi.number().min(1),
    quantity: joi.number().min(1),
    category: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId),
    defaultImage: joi.object({
      id: joi.string().required(),
      url: joi.string().required(),
    }),
    images: joi.array().items(
      joi.object({
        id: joi.string().required(),
        url: joi.string().required(),
      })
    ),
    discount: joi.number().min(0).max(100).default(0),
  })
  .required();

// delete product by id
export const deleteProductSchema = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
