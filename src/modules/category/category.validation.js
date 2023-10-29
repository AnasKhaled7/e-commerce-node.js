const joi = require("joi");

const { isValidObjectId } = require("../../utils/validation");

// create category
const createCategorySchema = joi
  .object({
    name: joi.string().trim().required(),
    description: joi.string().trim().required(),
  })
  .required();

// update category by id
const updateCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
    name: joi.string().trim(),
    description: joi.string().trim(),
  })
  .required();

// delete category by id
const deleteCategorySchema = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};
