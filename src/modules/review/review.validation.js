import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create review
export const createReviewSchema = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().trim().allow(""),
  })
  .required();
