import { Router } from "express";

import { isAuthenticated, isValid } from "../../middlewares/index.js";
import * as reviewValidation from "./review.validation.js";
import * as reviewController from "./review.controller.js";

const router = Router();

// create review
router.post(
  "/product/:productId",
  isAuthenticated,
  isValid(reviewValidation.createReviewSchema),
  reviewController.createReview
);

// get reviews of a product
router.get("/product/:productId", reviewController.getReviews);

export default router;
