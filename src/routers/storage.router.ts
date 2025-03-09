import express from "express";
import {
  deleteStorage,
  getStorage,
  uploadStorage,
} from "../controllers/storage.controller";

const router = express.Router();

router.post("/upload-storage", uploadStorage);
router.delete("/delete-storage/:id", deleteStorage);
router.get("/get-storage/:id", getStorage);
export { router as storageRouter };
