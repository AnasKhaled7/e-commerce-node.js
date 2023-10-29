const mongoose = require("mongoose").Types;

const isValidObjectId = (id, helper) => {
  return mongoose.ObjectId.isValid(id)
    ? true
    : helper.message("Invalid ObjectId");
};

module.exports = {
  isValidObjectId,
};
