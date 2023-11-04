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

// get category by id
export const getCategorySchema = joi.object({
  categoryId: joi.string().custom(isValidObjectId).required(),
});

// update category by id
export const updateCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
  })
  .required();

// delete category by id
export const deleteCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
