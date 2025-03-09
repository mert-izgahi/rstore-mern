import { Router } from "express";
import { tryCatch } from "../middlewares/trycatch.middleware";
import { withAuth, authorizedFor } from "../middlewares/auth.middleware";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getTopRatedProducts
} from "../controllers/product.controller";

const router = Router();

router.post("/create-product", withAuth, authorizedFor("admin"), tryCatch(createProduct));
router.get("/get-products", tryCatch(getProducts));
router.get("/get-top-rated-products", tryCatch(getTopRatedProducts));
router.get("/get-product/:id", tryCatch(getProduct));
router.put("/update-product/:id", withAuth, authorizedFor("admin"), tryCatch(updateProduct));
router.delete("/delete-product/:id", withAuth, authorizedFor("admin"), tryCatch(deleteProduct));

export { router as productRouter };