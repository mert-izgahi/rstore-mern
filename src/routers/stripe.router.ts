import { Router } from "express";
import { tryCatch } from "../middlewares/trycatch.middleware";
import { withAuth } from "../middlewares/auth.middleware";

import {
  createStripeSession,
  stripeSuccessCallback,
} from "../controllers/stripe.controller";

const router = Router();

router.post(
  "/create-stripe-session/:id",
  withAuth,
  tryCatch(createStripeSession)
);
router.get("/stripe-success-callback", withAuth, tryCatch(stripeSuccessCallback));

export { router as stripeRouter };
