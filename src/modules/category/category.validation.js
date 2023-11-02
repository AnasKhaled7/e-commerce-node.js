import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create category
export const createCategorySchema = joi
  .object({
    name: joi.string().trim().required(),
    description: joi.string().trim().required(),
  })
  .required();

// update category by id
export const updateCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
    description: joi.string().trim(),
  })
  .required();

// delete category by id
export const deleteCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
