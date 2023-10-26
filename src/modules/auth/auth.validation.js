const joi = require("joi");

// register
const registerSchema = joi
  .object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi
      .string()
      .length(11)
      .regex(/^01[0-2,5]{1}[0-9]{8}$/)
      .required(),
    gender: joi.string().valid("m", "f").required(),
  })
  .required();

// login
const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
  })
  .required();

// send reset password code to email
const sendResetPasswordCodeSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// rest password
const resetPasswordSchema = joi
  .object({
    email: joi.string().email().required(),
    code: joi.string().length(6).required(),
    password: joi.string().min(6).max(50).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

module.exports = {
  registerSchema,
  loginSchema,
  sendResetPasswordCodeSchema,
  resetPasswordSchema,
};
