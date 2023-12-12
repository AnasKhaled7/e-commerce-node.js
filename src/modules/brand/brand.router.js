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

// get brand
router.get(
  "/:brandId",
  isValid(brandValidation.brandIdSchema),
  brandController.getBrand
);

// update brand
router.patch(
  "/:brandId",
  isAuthenticated,
  isAdmin,
  isValid(brandValidation.updateBrandSchema),
  brandController.updateBrand
);

// update brand image
router.patch(
  "/:brandId/image",
  isAuthenticated,
  isAdmin,
  upload(filter.image).single("image"),
  isValid(brandValidation.brandIdSchema),
  brandController.updateBrandImage
);

// delete brand
router.delete(
  "/:brandId",
  isAuthenticated,
  isAdmin,
  isValid(brandValidation.brandIdSchema),
  brandController.deleteBrand
);

export default router;
