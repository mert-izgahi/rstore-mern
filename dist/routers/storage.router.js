"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRouter = void 0;
const express_1 = __importDefault(require("express"));
const storage_controller_1 = require("../controllers/storage.controller");
const router = express_1.default.Router();
exports.storageRouter = router;
router.post("/upload-storage", storage_controller_1.uploadStorage);
router.delete("/delete-storage/:id", storage_controller_1.deleteStorage);
router.get("/get-storage/:id", storage_controller_1.getStorage);
