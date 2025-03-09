import { Router } from "express";
import { tryCatch } from "../middlewares/trycatch.middleware";
import { withAuth, authorizedFor } from "../middlewares/auth.middleware";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

router.post(
  "/create-order",
  withAuth,
  authorizedFor("admin", "user"),
  tryCatch(createOrder)
);
router.get(
  "/get-orders",
  withAuth,
  authorizedFor("admin", "guest"),
  tryCatch(getOrders)
);

router.get("/get-order/:id", withAuth, tryCatch(getOrder));

router.put(
  "/update-order-status/:id",
  withAuth,
  authorizedFor("admin", "guest"),
  tryCatch(updateOrderStatus)
);

export { router as orderRouter };
