import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create category
export const createCategorySchema = joi
  .object({
    name: joi.string().trim().required(),
  })
  .required();

// get all categories
export const getCategoriesSchema = joi.object({
  page: joi.number(),
  limit: joi.number(),
  search: joi.string(),
});

// update category
export const updateCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
  })
  .required();

// delete category | update category image | get category
export const categoryIdSchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
