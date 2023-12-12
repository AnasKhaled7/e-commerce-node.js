import { Router } from "express";

import { isAuthenticated, isAdmin, isValid } from "../../middlewares/index.js";
import { upload, filter } from "../../utils/multer.js";
import * as categoryValidation from "./category.validation.js";
import * as categoryController from "./category.controller.js";

const router = Router();

// create category
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(categoryValidation.createCategorySchema),
  categoryController.createCategory
);

// get all categories
router.get("/", categoryController.getCategories);

// get categories names
router.get("/names", categoryController.getCategoriesNames);

// get category
router.get(
  "/:categoryId",
  isValid(categoryValidation.categoryIdSchema),
  categoryController.getCategory
);

// update category
router.patch(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  isValid(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

// update category image
router.patch(
  "/:categoryId/image",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(categoryValidation.categoryIdSchema),
  categoryController.updateCategoryImage
);

// delete category
router.delete(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  isValid(categoryValidation.categoryIdSchema),
  categoryController.deleteCategory
);

export default router;
