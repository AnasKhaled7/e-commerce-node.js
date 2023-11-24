import { Router } from "express";

import { isAuthenticated, isAdmin, isValid } from "../../middlewares/index.js";
import { upload, filter } from "../../utils/multer.js";
import * as productValidation from "./product.validation.js";
import * as productController from "./product.controller.js";

const router = Router();

// create product
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(productValidation.createProductSchema),
  productController.createProduct
);

// get all products
router.get("/", productController.getProducts);

// get product by id
router.get("/:productId", productController.getProduct);

// get products by category
router.get(
  "/category/:category",
  isValid(productValidation.getProductsByCategorySchema),
  productController.getProductsByCategory
);

// get products by brand
router.get(
  "/brand/:brand",
  isValid(productValidation.getProductsByBrandSchema),
  productController.getProductsByBrand
);

// update product by id
router.patch(
  "/:productId",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(productValidation.updateProductSchema),
  productController.updateProduct
);

// delete product by id
router.delete(
  "/:productId",
  isAuthenticated,
  isAdmin,
  isValid(productValidation.deleteProductSchema),
  productController.deleteProduct
);

export default router;
