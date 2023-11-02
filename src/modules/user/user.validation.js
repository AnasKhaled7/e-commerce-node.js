// const joi = require("joi");

// const { isValidObjectId } = require("../../utils/validation");

import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// block & unblock user by id or email or phone number
export const blockUserSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
    reason: joi.string().trim(),
  })
  .required();
