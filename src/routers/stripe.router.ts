import { Router } from "express";
import { tryCatch } from "../middlewares/trycatch.middleware";
import { authorizedFor, withAuth } from "../middlewares/auth.middleware";

import {
  createStripeSession,
  stripeSuccessCallback,
} from "../controllers/stripe.controller";

const router = Router();

router.post(
  "/create-stripe-session/:id",
  withAuth,
  authorizedFor("admin"),
  tryCatch(createStripeSession)
);
router.get(
  "/stripe-success-callback",
  withAuth,
  authorizedFor("admin"),
  tryCatch(stripeSuccessCallback)
);

export { router as stripeRouter };
