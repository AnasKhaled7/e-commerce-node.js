const joi = require("joi");

const { isValidObjectId } = require("../../utils/validation");

// block & unblock user by id or email or phone number
const blockUserSchema = joi
  .object({
    userId: joi.string().custom(isValidObjectId).required(),
    reason: joi.string().trim(),
  })
  .required();

module.exports = {
  blockUserSchema,
};
