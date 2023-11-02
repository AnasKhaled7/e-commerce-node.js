import { Types } from "mongoose";

export const isValidObjectId = (id, helper) =>
  Types.ObjectId.isValid(id) ? true : helper.message("Invalid ObjectId");
