import joi from "joi";

// register
export const registerSchema = joi
  .object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(40).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// login
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(40).required(),
  })
  .required();

// send reset password code to email
export const sendResetPasswordCodeSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// rest password
export const resetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    code: joi.string().length(6).required(),
    password: joi.string().min(6).max(40).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
