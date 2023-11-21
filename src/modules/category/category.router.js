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

// get category by id
router.get("/:categoryId", categoryController.getCategory);

// update category by id
router.put(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

// delete category by id
router.delete(
  "/:categoryId",
  isAuthenticated,
  isAdmin,
  isValid(categoryValidation.updateCategorySchema),
  categoryController.deleteCategory
);

export default router;
