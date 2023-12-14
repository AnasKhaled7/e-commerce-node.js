import joi from "joi";

import { isValidObjectId } from "../../utils/validation.js";

// create order
export const createOrderSchema = joi
  .object({
    orderItems: joi
      .array()
      .items(
        joi.object({
          product: joi.string().custom(isValidObjectId).required(),
          name: joi.string().required(),
          image: joi.string().required(),
          price: joi.number().required(),
          quantity: joi.number().required(),
          discount: joi.number().default(0),
          finalPrice: joi.number().required(),
        })
      )
      .required(),
    shippingAddress: joi
      .object({
        address: joi.string().required(),
        city: joi.string().required(),
        postalCode: joi.string().required(),
      })
      .required(),
    phone: joi
      .string()
      .length(11)
      .regex(/^01[0-2,5]{1}[0-9]{8}$/)
      .required(),
    itemsPrice: joi.number().required(),
    shippingPrice: joi.number().required(),
    totalPrice: joi.number().required(),
  })
  .required();

// update order to paid
export const updateOrderToPaidSchema = joi
  .object({
    orderId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// update order to delivered
export const updateOrderToDeliveredSchema = joi
  .object({
    orderId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

// get order by id
export const getOrderByIdSchema = joi
  .object({
    orderId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
