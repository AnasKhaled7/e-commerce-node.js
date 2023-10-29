const router = require("express").Router();

const { isAuthorized, isAuthenticated, isValid } = require("../../middlewares");
const { upload, filter } = require("../../utils/multer");
const categoryValidation = require("./category.validation");
const categoryController = require("./category.controller");

// create category
router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin", "manager"]),
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
  isAuthorized(["admin", "manager"]),
  upload(filter.image).single("image"),
  isValid(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

// delete category by id
router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized(["admin", "manager"]),
  isValid(categoryValidation.updateCategorySchema),
  categoryController.deleteCategory
);

module.exports = router;
