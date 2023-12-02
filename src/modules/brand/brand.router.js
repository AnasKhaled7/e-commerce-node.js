import { Router } from "express";

import { isAuthenticated, isAdmin, isValid } from "../../middlewares/index.js";
import { upload, filter } from "../../utils/multer.js";
import * as brandValidation from "./brand.validation.js";
import * as brandController from "./brand.controller.js";

const router = Router();

// create brand
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(brandValidation.createBrandSchema),
  brandController.createBrand
);

// get all brands
router.get("/", brandController.getBrands);

// get brands names
router.get("/names", brandController.getBrandsNames);

// get brand by id
router.get("/:brandId", brandController.getBrand);

// update brand by id
router.patch(
  "/:brandId",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(brandValidation.updateBrandSchema),
  brandController.updateBrand
);

// delete brand by id
router.delete(
  "/:brandId",
  isAuthenticated,
  isAdmin,
  isValid(brandValidation.deleteBrandSchema),
  brandController.deleteBrand
);

export default router;
