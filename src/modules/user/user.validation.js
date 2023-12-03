import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// update user profile
export const updateProfileSchema = joi
  .object({
    firstName: joi.string().min(3).max(30),
    lastName: joi.string().min(3).max(30),
    email: joi.string().email().trim(),
    password: joi.string().min(6).max(40),
    confirmPassword: joi.string().valid(joi.ref("password")),
    address: joi.string(),
    city: joi.string(),
    postalCode: joi.string(),
    phone: joi
      .string()
      .length(11)
      .regex(/^01[0-2,5]{1}[0-9]{8}$/),
  })
  .required();

// get all users
export const getUsersSchema = joi
  .object({
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
  })
  .required();

// get user by id & unblock user by id
export const userIdSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// block user by id
export const blockUserSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
    reason: joi.string().trim().required(),
  })
  .required();
