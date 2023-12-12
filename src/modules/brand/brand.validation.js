import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create brand
export const createBrandSchema = joi
  .object({
    name: joi.string().trim().required(),
  })
  .required();

// get all brands
export const getBrandsSchema = joi
  .object({
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
  })
  .required();

// update brand
export const updateBrandSchema = joi
  .object({
    brandId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
  })
  .required();

// get brand | update brand image | delete brand
export const brandIdSchema = joi
  .object({
    brandId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
