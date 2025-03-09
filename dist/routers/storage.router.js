"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRouter = void 0;
const express_1 = __importDefault(require("express"));
const storage_controller_1 = require("../controllers/storage.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
exports.storageRouter = router;
router.post("/upload-storage", auth_middleware_1.withAuth, (0, auth_middleware_1.authorizedFor)("admin"), storage_controller_1.uploadStorage);
router.delete("/delete-storage/:id", storage_controller_1.deleteStorage);
router.get("/get-storage/:id", storage_controller_1.getStorage);
