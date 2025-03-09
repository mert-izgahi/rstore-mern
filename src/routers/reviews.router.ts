import { Router } from "express";
import { tryCatch } from "../middlewares/trycatch.middleware";
import { withAuth, authorizedFor } from "../middlewares/auth.middleware";

import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller";

const router = Router();

router.post("/create-review", withAuth, tryCatch(createReview));

router.put("/update-review/:id", withAuth, tryCatch(updateReview));
router.delete(
  "/delete-review/:id",
  withAuth,
  tryCatch(deleteReview)
);
router.get(
  "/get-reviews",
  withAuth,
  authorizedFor("admin","guest"),
  tryCatch(getReviews)
);
export { router as reviewRouter };
