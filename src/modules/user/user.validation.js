import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// update user profile
export const updateProfileSchema = joi
  .object({
    firstName: joi.string().min(3).max(30),
    lastName: joi.string().min(3).max(30),
    email: joi.string().email().trim(),
    password: joi.string().min(6).max(50),
    phone: joi
      .string()
      .length(11)
      .regex(/^01[0-2,5]{1}[0-9]{8}$/),
  })
  .required();

// block & unblock user by id
export const blockUserSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
    reason: joi.string().trim(),
  })
  .required();

// get user by id
export const getUserSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// delete user by id
export const deleteUserSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// update user by id
export const updateUserSchema = joi.object({}).required();
