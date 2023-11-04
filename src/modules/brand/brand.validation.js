import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create brand
export const createBrandSchema = joi
  .object({
    name: joi.string().trim().required(),
  })
  .required();

// get all brands
export const getBrandsSchema = joi.object({
  page: joi.number(),
  limit: joi.number(),
  search: joi.string(),
});

// get brand by id
export const getBrandSchema = joi.object({
  brandId: joi.string().custom(isValidObjectId).required(),
});

// update brand by id
export const updateBrandSchema = joi
  .object({
    brandId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
  })
  .required();

// delete brand by id
export const deleteBrandSchema = joi
  .object({
    brandId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
