import express from "express";
import {
  deleteStorage,
  getStorage,
  uploadStorage,
} from "../controllers/storage.controller";
import { authorizedFor, withAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/upload-storage",withAuth,authorizedFor("admin"), uploadStorage);
router.delete("/delete-storage/:id", deleteStorage);
router.get("/get-storage/:id", getStorage);
export { router as storageRouter };
